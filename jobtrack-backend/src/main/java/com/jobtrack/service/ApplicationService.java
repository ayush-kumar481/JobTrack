package com.jobtrack.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.jobtrack.dto.ApplicationRequest;
import com.jobtrack.model.JobApplication;
import com.jobtrack.repository.ApplicationRepository;

import com.jobtrack.dto.DashboardResponse;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;

    public ApplicationService(ApplicationRepository applicationRepository) {
        this.applicationRepository = applicationRepository;
    }

    public JobApplication createApplication(
            ApplicationRequest request,
            String userEmail) {

        JobApplication application = new JobApplication();

        application.setUserEmail(userEmail);
        application.setCompanyName(request.getCompanyName());
        application.setJobTitle(request.getJobTitle());
        application.setLocation(request.getLocation());
        application.setJobType(request.getJobType());
        application.setStatus(request.getStatus());
        application.setApplicationDate(request.getApplicationDate());
        application.setJobUrl(request.getJobUrl());
        application.setNotes(request.getNotes());

        return applicationRepository.save(application);
    }

    public List<JobApplication> getApplications(String userEmail) {

        return applicationRepository.findByUserEmail(userEmail);
    }

    public JobApplication getApplication(
            String id,
            String userEmail) {

        return applicationRepository.findById(id)
                .filter(application ->
                        application.getUserEmail().equals(userEmail))
                .orElse(null);
    }

    public JobApplication updateApplication(
            String id,
            ApplicationRequest request,
            String userEmail) {

        JobApplication application = getApplication(id, userEmail);

        if (application == null) {
            return null;
        }

        application.setCompanyName(request.getCompanyName());
        application.setJobTitle(request.getJobTitle());
        application.setLocation(request.getLocation());
        application.setJobType(request.getJobType());
        application.setStatus(request.getStatus());
        application.setApplicationDate(request.getApplicationDate());
        application.setJobUrl(request.getJobUrl());
        application.setNotes(request.getNotes());

        return applicationRepository.save(application);
    }

    public boolean deleteApplication(
            String id,
            String userEmail) {

        JobApplication application = getApplication(id, userEmail);

        if (application == null) {
            return false;
        }

        applicationRepository.delete(application);

        return true;
    }
    
    public DashboardResponse getDashboardStats(String userEmail) {

        long totalApplications =
                applicationRepository.countByUserEmail(userEmail);

        long applied =
                applicationRepository.countByUserEmailAndStatus(
                        userEmail,
                        "Applied"
                );

        long interviews =
                applicationRepository.countByUserEmailAndStatus(
                        userEmail,
                        "Interview"
                );

        long offers =
                applicationRepository.countByUserEmailAndStatus(
                        userEmail,
                        "Offer"
                );

        long rejected =
                applicationRepository.countByUserEmailAndStatus(
                        userEmail,
                        "Rejected"
                );

        return new DashboardResponse(
                totalApplications,
                applied,
                interviews,
                offers,
                rejected
        );
    }
}