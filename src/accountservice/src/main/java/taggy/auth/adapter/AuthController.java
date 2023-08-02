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
import taggy.auth.service.JWTService;

@RestController
public class AuthController {

    @Autowired
    private AccountService accountService;

    @GetMapping("/token")
    public String login(String email, String password) {
        Account account = accountService.findByEmail(email);
        if (account == null) {
            throw new IllegalArgumentException("account not found");
        }
        if (!account.getPassword().equals(password)) {
            throw new IllegalArgumentException("password not match");
        }
        return JWTService.createToken(account.getName(), account.getEmail(), account.getId());
    }
}
