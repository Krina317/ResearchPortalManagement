package com.nirma.portal.portal_backend.exception;

public class BookChapterNotFoundException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public BookChapterNotFoundException(String message) {
        super(message);
    }
}