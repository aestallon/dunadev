package com.aestallon.dunadev.rest;

import java.time.OffsetDateTime;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import com.aestallon.dunadev.rest.model.ApiError;
import com.aestallon.dunadev.service.media.ImageStorageException;
import jakarta.persistence.PersistenceException;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;

@RestControllerAdvice
public class RestExceptionHandler {

  private static ResponseEntity<ApiError> errorOf(final HttpStatus httpStatus,
                                                  final String message,
                                                  final WebRequest request) {
    return new ResponseEntity<>(
        new ApiError()
            .status(httpStatus.value())
            .timestamp(OffsetDateTime.now())
            .message(message)
            .description(request.getDescription(false)),
        httpStatus);
  }

  @ExceptionHandler(NullPointerException.class)
  public ResponseEntity<ApiError> nullPointerException(final NullPointerException e,
                                                       final WebRequest request) {
    return errorOf(HttpStatus.INTERNAL_SERVER_ERROR, "Oops, something went awry!", request);
  }

  @ExceptionHandler(IllegalStateException.class)
  public ResponseEntity<ApiError> illegalStateException(final IllegalStateException e,
                                                        final WebRequest request) {
    return errorOf(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), request);
  }

  @ExceptionHandler(IllegalArgumentException.class)
  public ResponseEntity<ApiError> illegalArgumentException(final IllegalArgumentException e,
                                                           final WebRequest request) {
    return errorOf(HttpStatus.BAD_REQUEST, e.getMessage(), request);
  }

  @ExceptionHandler(ImageStorageException.class)
  public ResponseEntity<ApiError> imageStorageException(final ImageStorageException e,
                                                        final WebRequest request) {
    return errorOf(HttpStatus.INTERNAL_SERVER_ERROR, "File operation failed!", request);
  }

  @ExceptionHandler(PersistenceException.class)
  public ResponseEntity<ApiError> persistenceException(final PersistenceException e,
                                                       final WebRequest request) {
    return errorOf(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage(), request);
  }

  @ExceptionHandler(NotFoundException.class)
  public ResponseEntity<ApiError> notFoundException(final NotFoundException e,
                                                     final WebRequest request) {
    return errorOf(HttpStatus.NOT_FOUND, e.getMessage(), request);
  }

  @ExceptionHandler(ConstraintViolationException.class)
  public ResponseEntity<ApiError> constraintViolationException(final ConstraintViolationException e,
                                                               final WebRequest request) {
    final String msg = e.getConstraintViolations().stream()
        .map(ConstraintViolation::getMessage)
        .collect(Collectors.joining("; "));
    return errorOf(HttpStatus.BAD_REQUEST, msg, request);
  }
}
