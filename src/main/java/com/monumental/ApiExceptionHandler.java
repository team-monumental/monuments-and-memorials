package com.monumental;

import com.monumental.exceptions.ApiError;
import com.monumental.exceptions.InvalidZipException;
import com.monumental.exceptions.ResourceNotFoundException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.io.IOException;

/**
 * This class is responsible for intercepting all API exceptions and deciding what should happen with the HTTP response
 * It also is able to log these exceptions, which is really helpful for debugging since Spring doesn't always print
 * stacktraces for most exceptions
 */
@ControllerAdvice
public class ApiExceptionHandler {

    // Handler for ResourceNotFoundExceptions
    @ExceptionHandler({ ResourceNotFoundException.class })
    public ResponseEntity<Object> handleResourceNotFoundException(ResourceNotFoundException exception) {
        ApiError apiError = new ApiError(HttpStatus.NOT_FOUND, "Requested resource not found");
        return new ResponseEntity<>(apiError, new HttpHeaders(), apiError.getStatus());
    }

    // Handler for InvalidZipExceptions
    @ExceptionHandler({ InvalidZipException.class })
    public ResponseEntity<Object> handleIllegalArgumentException(InvalidZipException exception) {
        ApiError apiError = new ApiError(HttpStatus.BAD_REQUEST, exception.getMessage());
        return new ResponseEntity<>(apiError, new HttpHeaders(), apiError.getStatus());
    }

    // Handler for IOExceptions
    @ExceptionHandler({ IOException.class })
    public ResponseEntity<Object> handleIOException(IOException exception) {
        ApiError apiError = new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, "Unable to process file");
        return new ResponseEntity<>(apiError, new HttpHeaders(), apiError.getStatus());
    }

    // Handler for all other Exceptions
    @ExceptionHandler({ Exception.class })
    public ResponseEntity<Object> handle(Exception ex) {
        ex.printStackTrace();

        ApiError apiError;
        if (ex instanceof NullPointerException) {
            apiError = new ApiError(HttpStatus.BAD_REQUEST, "Bad request");
            return new ResponseEntity<>(apiError, new HttpHeaders(), apiError.getStatus());
        }
        apiError = new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, "Internal server error");
        return new ResponseEntity<>(apiError, new HttpHeaders(), apiError.getStatus());
    }
}
