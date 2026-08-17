package com.myhung.mytask.calendar.controller;

import com.myhung.mytask.calendar.entity.SpecialDate;
import com.myhung.mytask.calendar.service.SpecialDateService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/special-dates")
public class SpecialDateController {

    private final SpecialDateService specialDateService;

    public SpecialDateController(SpecialDateService specialDateService) {
        this.specialDateService = specialDateService;
    }

    @GetMapping
    public ResponseEntity<List<SpecialDate>> getAll() {
        return ResponseEntity.ok(specialDateService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SpecialDate> getById(@PathVariable Long id) {
        return ResponseEntity.ok(specialDateService.getById(id));
    }

    @GetMapping("/month")
    public ResponseEntity<List<SpecialDate>> getByMonth(
            @RequestParam int year,
            @RequestParam int month) {
        return ResponseEntity.ok(specialDateService.getEventsForMonth(year, month));
    }

    @GetMapping("/type/{eventType}")
    public ResponseEntity<List<SpecialDate>> getByType(@PathVariable String eventType) {
        return ResponseEntity.ok(specialDateService.getByEventType(eventType));
    }

    @PostMapping
    public ResponseEntity<SpecialDate> create(@RequestBody SpecialDate specialDate) {
        SpecialDate created = specialDateService.create(specialDate);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SpecialDate> update(@PathVariable Long id, @RequestBody SpecialDate specialDate) {
        SpecialDate updated = specialDateService.update(id, specialDate);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        specialDateService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
