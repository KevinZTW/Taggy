package taggy.account.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;

import org.springframework.security.core.userdetails.UsernameNotFoundException;

import taggy.account.adapter.AccountRepository;
import taggy.account.entity.Account;

public class AccountUserDetailsService implements UserDetailsService  {
    @Autowired
    private AccountRepository accountRepository;

    @Override
    public UserDetails loadUserByUsername(String name) throws UsernameNotFoundException {
        Account account = accountRepository.findByEmail(name);

        if (account == null) {
            throw new UsernameNotFoundException(name + " not found");
        }

        UserDetails userDetails = User.builder().username(account.getName()).password(account.getPassword()).roles(account.getRole()).build();
        
        return userDetails;
    }
}
