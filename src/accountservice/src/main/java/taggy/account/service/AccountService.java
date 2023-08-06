package taggy.account.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import taggy.account.adapter.AccountController;
import taggy.account.adapter.AccountRepository;
import taggy.account.entity.Account;
import taggy.rss.entity.RSSFeed;

import java.util.List;


@Service
public class AccountService {
    private static final PasswordEncoder pwEncoder = PasswordEncoderFactories.createDelegatingPasswordEncoder();
    private static final Logger log = LoggerFactory.getLogger(AccountService.class);

    @Autowired
    private AccountRepository accountRepository;

    public Account createUserAccount(String name, String email, String password) {
        Account account = new Account(name, email, pwEncoder.encode(password), Account.ROLE_USER);
        return accountRepository.save(account);
    }

    public Account findByEmail(String email) {
        return accountRepository.findByEmail(email);
    }

    public boolean checkPassword(Account account, String password) {
        return pwEncoder.matches(password, account.getPassword());
    }



    public List<RSSFeed> subscribeRSSFeed(String feedId, Account account) {
        //TODO: verify feed exists

        List<RSSFeed> feeds = account.getRssFeeds();
        if (feeds.contains(new RSSFeed(feedId))) {
            return feeds;
        }else {
            account.getRssFeeds().add(new RSSFeed(feedId));
            accountRepository.save(account);
            return account.getRssFeeds();
        }
    }

    public List<RSSFeed> unsubscribeRSSFeed(String feedId, Account account) {
        account.getRssFeeds().removeIf(feed -> feed.getId().equals(feedId));
        accountRepository.save(account);
        return account.getRssFeeds();
    }
}
