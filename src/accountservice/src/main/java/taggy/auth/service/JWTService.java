package taggy.auth.service;

import java.security.Key;
import java.util.Date;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.impl.crypto.MacProvider;

public class JWTService {
    
    static final long EXPIRATIONTIME = 432_000_000;     // 5天
    static final String TOKEN_PREFIX = "Bearer";        // Token前缀
    static final String HEADER_STRING = "Authorization";// 存放Token的Header Key
    static final Key key = MacProvider.generateKey();	//給定一組密鑰，用來解密以及加密使用    


    public static String createToken(String name, String email, String id) {

        String jws = Jwts.builder()
                .claim("claim1", "foo")
                .claim("claim2", "bar")
                .setSubject(id)
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATIONTIME))
                .signWith(key).compact();

        return jws;
    }


    public static Authentication getClaim(HttpServletRequest request) {
    
        String token = request.getHeader(HEADER_STRING);

        if (token != null) {
            try {
                Claims claims = Jwts.parser()
                        .setSigningKey(key)
                        .parseClaimsJws(token.replace(TOKEN_PREFIX, ""))
                        .getBody();

                String user = claims.getSubject();
            } catch (JwtException ex) {
                System.out.println(ex);
            }
            
        }
        return null;
    }
}
