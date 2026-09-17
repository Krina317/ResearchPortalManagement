package com.nirma.portal.portal_backend.exception;

public class DuplicateBookChapterException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public DuplicateBookChapterException(String message) {
        super(message);
    }
}