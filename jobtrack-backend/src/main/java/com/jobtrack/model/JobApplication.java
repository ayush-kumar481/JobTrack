package com.jobtrack.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Document(collection = "applications")
public class JobApplication {

    @Id
    private String id;

    private String userEmail;

    private String companyName;

    private String jobTitle;

    private String location;

    private String jobType;

    private String status;

    private LocalDate applicationDate;

    private String jobUrl;

    private String notes;

    public JobApplication() {
    }

    public JobApplication(
            String userEmail,
            String companyName,
            String jobTitle,
            String location,
            String jobType,
            String status,
            LocalDate applicationDate,
            String jobUrl,
            String notes) {

        this.userEmail = userEmail;
        this.companyName = companyName;
        this.jobTitle = jobTitle;
        this.location = location;
        this.jobType = jobType;
        this.status = status;
        this.applicationDate = applicationDate;
        this.jobUrl = jobUrl;
        this.notes = notes;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getJobType() {
        return jobType;
    }

    public void setJobType(String jobType) {
        this.jobType = jobType;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDate getApplicationDate() {
        return applicationDate;
    }

    public void setApplicationDate(LocalDate applicationDate) {
        this.applicationDate = applicationDate;
    }

    public String getJobUrl() {
        return jobUrl;
    }

    public void setJobUrl(String jobUrl) {
        this.jobUrl = jobUrl;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}