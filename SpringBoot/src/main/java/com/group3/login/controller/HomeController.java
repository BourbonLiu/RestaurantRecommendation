package com.group3.login.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/login")
    public String login_page(){
        return "logIn";
    }

    @GetMapping("/signup")
    public String signup_page() {
        return "signUp";
    }

    @GetMapping("/signup_success")
    public String signup_success() {
        return "signUp_success";
    }

}