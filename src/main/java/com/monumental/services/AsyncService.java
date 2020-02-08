package com.monumental.services;

import com.monumental.util.async.AsyncJob;

import java.util.HashMap;
import java.util.Map;

/**
 * This abstract class should be extended by asynchronous services that need to maintain
 * an internal job queue in order to report progress and results of AsyncJobs as they run
 */
public abstract class AsyncService {

    private Map<Integer, AsyncJob> jobs = new HashMap<>();

    private Integer lastId = 0;

    public AsyncJob createJob() {
        this.lastId++;
        AsyncJob job = new AsyncJob(this.lastId);
        this.jobs.put(job.getId(), job);
        return job;
    }

    public AsyncJob getJob(Integer id) {
        return this.jobs.get(id);
    }
}
