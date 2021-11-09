package com.group3.login.service;


import com.group3.login.dao.UserRepository;
import com.group3.login.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LoginService {
    @Autowired
    private UserRepository userRepository;

    public boolean find(String name, String password) {
        boolean b = true;
        List<User> all = userRepository.findAll();

        for (int i = 0; i <= all.size(); i++) {
            User one = all.get(i);
            if (name.equals(one.getName()) && password.equals(one.getPassword())) {
                b = true;
                break;

            } else {
                b = false;
                break;
            }
        }
        return b;
    }
}
