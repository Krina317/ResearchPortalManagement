package com.nirma.portal.portal_backend.matching;

import java.util.ArrayList;
import java.util.List;

/** Cleans a raw author cell and splits cells that contain several authors. */
public final class AuthorNameSplitter {
    private AuthorNameSplitter() {}

    public static List<String> split(String raw) {
        List<String> out = new ArrayList<>();
        if (raw == null) return out;
        String cleaned = raw.replace('\u00a0', ' ').replaceAll("\\s+", " ").trim();
        if (cleaned.isEmpty()) return out;

        for (String semi : cleaned.split(";")) {
            String[] commaParts = semi.split(",");
            boolean allFullNames = commaParts.length > 1;
            for (String p : commaParts) if (p.trim().split("\\s+").length < 2) allFullNames = false;
            if (allFullNames) for (String p : commaParts) add(out, p);   // "A B, C D" -> two authors
            else add(out, semi);                                         // "PATEL, JIGNA" stays one
        }
        return out;
    }

    private static void add(List<String> out, String s) {
        String t = s.trim();
        if (!t.isEmpty()) out.add(t);
    }
}