package taggy.auth.service;

import java.security.Key;
import java.util.Date;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.impl.crypto.MacProvider;

import org.springframework.security.core.Authentication;

import taggy.auth.vo.AccountClaim;
public class JWTService {
    
    static final long EXPIRATIONTIME = 432_000_000;     // 5 days
    static final String TOKEN_PREFIX = "Bearer";
    static final String HEADER_STRING = "Authorization";
    static final Key key = MacProvider.generateKey();


    public static String createToken(String name, String email, String id) {

        String jws = Jwts.builder()
                .claim("name", name)
                .claim("email", email)
                .setSubject(id)
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATIONTIME))
                .signWith(key).compact();

        return jws;
    }


    public static AccountClaim parseToken(String token) {
    
//        String token = request.getHeader(HEADER_STRING);
        if (token != null) {
            try {
                Claims claims = Jwts.parser()
                        .setSigningKey(key)
                        .parseClaimsJws(token.replace(TOKEN_PREFIX, ""))
                        .getBody();
                return new AccountClaim(claims.getSubject(), claims.get("name", String.class), claims.get("email", String.class));
            } catch (JwtException ex) {
                System.out.println(ex);
            }
            
        }
        return null;
    }
}
