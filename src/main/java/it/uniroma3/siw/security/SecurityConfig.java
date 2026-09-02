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
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

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
        // FIX (Spring Security 7 / Spring Boot 4): il costruttore senza
        // argomenti e setUserDetailsService(...) sono stati rimossi, non
        // solo deprecati. Lo UserDetailsService va passato al costruttore.
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider(uds);
        provider.setPasswordEncoder(encoder);
        return provider;
    }

    /**
     * Necessario per il frontend React (Vite gira su http://localhost:5173,
     * origin diversa da quella del backend). allowCredentials(true) e'
     * essenziale: l'autenticazione e' a sessione/cookie (non JWT), quindi il
     * browser deve poter inviare il cookie di sessione nelle richieste
     * cross-origin verso /api/**. Lato frontend, axios deve avere
     * withCredentials: true per ogni chiamata (vedi src/services/api.ts).
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // "/**" e non solo "/api/**": dopo il login Spring Security
        // reindirizza a "/" (la home Thymeleaf) e il browser segue quel
        // redirect in modo trasparente come parte della stessa chiamata XHR
        // cross-origin - anche quella risposta deve avere gli header CORS,
        // altrimenti il browser blocca l'intera catena.
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/css/**", "/js/**", "/images/**", "/webjars/**").permitAll()
                .requestMatchers("/", "/auth/login", "/auth/register").permitAll()
                .requestMatchers("/react/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/auth/register").permitAll()
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
            .csrf(csrf -> csrf.ignoringRequestMatchers("/api/**", "/auth/**", "/logout"))
            .exceptionHandling(ex -> ex
                .defaultAuthenticationEntryPointFor(
                        (request, response, authException) -> response.sendError(401, "Non autenticato"),
                        request -> request.getRequestURI().startsWith("/api/")
                )
            );

        return http.build();
    }
}

