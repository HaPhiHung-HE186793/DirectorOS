package com.myhung.mytask.calendar.service;

import com.myhung.mytask.calendar.dto.CalendarEvent;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class ICalParserService {

    private static final Logger log = LoggerFactory.getLogger(ICalParserService.class);
    private final RestTemplate restTemplate;

    public ICalParserService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public List<CalendarEvent> fetchAndParseICal(String url, String accountName, String emailAddress) {
        List<CalendarEvent> events = new ArrayList<>();
        if (url == null || url.isBlank()) {
            return events;
        }

        try {
            String icsContent = restTemplate.getForObject(url, String.class);
            if (icsContent != null && !icsContent.isBlank()) {
                events = parseICSContent(icsContent, accountName, emailAddress);
            }
        } catch (Exception e) {
            log.error("Failed to fetch/parse iCal feed from URL {}: {}", url, e.getMessage());
        }

        return events;
    }

    public List<CalendarEvent> parseICSContent(String content, String accountName, String emailAddress) {
        List<CalendarEvent> events = new ArrayList<>();
        String[] lines = content.split("\r?\n");

        boolean inEvent = false;
        String summary = null;
        LocalDateTime start = null;
        LocalDateTime end = null;
        String description = null;
        String location = null;

        for (String line : lines) {
            line = line.trim();
            if (line.equals("BEGIN:VEVENT")) {
                inEvent = true;
                summary = "Cuộc họp";
                start = null;
                end = null;
                description = "";
                location = "";
            } else if (line.equals("END:VEVENT")) {
                if (inEvent && start != null && end != null) {
                    events.add(new CalendarEvent(summary, start, end, description, location, accountName, emailAddress));
                }
                inEvent = false;
            } else if (inEvent) {
                if (line.startsWith("SUMMARY:")) {
                    summary = line.substring(8);
                } else if (line.startsWith("DTSTART")) {
                    start = parseICalDateTime(line);
                } else if (line.startsWith("DTEND")) {
                    end = parseICalDateTime(line);
                } else if (line.startsWith("DESCRIPTION:")) {
                    description = line.substring(12);
                } else if (line.startsWith("LOCATION:")) {
                    location = line.substring(9);
                }
            }
        }
        return events;
    }

    private LocalDateTime parseICalDateTime(String line) {
        try {
            int colonIdx = line.indexOf(':');
            if (colonIdx == -1) return null;
            String val = line.substring(colonIdx + 1).trim();

            if (val.length() >= 15) {
                // Format: 20260813T140000Z or 20260813T140000
                String datePart = val.substring(0, 15);
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd'T'HHmmss");
                return LocalDateTime.parse(datePart, formatter);
            } else if (val.length() == 8) {
                // Format: 20260813
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd");
                return LocalDateTime.parse(val + "T000000", DateTimeFormatter.ofPattern("yyyyMMdd'T'HHmmss"));
            }
        } catch (Exception e) {
            log.warn("Could not parse iCal date line '{}': {}", line, e.getMessage());
        }
        return null;
    }
}
