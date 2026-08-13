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
        if (content == null || content.isBlank()) return events;

        // RFC 5545 Line Unfolding: Remove newlines followed by space or tab
        String unfolded = content.replaceAll("\r?\n[ \t]", "");
        String[] lines = unfolded.split("\r?\n");

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
                if (line.startsWith("SUMMARY:") || line.startsWith("SUMMARY;")) {
                    int colon = line.indexOf(':');
                    if (colon != -1) summary = unescapeICalText(line.substring(colon + 1));
                } else if (line.startsWith("DTSTART")) {
                    start = parseICalDateTime(line);
                } else if (line.startsWith("DTEND")) {
                    end = parseICalDateTime(line);
                } else if (line.startsWith("DESCRIPTION:") || line.startsWith("DESCRIPTION;")) {
                    int colon = line.indexOf(':');
                    if (colon != -1) description = unescapeICalText(line.substring(colon + 1));
                } else if (line.startsWith("LOCATION:") || line.startsWith("LOCATION;")) {
                    int colon = line.indexOf(':');
                    if (colon != -1) location = unescapeICalText(line.substring(colon + 1));
                }
            }
        }
        return events;
    }

    private String unescapeICalText(String text) {
        if (text == null) return "";
        return text.replace("\\,", ",")
                   .replace("\\;", ";")
                   .replace("\\n", " ")
                   .replace("\\N", " ")
                   .replace("\\\\", "\\")
                   .trim();
    }

    private LocalDateTime parseICalDateTime(String line) {
        try {
            int colonIdx = line.indexOf(':');
            if (colonIdx == -1) return null;
            String val = line.substring(colonIdx + 1).trim();
            boolean isUtc = val.endsWith("Z");

            if (val.length() >= 15) {
                // Format: 20260813T140000Z or 20260813T140000
                String datePart = val.substring(0, 15);
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd'T'HHmmss");
                LocalDateTime parsed = LocalDateTime.parse(datePart, formatter);

                if (isUtc) {
                    // Convert UTC time to Vietnam / Local Time Zone (+7)
                    return parsed.atZone(java.time.ZoneOffset.UTC)
                            .withZoneSameInstant(java.time.ZoneId.of("Asia/Ho_Chi_Minh"))
                            .toLocalDateTime();
                }
                return parsed;
            } else if (val.length() == 8) {
                // Format: 20260813
                return LocalDateTime.parse(val + "T000000", DateTimeFormatter.ofPattern("yyyyMMdd'T'HHmmss"));
            }
        } catch (Exception e) {
            log.warn("Could not parse iCal date line '{}': {}", line, e.getMessage());
        }
        return null;
    }
}
