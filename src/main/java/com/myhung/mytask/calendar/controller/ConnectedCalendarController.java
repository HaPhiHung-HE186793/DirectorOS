package com.myhung.mytask.calendar.controller;

import com.myhung.mytask.calendar.entity.ConnectedCalendar;
import com.myhung.mytask.calendar.service.ConnectedCalendarService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/calendars")
@CrossOrigin(origins = "*")
public class ConnectedCalendarController {

    private final ConnectedCalendarService service;

    public ConnectedCalendarController(ConnectedCalendarService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<ConnectedCalendar>> getAllCalendars() {
        return ResponseEntity.ok(service.getAllCalendars());
    }

    @PostMapping
    public ResponseEntity<ConnectedCalendar> addCalendar(@RequestBody ConnectedCalendar calendar) {
        return ResponseEntity.ok(service.addCalendar(calendar));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ConnectedCalendar> updateCalendar(@PathVariable Long id, @RequestBody ConnectedCalendar calendar) {
        return ResponseEntity.ok(service.updateCalendar(id, calendar));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCalendar(@PathVariable Long id) {
        service.deleteCalendar(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/sync")
    public ResponseEntity<Map<String, Object>> syncAndDetectConflicts() {
        return ResponseEntity.ok(service.syncAndDetectConflicts());
    }
}
