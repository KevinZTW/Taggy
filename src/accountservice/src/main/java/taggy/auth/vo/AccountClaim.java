package taggy.auth.vo;

import lombok.Data;

@Data
public class AccountClaim {

    public AccountClaim(String id, String name, String email) {
        this.id = id;
        this.name = name;
        this.email = email;
    }

    private String id;
    private String name;
    private String email;
}
