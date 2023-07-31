package taggy.account.adapter;

import taggy.account.entity.*;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AccountController {

	@GetMapping("/")
	public String index() {
		return "Hello from AccountController!";
	}

	private static final String template = "Hello, %s!";

	@GetMapping("/accounts")
	public Account getAccount( @PathVariable(value = "id") String id, @RequestParam(value = "name", defaultValue = "World")String name) {
		return new Account(String.format(template, name));
	}

}