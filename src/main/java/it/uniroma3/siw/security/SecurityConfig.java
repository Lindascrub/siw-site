package it.uniroma3.siw.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider(CustomUserDetailsService uds, PasswordEncoder encoder) {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(uds);
        provider.setPasswordEncoder(encoder);
        return provider;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/css/**", "/js/**", "/images/**", "/webjars/**").permitAll()
                .requestMatchers("/", "/auth/login", "/auth/register").permitAll()
                .requestMatchers(HttpMethod.GET, "/festivals/**", "/movies/**").permitAll()

                .requestMatchers(HttpMethod.GET, "/api/festivals/**", "/api/movies/**").permitAll()

                .requestMatchers(HttpMethod.POST, "/api/movies/*/reviews").hasRole("USER")
                .requestMatchers(HttpMethod.PUT, "/api/reviews/**").hasRole("USER")
                .requestMatchers(HttpMethod.DELETE, "/api/reviews/**").hasRole("USER")

                .requestMatchers(HttpMethod.POST, "/movies/*/recensioni").hasRole("USER")

                .requestMatchers("/admin/**").hasRole("ADMIN")

                .anyRequest().authenticated()
            )
            .formLogin(form -> form
                .loginPage("/auth/login")
                .loginProcessingUrl("/auth/login")
                .defaultSuccessUrl("/", false)
                .permitAll()
            )
            .logout(logout -> logout
                .logoutUrl("/logout")
                .logoutSuccessUrl("/")
                .permitAll()
            )
            .csrf(csrf -> csrf.ignoringRequestMatchers("/api/**"))
            .exceptionHandling(ex -> ex
                .defaultAuthenticationEntryPointFor(
                        (request, response, authException) -> response.sendError(401, "Non autenticato"),
                        request -> request.getRequestURI().startsWith("/api/")
                )
            );

        return http.build();
    }
}
