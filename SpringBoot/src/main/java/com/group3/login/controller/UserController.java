package com.group3.login.controller;


import com.group3.login.model.User;
import com.group3.login.service.LoginService;
import com.group3.login.dao.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.view.RedirectView;


@Controller
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/signup")
    public RedirectView signup(@RequestParam(name = "name") String name,
                               @RequestParam(name = "password") String password,
                               @RequestParam(name = "email") String email,
                               @RequestParam(name = "birthday") String birthday,
                               @RequestParam(name = "address") String address,
                               @RequestParam(name = "gender") String gender
    ) {

        User n = new User();
        n.setName(name);
        n.setPassword(password);
        n.setEmail(email);
        n.setBirthday(birthday);
        n.setAddress(address);
        n.setGender(gender);

        userRepository.save(n);
        String url ="/signup_success";
        return new RedirectView(url);

    }


    @PostMapping(path = "/login")
    public String login(@RequestParam(name = "name") String name,
                        @RequestParam(name = "password") String password,
                        Model model
    ) {
        model.addAttribute("name", name);
        model.addAttribute("user_id", password);
        return "map";
    }
}



