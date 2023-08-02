package taggy;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


import taggy.account.entity.*;
import taggy.account.adapter.*;



@Configuration
class LoadDatabase {

  private static final Logger log = LoggerFactory.getLogger(LoadDatabase.class);

  @Bean
  CommandLineRunner initDatabase(AccountRepository repository) {

    return args -> {
      log.info("Preloading " + repository.save(new Account("admin", "admin@gmail.com", "{noop}admin", "ADMIN")));
    };
  }
}