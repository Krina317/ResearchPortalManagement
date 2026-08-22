package com.nirma.portal.portal_backend.exception;

public class AuthorRecordNotFoundException extends RuntimeException {
	private static final long serialVersionUID = 1L;

	public AuthorRecordNotFoundException(String message) {
		super(message);
	}
}
