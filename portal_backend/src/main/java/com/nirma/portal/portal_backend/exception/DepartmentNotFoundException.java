package com.nirma.portal.portal_backend.exception;

public class DepartmentNotFoundException extends RuntimeException{
	public DepartmentNotFoundException(String message) {
		super(message);
	}
}
