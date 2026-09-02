package it.uniroma3.siw.controllerApi;

import it.uniroma3.siw.modelDTO.CurrentUserDTO;
import it.uniroma3.siw.modelDTO.RegisterRequestDTO;
import it.uniroma3.siw.security.UserDetails;
import it.uniroma3.siw.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * Endpoint usato dal frontend React per sapere "chi sono / sono loggato?"
 * dopo il login. Con l'autenticazione a sessione/cookie (non JWT come nelle
 * slide del corso) non c'e' un token da salvare in localStorage: il
 * frontend chiama questo endpoint al mount dell'app (e dopo ogni login) per
 * recuperare lo stato di autenticazione, esattamente come nelle slide si fa
 * il "token recovery" da localStorage.
 *
 * Protetto implicitamente da SecurityConfig (anyRequest().authenticated()):
 * se non autenticato, risponde 401 tramite l'authenticationEntryPoint gia'
 * configurato per /api/**.
 */
@RestController
@RequiredArgsConstructor
public class AuthApiController {

    private final UserService userService;

    @GetMapping("/api/auth/me")
    public CurrentUserDTO me(@AuthenticationPrincipal UserDetails principal) {
        return toDto(principal);
    }

    /**
     * Registrazione via JSON, usata dalla SPA React. L'endpoint Thymeleaf
     * /auth/register resta invariato per il form server-rendered: non e'
     * stato toccato, e' solo affiancato da questo, perche' risponde sempre
     * con una pagina HTML (anche in caso di errore, es. username duplicato)
     * e axios non potrebbe distinguere pulitamente successo da fallimento.
     * Qui invece un errore di business (username duplicato) arriva come
     * risposta 409 con corpo JSON, gestita da RestExceptionHandler.
     */
    @PostMapping("/api/auth/register")
    public ResponseEntity<Void> register(@Valid @RequestBody RegisterRequestDTO dto) {
        userService.register(dto.username(), dto.password(), dto.name(), dto.surname(), dto.email());
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    private CurrentUserDTO toDto(UserDetails principal) {
        return new CurrentUserDTO(
                principal.getId(),
                principal.getUsername(),
                principal.getCredentials().getUser().getName(),
                principal.getCredentials().getUser().getSurname(),
                principal.getCredentials().getRole().name()
        );
    }
}

