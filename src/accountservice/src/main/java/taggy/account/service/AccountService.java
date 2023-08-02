package taggy.account.service;

import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import taggy.account.adapter.AccountRepository;
import taggy.account.entity.Account;


@Service
public class AccountService {
    private static final PasswordEncoder pwEncoder = PasswordEncoderFactories.createDelegatingPasswordEncoder();

    @Autowired
    private AccountRepository accountRepository;

    public Account createUserAccount(String name, String email, String password) {
        Account account = new Account(name, email, pwEncoder.encode(password), Account.ROLE_USER);
        return accountRepository.save(account);
    }

    //findByEmail
    public Account findByEmail(String email) {
        return accountRepository.findByEmail(email);
    }
    
}
