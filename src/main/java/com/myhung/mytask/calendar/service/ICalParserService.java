package com.myhung.mytask.calendar.service;

import com.myhung.mytask.calendar.dto.CalendarEvent;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
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

    private final Map<String, CacheEntry> urlCache = new java.util.concurrent.ConcurrentHashMap<>();

    private static class CacheEntry {
        final List<CalendarEvent> events;
        final long timestamp;
        CacheEntry(List<CalendarEvent> events, long timestamp) {
            this.events = events;
            this.timestamp = timestamp;
        }
    }

    public void clearCache() {
        urlCache.clear();
        log.info("Cleared iCal URL cache.");
    }

    public List<CalendarEvent> fetchAndParseICal(String url, String accountName, String emailAddress) {
        List<CalendarEvent> events = new ArrayList<>();
        if (url == null || url.isBlank()) {
            return events;
        }

        long now = System.currentTimeMillis();
        CacheEntry cached = urlCache.get(url);
        if (cached != null && !cached.events.isEmpty() && (now - cached.timestamp) < 5 * 60 * 1000) {
            log.debug("Returning cached iCal feed for URL: {}", url);
            return cached.events;
        }

        try {
            java.net.URI uri = java.net.URI.create(url.trim());
            org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
            headers.set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");
            headers.set("Accept", "text/calendar, text/plain, */*");

            org.springframework.http.HttpEntity<Void> entity = new org.springframework.http.HttpEntity<>(headers);
            org.springframework.http.ResponseEntity<String> response = restTemplate.exchange(uri, org.springframework.http.HttpMethod.GET, entity, String.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null && !response.getBody().isBlank()) {
                events = parseICSContent(response.getBody(), accountName, emailAddress);
                if (!events.isEmpty()) {
                    urlCache.put(url, new CacheEntry(events, now));
                }
            }
        } catch (Exception e) {
            log.error("Failed to fetch/parse iCal feed from URL {}: {}", url, e.getMessage());
            if (cached != null) return cached.events; // Fallback to expired cache on error
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
        String rrule = null;

        for (String line : lines) {
            line = line.trim();
            if (line.equals("BEGIN:VEVENT")) {
                inEvent = true;
                summary = "Cuộc họp";
                start = null;
                end = null;
                description = "";
                location = "";
                rrule = null;
            } else if (line.equals("END:VEVENT")) {
                if (inEvent && start != null) {
                    if (end == null) {
                        end = start.plusHours(1);
                    }
                    if (rrule != null && !rrule.isBlank()) {
                        expandRecurringEvent(events, summary, start, end, description, location, accountName, emailAddress, rrule);
                    } else {
                        events.add(new CalendarEvent(summary, start, end, description, location, accountName, emailAddress));
                    }
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
                } else if (line.startsWith("RRULE:") || line.startsWith("RRULE;")) {
                    int colon = line.indexOf(':');
                    if (colon != -1) rrule = line.substring(colon + 1).trim();
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

    private void expandRecurringEvent(List<CalendarEvent> events, String summary, LocalDateTime start, LocalDateTime end,
                                       String description, String location, String accountName, String emailAddress, String rrule) {
        // Always add the primary start event
        events.add(new CalendarEvent(summary, start, end, description, location, accountName, emailAddress));

        java.time.Duration eventDuration = java.time.Duration.between(start, end);
        LocalDate untilDate = start.toLocalDate().plusYears(1); // Default cap: 1 year ahead

        if (rrule.contains("UNTIL=")) {
            try {
                int idx = rrule.indexOf("UNTIL=");
                String untilStr = rrule.substring(idx + 6);
                if (untilStr.contains(";")) untilStr = untilStr.substring(0, untilStr.indexOf(";"));
                if (untilStr.length() >= 8) {
                    String dPart = untilStr.substring(0, 8);
                    untilDate = LocalDate.parse(dPart, DateTimeFormatter.ofPattern("yyyyMMdd"));
                }
            } catch (Exception ignored) {}
        }

        if (rrule.contains("FREQ=DAILY")) {
            LocalDateTime currStart = start.plusDays(1);
            while (!currStart.toLocalDate().isAfter(untilDate) && events.size() < 500) {
                events.add(new CalendarEvent(summary, currStart, currStart.plus(eventDuration), description, location, accountName, emailAddress));
                currStart = currStart.plusDays(1);
            }
        } else if (rrule.contains("FREQ=WEEKLY")) {
            LocalDateTime currStart = start.plusWeeks(1);
            while (!currStart.toLocalDate().isAfter(untilDate) && events.size() < 500) {
                events.add(new CalendarEvent(summary, currStart, currStart.plus(eventDuration), description, location, accountName, emailAddress));
                currStart = currStart.plusWeeks(1);
            }
        } else if (rrule.contains("FREQ=MONTHLY")) {
            LocalDateTime currStart = start.plusMonths(1);
            while (!currStart.toLocalDate().isAfter(untilDate) && events.size() < 500) {
                events.add(new CalendarEvent(summary, currStart, currStart.plus(eventDuration), description, location, accountName, emailAddress));
                currStart = currStart.plusMonths(1);
            }
        } else if (rrule.contains("FREQ=YEARLY")) {
            LocalDateTime currStart = start.plusYears(1);
            while (!currStart.toLocalDate().isAfter(untilDate) && events.size() < 500) {
                events.add(new CalendarEvent(summary, currStart, currStart.plus(eventDuration), description, location, accountName, emailAddress));
                currStart = currStart.plusYears(1);
            }
        }
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
