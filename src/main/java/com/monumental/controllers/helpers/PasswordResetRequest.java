package com.monumental.controllers.helpers;

public class PasswordResetRequest {

    private String token;

    private String password;

    private String newPassword;

    private String matchingNewPassword;

    public String getToken() {
        return this.token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getPassword() {
        return this.password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getNewPassword() {
        return this.newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }

    public String getMatchingNewPassword() {
        return this.matchingNewPassword;
    }

    public void setMatchingNewPassword(String matchingNewPassword) {
        this.matchingNewPassword = matchingNewPassword;
    }
}
