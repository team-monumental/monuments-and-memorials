package com.monumental.util.async;

import java.util.concurrent.CompletableFuture;

public class AsyncJob {

    private Integer id;

    private CompletableFuture future;

    private Double progress = 0.0;

    public AsyncJob(Integer id) {
        this.setId(id);
    }

    public AsyncJob(Integer id, CompletableFuture future) {
        this.setId(id);
        this.setFuture(future);
    }

    public Integer getId() {
        return this.id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public CompletableFuture getFuture() {
        return this.future;
    }

    public void setFuture(CompletableFuture future) {
        this.future = future;
    }

    public Double getProgress() {
        return this.progress;
    }

    public void setProgress(Double progress) {
        this.progress = progress;
    }
}
