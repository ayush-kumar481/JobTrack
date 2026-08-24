package com.jobtrack.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.jobtrack.model.JobApplication;

public interface ApplicationRepository
        extends MongoRepository<JobApplication, String> {

    List<JobApplication> findByUserEmail(String userEmail);

    long countByUserEmail(String userEmail);

    long countByUserEmailAndStatus(
            String userEmail,
            String status
    );
}