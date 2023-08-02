package taggy.account.adapter;

import taggy.account.entity.*;
import taggy.account.service.*;

import java.util.Map;
import java.util.List;
import java.util.Optional;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.beans.factory.annotation.Autowired;

@RestController
public class AccountController {

	@Autowired
	private AccountRepository accountRepository;
	
	@Autowired
	private AccountService accountService;

	@GetMapping("/admin/foo")
	public String foo() {
		return "foo";
	}

	@GetMapping("/bar")
	public String bar() {
		return "bar";
	}


	@GetMapping("/accounts/{id}")
	public Account getAccount( @PathVariable(value = "id") String id, @RequestParam(value = "name", defaultValue = "World")String name) {
		Account account = accountRepository.findById(id);
		if (account == null) {
			throw new IllegalArgumentException("account not found");
		}
		return account;
	}

	@GetMapping("/accounts")
	public List<Account> listAccounts() {
		return accountRepository.findAll();
	}

	@PostMapping("/accounts")
	public Account createAccount(@RequestBody Map<String, String> body) {
		String name = body.get("name");
		String email = body.get("email");
		String password = body.get("password");

		if (name == null) {
			throw new IllegalArgumentException("name is required");
		}

		return accountService.createUserAccount(name, email, password);
	}


}