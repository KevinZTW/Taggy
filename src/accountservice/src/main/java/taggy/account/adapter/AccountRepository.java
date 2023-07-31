package taggy.account;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

import taggy.account.entity.*;

public interface AccountRepository extends JpaRepository<Account, Long> {

}