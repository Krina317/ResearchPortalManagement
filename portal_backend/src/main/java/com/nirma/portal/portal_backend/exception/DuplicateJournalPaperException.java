package com.nirma.portal.portal_backend.exception;

public class DuplicateJournalPaperException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public DuplicateJournalPaperException(String message) {
        super(message);
    }
}