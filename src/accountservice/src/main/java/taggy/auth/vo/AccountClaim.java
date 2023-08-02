package taggy.auth.vo;

import lombok.Data;
import lombok.AllArgsConstructor;

@Data
@AllArgsConstructor
public class AccountClaim {
    private String id;
    private String name;
    private String email;
}
