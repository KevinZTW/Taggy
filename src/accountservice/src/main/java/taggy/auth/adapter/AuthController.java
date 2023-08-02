package taggy.auth.adapter;

import taggy.account.entity.*;
import taggy.account.service.*;

import java.util.Map;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.core.Authentication;

import taggy.auth.service.JWTService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


@RestController
public class AuthController {
    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AccountService accountService;

    @GetMapping("/token")
    public String login(Authentication authentication) {
        Account account = accountService.findByEmail(authentication.getName());
        
        if (account == null) {
            throw new IllegalArgumentException("account not found");
        }
        
        return JWTService.createToken(account.getName(), account.getEmail(), account.getId());
    }
}
