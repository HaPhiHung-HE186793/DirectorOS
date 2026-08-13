package com.myhung.mytask.calendar.controller;

import java.util.HashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class OAuthCalendarController {

    @Value("${google.oauth.client-id:1234567890-example.apps.googleusercontent.com}")
    private String googleClientId;

    @Value("${microsoft.oauth.client-id:00000000-0000-0000-0000-000000000000}")
    private String msClientId;

    @GetMapping("/google/url")
    public ResponseEntity<Map<String, String>> getGoogleOAuthUrl() {
        String redirectUri = "https://directoros-rhpq.onrender.com/api/auth/google/callback";
        String scope = "https://www.googleapis.com/auth/calendar.readonly";
        String authUrl = String.format(
                "https://accounts.google.com/o/oauth2/v2/auth?client_id=%s&redirect_uri=%s&response_type=code&scope=%s&access_type=offline&prompt=consent",
                googleClientId, redirectUri, scope
        );

        Map<String, String> res = new HashMap<>();
        res.put("provider", "GOOGLE");
        res.put("authUrl", authUrl);
        return ResponseEntity.ok(res);
    }

    @GetMapping("/microsoft/url")
    public ResponseEntity<Map<String, String>> getMicrosoftOAuthUrl() {
        String redirectUri = "https://directoros-rhpq.onrender.com/api/auth/microsoft/callback";
        String scope = "Calendars.Read offline_access";
        String authUrl = String.format(
                "https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=%s&redirect_uri=%s&response_type=code&scope=%s",
                msClientId, redirectUri, scope
        );

        Map<String, String> res = new HashMap<>();
        res.put("provider", "MICROSOFT");
        res.put("authUrl", authUrl);
        return ResponseEntity.ok(res);
    }
}
