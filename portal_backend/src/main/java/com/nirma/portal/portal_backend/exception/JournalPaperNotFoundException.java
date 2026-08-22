package com.nirma.portal.portal_backend.exception;

public class JournalPaperNotFoundException extends RuntimeException {
    private static final long serialVersionUID = 1L;

	public JournalPaperNotFoundException(String message) {
        super(message);
    }
}