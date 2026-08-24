package com.jobtrack.dto;

public class DashboardResponse {

    private long totalApplications;
    private long applied;
    private long interviews;
    private long offers;
    private long rejected;

    public DashboardResponse() {
    }

    public DashboardResponse(
            long totalApplications,
            long applied,
            long interviews,
            long offers,
            long rejected) {

        this.totalApplications = totalApplications;
        this.applied = applied;
        this.interviews = interviews;
        this.offers = offers;
        this.rejected = rejected;
    }

    public long getTotalApplications() {
        return totalApplications;
    }

    public long getApplied() {
        return applied;
    }

    public long getInterviews() {
        return interviews;
    }

    public long getOffers() {
        return offers;
    }

    public long getRejected() {
        return rejected;
    }
}