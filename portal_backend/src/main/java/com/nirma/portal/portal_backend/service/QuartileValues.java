package com.nirma.portal.portal_backend.service;

import java.util.List;

public final class QuartileValues {
    private static final List<String> ALLOWED = List.of("Q1", "Q2", "Q3", "Q4", "Scopus Only", "N/A");

    private QuartileValues() {}

    /** Returns the canonical value, or null for blank (clears it). Throws on anything else. */
    public static String normalize(String raw) {
        if (raw == null || raw.isBlank()) return null;
        String t = raw.trim();
        for (String a : ALLOWED) {
            if (a.equalsIgnoreCase(t)) return a;
        }
        throw new IllegalArgumentException("Quartile must be one of Q1, Q2, Q3, Q4, Scopus Only or N/A");
    }
}