package taggy.auth.service;

import org.junit.jupiter.api.Test;
import org.springframework.aop.scope.ScopedProxyUtils;
import taggy.auth.vo.AccountClaim;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;


public class JWTServiceTest {

    @Test
    public void testCreateToken() {
        String token = JWTService.createToken("kevin", "kkk@gmail.com", "123456");
        assertNotNull(token, "expected string token, however got null");
    }

    @Test
    public void testParseToken() {
        String name = "kevin";
        String email = "kkk@gmail.com";
        String id = "123456";

        String token = JWTService.createToken(name, email, id);
        AccountClaim claim = JWTService.parseToken(token);

        assertEquals(claim.getId(), id);
        assertEquals(claim.getName(), name);
        assertEquals(claim.getEmail(), email);
    }
    
}
