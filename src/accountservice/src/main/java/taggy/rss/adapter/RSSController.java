package taggy.rss.adapter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import taggy.account.entity.Account;
import taggy.rss.entity.RSSFeed;
import taggy.account.service.AccountService;
import taggy.rss.repository.RSSFeedRepository;

import java.util.List;
import java.util.Map;

@RestController
public class RSSController {

    private static final Logger log = LoggerFactory.getLogger(RSSController.class);


    public RSSController(AccountService accountService, RSSFeedRepository rssFeedRepository){
        this.accountService = accountService;
        this.rssFeedRepository = rssFeedRepository;

    }

    private final AccountService accountService;
    private final RSSFeedRepository rssFeedRepository;

    @GetMapping("/rss")
    public String rss() {
        return "rss";
    }

    @PostMapping("/rss/feeds")
    public List<RSSFeed> createAccountRSSFeed(Authentication authentication, @RequestBody Map<String, String> body) {
        Account account = accountService.findByEmail(authentication.getName());
        String feedId = body.get("feedId");

        if (feedId == null) {
            throw new IllegalArgumentException("feedId is required");
        }

        List<RSSFeed> feeds = accountService.subscribeRSSFeed(feedId, account);

        return feeds;
    }

    @DeleteMapping("/rss/feeds/{feedId}")
    public List<RSSFeed> removeAccountRSSFeed(Authentication authentication, @PathVariable String feedId) {
        Account account = accountService.findByEmail(authentication.getName());

        List<RSSFeed> feeds = accountService.unsubscribeRSSFeed(feedId, account);

        return feeds;
    }

    @PostMapping("/admin/rss/feeds")
    public RSSFeed createRSSFeed(Authentication authentication, @RequestBody Map<String, String> body) {

        for (var auth : authentication.getAuthorities()){
            log.info(auth.toString());
        }

        String feedId = body.get("feedId");
        RSSFeed feed = new RSSFeed(feedId);

        rssFeedRepository.save(feed);
        return feed;
    }
}