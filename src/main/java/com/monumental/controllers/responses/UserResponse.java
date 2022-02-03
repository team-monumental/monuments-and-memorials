package com.monumental.controllers.responses;

import com.monumental.models.User;

import java.util.List;

public class UserResponse {

    public User user;
    public List<ContributionResponse> contributions;

    public UserResponse(User user) {
        this.user = user;
        this.contributions = ContributionResponse.createContributionResponses(user.getContributions());
    }
}
