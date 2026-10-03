package com.nirma.portal.portal_backend.matching;

import java.util.*;
import java.util.regex.*;

/**
 * Deterministic-first faculty name matcher.
 * Decides NU / REVIEW / EXTERNAL for an author name against a faculty list.
 * No Spring or JPA dependencies, so it is trivial to unit test.
 */
public class FacultyNameMatcher {

	public enum Status { NU, REVIEW, NO_MATCH }

    public record Faculty(Long id, String rawName) {}

    public record Result(Status status, Long facultyId, boolean needsReview, String reason) {
    	static Result noMatch(String r) { return new Result(Status.NO_MATCH, null, false, r); }
    }

    private static final Set<String> TITLES = Set.of("DR", "PROF", "PROFESSOR", "MR", "MS", "MRS", "SHRI", "SMT");
    /** Surnames so common that a name without a middle initial cannot be trusted. */
    private static final Set<String> COMMON_SURNAMES = Set.of("PATEL", "SHAH");
    private static final Pattern CODE = Pattern.compile("\\(([A-Za-z]+)\\)");

    private static final class Parsed {
        Faculty faculty;
        List<String> full = new ArrayList<>();   // tokens longer than 1 letter
        List<String> single = new ArrayList<>(); // single-letter tokens
        Set<Character> mids = new HashSet<>();   // known middle initials
    }

    private final List<Parsed> index = new ArrayList<>();

    public FacultyNameMatcher(List<Faculty> facultyList) {
        for (Faculty f : facultyList) index.add(parseFaculty(f));
    }

    // ---------- normalisation ----------

    static List<String> tokens(String s) {
        String t = s.toUpperCase().replaceAll("\\(.*?\\)", " ").replaceAll("[^A-Z ]", " ");
        List<String> out = new ArrayList<>();
        for (String x : t.trim().split("\\s+")) if (!x.isEmpty() && !TITLES.contains(x)) out.add(x);
        return out;
    }

    private Parsed parseFaculty(Faculty f) {
        Parsed p = new Parsed();
        p.faculty = f;
        for (String t : tokens(f.rawName())) (t.length() > 1 ? p.full : p.single).add(t);

        // The bracket code (SGP, JAP...) holds the middle initial: remove the initials we already know.
        Matcher m = CODE.matcher(f.rawName());
        List<Character> left = new ArrayList<>();
        if (m.find()) for (char c : m.group(1).toUpperCase().toCharArray()) left.add(c);
        for (String t : p.full) left.remove((Character) t.charAt(0));
        for (String t : p.single) left.remove((Character) t.charAt(0));
        p.mids.addAll(left);
        if (p.full.size() >= 2) for (String t : p.single) p.mids.add(t.charAt(0)); // "Nileshkumar R Patel"
        return p;
    }

    // ---------- matching ----------

    public Result match(String authorName) {
        List<String> a = tokens(authorName);
        if (a.size() < 2) return Result.noMatch("single-token name");

        List<Candidate> ok = new ArrayList<>();
        List<Candidate> review = new ArrayList<>();
        List<String> conflicts = new ArrayList<>();

        for (Parsed f : index) {
            Candidate c = evaluate(a, f);
            if (c == null) continue;
            switch (c.kind) {
                case OK -> ok.add(c);
                case REVIEW -> review.add(c);
                case CONFLICT -> conflicts.add(c.reason);
            }
        }

        if (ok.size() == 1) {
            Candidate c = ok.get(0);
            return new Result(Status.NU, c.f.faculty.id(), c.flag, c.reason);
        }
        if (ok.size() > 1) return new Result(Status.REVIEW, null, true, "matches several faculty: " + names(ok));
        if (!review.isEmpty()) {
            Candidate c = review.get(0);
            Long id = review.size() == 1 ? c.f.faculty.id() : null;
            return new Result(Status.REVIEW, id, true, c.reason);
        }
        return Result.noMatch(conflicts.isEmpty() ? "" : String.join("; ", conflicts));
    }

    private enum Kind { OK, REVIEW, CONFLICT }

    private static final class Candidate {
        Parsed f; Kind kind; boolean flag; String reason;
        Candidate(Parsed f, Kind k, boolean flag, String reason) { this.f = f; this.kind = k; this.flag = flag; this.reason = reason; }
    }

    private Candidate evaluate(List<String> author, Parsed f) {
        Set<String> facFull = new HashSet<>(f.full);

        // "VRAJESH KUMAR" -> "VRAJESHKUMAR" when the faculty record has the joined form
        List<String> a = new ArrayList<>();
        for (String t : author) {
            boolean split = false;
            // "JAIPRAKASH" -> "JAI", "PRAKASH" when the faculty record has the split form
            for (int i = 0; i < f.full.size() - 1 && !split; i++)
                if ((f.full.get(i) + f.full.get(i + 1)).equals(t)) { a.add(f.full.get(i)); a.add(f.full.get(i + 1)); split = true; }
            if (!split) a.add(t);
        }
        for (int i = 0; i < a.size() - 1; ) {
            if (facFull.contains(a.get(i) + a.get(i + 1))) { a.set(i, a.get(i) + a.get(i + 1)); a.remove(i + 1); }
            else i++;
        }
        List<String> aFull = new ArrayList<>(), aSingle = new ArrayList<>();
        for (String t : a) (t.length() > 1 ? aFull : aSingle).add(t);

        int identity = 0;
        for (String t : f.full) if (aFull.contains(t)) identity++;
        int needed = f.full.size() >= 2 ? 2 : 1 + (f.single.isEmpty() ? 0 : 1);   // "Deepa R" needs DEEPA and R
        if (f.full.size() < 2) for (String s : f.single) if (aSingle.contains(s)) identity++;

        if (identity >= needed) {
            List<String> extras = new ArrayList<>();
            for (String t : aFull) if (!facFull.contains(t)) extras.add(t);
            for (String s : aSingle) if (f.full.size() >= 2 || !f.single.contains(s)) extras.add(s);

            List<String> unmatched = new ArrayList<>();
            for (String t : f.full) if (!aFull.contains(t)) unmatched.add(t);

            Set<Character> allowed = new HashSet<>(f.mids);
            for (String u : unmatched) allowed.add(u.charAt(0));

            List<String> bad = new ArrayList<>();
            if (!allowed.isEmpty()) for (String e : extras) if (!allowed.contains(e.charAt(0))) bad.add(e);

            if (bad.isEmpty()) {
                boolean verified = !extras.isEmpty() && !allowed.isEmpty();
                boolean commonSurname = f.full.stream().anyMatch(COMMON_SURNAMES::contains);
                boolean flag = commonSurname && !verified;
                return new Candidate(f, Kind.OK, flag,
                        flag ? "common surname; name has no middle initial to confirm (faculty: " + f.faculty.rawName().trim() + ")" : "");
            }
            // middle name present on both sides but spelled differently (RAMACHAL SINGH / RAMCHALSINGH)
            String joined = String.join("", extras);
            for (String u : unmatched)
                if (u.length() > 3 && distance(joined, u) <= 2)
                    return new Candidate(f, Kind.REVIEW, true, "middle name spelled differently (faculty: " + f.faculty.rawName().trim() + ")");
            return new Candidate(f, Kind.CONFLICT, false,
                    "middle initial " + bad + " conflicts with " + f.faculty.rawName().trim());
        }

        // typo fallback: one name token exact, the other within 2 edits (PREETI / PRITI)
        if (f.full.size() >= 2) {
            int exact = 0, near = 0;
            boolean exactIsCommon = false;
            for (String t : f.full) if (aFull.contains(t) && COMMON_SURNAMES.contains(t)) exactIsCommon = true;
            int maxDist = exactIsCommon ? 1 : 2;   // PATEL matches too many people to be lenient
            for (String t : f.full) {
                if (aFull.contains(t)) exact++;
                else for (String x : aFull) {
                    boolean longEnough = x.length() >= 5 && t.length() >= 5;
                    boolean prefix = !exactIsCommon && longEnough && (x.startsWith(t) || t.startsWith(x));   // DEVENDRASINH / DEVENDRA
                    if (longEnough && (distance(x, t) <= maxDist || prefix)) { near++; break; }
                }
            }
            if (exact >= 1 && exact + near >= 2)
                return new Candidate(f, Kind.REVIEW, true, "similar spelling to " + f.faculty.rawName().trim());
        }
        return null;
    }

    private static String names(List<Candidate> cs) {
        StringBuilder sb = new StringBuilder();
        for (Candidate c : cs) sb.append(sb.length() == 0 ? "" : " | ").append(c.f.faculty.rawName().trim());
        return sb.toString();
    }

    static int distance(String a, String b) {
        int[] p = new int[b.length() + 1];
        for (int j = 0; j <= b.length(); j++) p[j] = j;
        for (int i = 1; i <= a.length(); i++) {
            int[] c = new int[b.length() + 1];
            c[0] = i;
            for (int j = 1; j <= b.length(); j++)
                c[j] = Math.min(Math.min(p[j] + 1, c[j - 1] + 1), p[j - 1] + (a.charAt(i - 1) == b.charAt(j - 1) ? 0 : 1));
            p = c;
        }
        return p[b.length()];
    }
}