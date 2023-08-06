package taggy.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.context.annotation.Bean;
import static org.springframework.security.config.Customizer.withDefaults;

import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;


import org.springframework.security.authentication.AuthenticationEventPublisher;
import org.springframework.security.authentication.DefaultAuthenticationEventPublisher;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;

import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.ApplicationEventPublisher;

import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.configurers.FormLoginConfigurer;



import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


import taggy.account.service.CustomUserDetailsService;

@EnableWebSecurity
@Configuration
public class DefaultSecurityConfig {
    
    private static final Logger log = LoggerFactory.getLogger(DefaultSecurityConfig.class);
    private static final PasswordEncoder pwEncoder = PasswordEncoderFactories.createDelegatingPasswordEncoder();

    @Bean
    CustomUserDetailsService customUserDetailsService() {
        return new CustomUserDetailsService();
    }


    @Bean
    @ConditionalOnMissingBean(AuthenticationEventPublisher.class)
    DefaultAuthenticationEventPublisher defaultAuthenticationEventPublisher(ApplicationEventPublisher delegate) { 
        return new DefaultAuthenticationEventPublisher(delegate);
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests((authz) -> authz
            .requestMatchers("/foo").hasRole("ADMIN")
            .requestMatchers("/token").permitAll()
            .requestMatchers("/accounts").permitAll()
            .anyRequest().authenticated())
            .httpBasic(withDefaults())
            .formLogin(Customizer.withDefaults())
            .csrf((csrf) -> csrf.disable());
        
        return http.build();
    }
}