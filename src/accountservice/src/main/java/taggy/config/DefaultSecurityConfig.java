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

@EnableWebSecurity
@Configuration
public class DefaultSecurityConfig {
    
    private static final Logger log = LoggerFactory.getLogger(DefaultSecurityConfig.class);
    private static final PasswordEncoder pwEncoder = PasswordEncoderFactories.createDelegatingPasswordEncoder();
    @Bean
    @ConditionalOnMissingBean(UserDetailsService.class)
    InMemoryUserDetailsManager inMemoryUserDetailsManager() { 

        UserDetails u = User.withUsername("user").password(pwEncoder.encode("user")).roles("USER").build();
        UserDetails admin = User.withUsername("admin").password(pwEncoder.encode("admin")).roles("ADMIN").build();

        log.info("admin pass: >> " + admin.getPassword());
        return new InMemoryUserDetailsManager(u, admin);
    }

    @Bean
    @ConditionalOnMissingBean(AuthenticationEventPublisher.class)
    DefaultAuthenticationEventPublisher defaultAuthenticationEventPublisher(ApplicationEventPublisher delegate) { 
        return new DefaultAuthenticationEventPublisher(delegate);
    }

    // private PasswordEncoder passwordEncoder = PasswordEncoderFactories.createDelegatingPasswordEncoder();

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests((authz) -> authz //authorize 
            .requestMatchers("/foo").hasRole("ADMIN")
            .requestMatchers("/accounts").permitAll()
            .anyRequest().authenticated())
            .httpBasic(withDefaults()) // authenticate
            .formLogin(Customizer.withDefaults()) ;
        return http.build();
    }


    // @Bean
    // public WebSecurityCustomizer webSecurityCustomizer() {
    //     return (web) -> web.ignoring().requestMatchers("/accounts/**");
    // }

}