package com.jobtrack.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.jobtrack.dto.ApplicationRequest;
import com.jobtrack.dto.DashboardResponse;
import com.jobtrack.model.JobApplication;
import com.jobtrack.service.ApplicationService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    // CREATE
    @PostMapping
    public ResponseEntity<JobApplication> createApplication(
            @Valid @RequestBody ApplicationRequest request,
            Authentication authentication) {

        String userEmail = authentication.getName();

        JobApplication application =
                applicationService.createApplication(
                        request,
                        userEmail
                );

        return ResponseEntity.ok(application);
    }

    // GET ALL
    @GetMapping
    public ResponseEntity<List<JobApplication>> getApplications(
            Authentication authentication) {

        String userEmail = authentication.getName();

        List<JobApplication> applications =
                applicationService.getApplications(userEmail);

        return ResponseEntity.ok(applications);
    }
    
    @GetMapping("/stats")
    public ResponseEntity<DashboardResponse> getDashboardStats(
            Authentication authentication) {

        String userEmail = authentication.getName();

        DashboardResponse stats =
                applicationService.getDashboardStats(userEmail);

        return ResponseEntity.ok(stats);
    }

    // GET ONE
    @GetMapping("/{id}")
    public ResponseEntity<?> getApplication(
            @PathVariable String id,
            Authentication authentication) {

        String userEmail = authentication.getName();

        JobApplication application =
                applicationService.getApplication(
                        id,
                        userEmail
                );

        if (application == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(application);
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<?> updateApplication(
            @PathVariable String id,
            @Valid @RequestBody ApplicationRequest request,
            Authentication authentication) {

        String userEmail = authentication.getName();

        JobApplication updatedApplication =
                applicationService.updateApplication(
                        id,
                        request,
                        userEmail
                );

        if (updatedApplication == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(updatedApplication);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteApplication(
            @PathVariable String id,
            Authentication authentication) {

        String userEmail = authentication.getName();

        boolean deleted =
                applicationService.deleteApplication(
                        id,
                        userEmail
                );

        if (!deleted) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(
                "Application deleted successfully"
        );
    }
}