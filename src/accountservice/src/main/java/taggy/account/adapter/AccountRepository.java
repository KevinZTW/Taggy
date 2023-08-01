package taggy.account.adapter;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

import taggy.account.entity.*;

public interface AccountRepository extends JpaRepository<Account, Long> {
    
    List<Account> findAll();

    Account findByEmail(String email);
    Account findById(String id);
}