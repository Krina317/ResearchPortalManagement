package com.nirma.portal.portal_backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {
	
	@ExceptionHandler(AuthorRecordNotFoundException.class)
	public ResponseEntity<ErrorResponse> handleAuthorRecordNotFound(AuthorRecordNotFoundException ex) {
        ErrorResponse error = new ErrorResponse(
                HttpStatus.NOT_FOUND.value(),
                ex.getMessage(),
                LocalDateTime.now()
        );
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }
	
	@ExceptionHandler(ConferencePaperNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleConferencePaperNotFound(ConferencePaperNotFoundException ex) {
        ErrorResponse error = new ErrorResponse(
                HttpStatus.NOT_FOUND.value(),
                ex.getMessage(),
                LocalDateTime.now()
        );
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

	@ExceptionHandler(DepartmentNotFoundException.class)
	public ResponseEntity<ErrorResponse> handleDepartmentNotFound(DepartmentNotFoundException ex){
		ErrorResponse error = new ErrorResponse(
				HttpStatus.NOT_FOUND.value(),
				ex.getMessage(),
				LocalDateTime.now()
				);
		return new ResponseEntity<>(error,HttpStatus.NOT_FOUND);
	}
	 @ExceptionHandler(ExcelColumnMapNotFoundException.class)
	    public ResponseEntity<ErrorResponse> handleExcelColumnMapNotFound(ExcelColumnMapNotFoundException ex) {
	        ErrorResponse error = new ErrorResponse(
	                HttpStatus.NOT_FOUND.value(),
	                ex.getMessage(),
	                LocalDateTime.now()
	        );
	        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
	    }
	 @ExceptionHandler(DuplicateConferencePaperException.class)
	    public ResponseEntity<ErrorResponse> handleDuplicateConferencePaper(DuplicateConferencePaperException ex) {
	        ErrorResponse error = new ErrorResponse(
	                HttpStatus.CONFLICT.value(),
	                ex.getMessage(),
	                LocalDateTime.now()
	        );
	        return new ResponseEntity<>(error, HttpStatus.CONFLICT);
	    }
}
