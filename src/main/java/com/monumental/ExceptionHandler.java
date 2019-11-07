package com.monumental;

import com.monumental.exceptions.ResourceNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;

/**
 * This class is responsible for intercepting all exceptions and deciding what should happen with the HTTP response
 * It also is able to log these exceptions, which is really helpful for debugging since Spring doesn't always print
 * stacktraces for most exceptions
 */
@ControllerAdvice
public class ExceptionHandler {

    @org.springframework.web.bind.annotation.ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handle(Exception ex) {
        if (ex instanceof ResourceNotFoundException) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex);
        }
        ex.printStackTrace();
        if (ex instanceof NullPointerException) {
            return ResponseEntity.badRequest().body(ex);
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex);
    }
}
