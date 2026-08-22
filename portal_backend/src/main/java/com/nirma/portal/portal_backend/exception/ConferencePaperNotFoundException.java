package com.nirma.portal.portal_backend.exception;

public class ConferencePaperNotFoundException extends RuntimeException {
    private static final long serialVersionUID = 1L;

	public ConferencePaperNotFoundException(String message) {
        super(message);
    }
}