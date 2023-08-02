package taggy.account.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import org.springframework.context.annotation.Bean;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import taggy.account.adapter.AccountRepository;
import taggy.account.entity.Account;


public class CustomUserDetailsService implements UserDetailsService  {
    @Autowired
    private AccountRepository accountRepository;
    
    private static final Logger log = LoggerFactory.getLogger(CustomUserDetailsService.class);

    @Override
    public UserDetails loadUserByUsername(String name) throws UsernameNotFoundException {
        Account account = accountRepository.findByEmail(name);

        if (account == null) {
            throw new UsernameNotFoundException(name + " not found");
        }
    
        UserDetails userDetails = User.builder().username(account.getEmail()).password(account.getPassword()).roles(account.getRole()).build();
        log.info("userDetails: " + userDetails);    

        return userDetails;
    }
}
