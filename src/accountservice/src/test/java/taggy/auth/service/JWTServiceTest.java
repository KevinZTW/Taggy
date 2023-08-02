package taggy.auth.service;

import org.junit.jupiter.api.Test;



public class JWTServiceTest {

    @Test
    public void testCreateToken() {
        String token = JWTService.createToken("kevin", "kkk@gmail.com", "123456");
        
        System.out.println(token);
    }
    
}
