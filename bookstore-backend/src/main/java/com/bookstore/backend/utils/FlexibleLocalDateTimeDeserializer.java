package com.bookstore.backend.utils;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

public class FlexibleLocalDateTimeDeserializer extends JsonDeserializer<LocalDateTime> {

    private static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    @Override
    public LocalDateTime deserialize(JsonParser jsonParser, DeserializationContext deserializationContext) 
            throws IOException {
        String date = jsonParser.getText();
        
        if (date == null || date.trim().isEmpty()) {
            return null;
        }
        
        try {
            // Try to parse as full date-time first
            return LocalDateTime.parse(date, DATE_TIME_FORMATTER);
        } catch (DateTimeParseException e1) {
            try {
                // If that fails, try to parse as date only and add time as 00:00:00
                LocalDate localDate = LocalDate.parse(date, DATE_FORMATTER);
                return localDate.atStartOfDay();
            } catch (DateTimeParseException e2) {
                // If both fail, try the ISO format
                try {
                    return LocalDateTime.parse(date);
                } catch (DateTimeParseException e3) {
                    throw new IOException("Unable to parse date: " + date + 
                        ". Expected formats: yyyy-MM-dd or yyyy-MM-ddTHH:mm:ss", e3);
                }
            }
        }
    }
}
