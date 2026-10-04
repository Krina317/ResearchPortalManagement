package com.nirma.portal.portal_backend.exception;

public class PublicationAuthorNotFoundException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public PublicationAuthorNotFoundException(String message) {
        super(message);
    }
}