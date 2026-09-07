package it.uniroma3.siw.controllerApi;

import it.uniroma3.siw.exception.BusinessRuleException;
import it.uniroma3.siw.exception.ResourceNotFoundException;
import it.uniroma3.siw.model.Credentials;
import it.uniroma3.siw.model.Role;
import it.uniroma3.siw.model.User;
import it.uniroma3.siw.modelDTO.UserAccountDTO;
import it.uniroma3.siw.modelDTO.UserAccountFormDTO;
import it.uniroma3.siw.repository.CredentialsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Gestione utenti dal pannello admin (lista, creazione, modifica con
 * eventuale cambio ruolo, eliminazione). Protetto sia da @PreAuthorize sia
 * dalla regola URL "/api/admin/**" -> hasRole("ADMIN") gia' presente in
 * SecurityConfig (difesa in profondita': se uno dei due controlli venisse
 * rimosso per errore, l'altro protegge comunque l'endpoint).
 *
 * NOTA sulla conversione del ruolo: Credentials.setRole(...) si aspetta un
 * valore dell'enum Role (Role.ADMIN / Role.USER), non una stringa. Il
 * frontend invece manda/riceve il ruolo come semplice testo ("ADMIN" /
 * "USER") dentro UserAccountFormDTO/UserAccountDTO. La conversione tra le
 * due rappresentazioni va fatta esplicitamente nei due versi:
 *   - String -> Role: parseRole(...), usato in create()/update()
 *   - Role -> String: Role.name(), usato quando si costruisce UserAccountDTO
 * Le due conversioni sono intenzionalmente due funzioni/chiamate diverse,
 * non un'unica funzione "normalize" che provi a fare entrambe le cose.
 */
@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserApiController {

    private final CredentialsRepository credentialsRepository;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @GetMapping
    public List<UserAccountDTO> list() {
        return credentialsRepository.findAll().stream().map(this::toDto).toList();
    }

    @PostMapping
    public ResponseEntity<UserAccountDTO> create(@RequestBody UserAccountFormDTO form) {
        if (credentialsRepository.existsByUsername(form.username())) {
            throw new BusinessRuleException("Username già in uso");
        }
        if (form.password() == null || form.password().isBlank()) {
            throw new BusinessRuleException("La password è obbligatoria per un nuovo utente");
        }

        User user = new User();
        user.setName(form.name());
        user.setSurname(form.surname());
        user.setEmail(form.email());

        Credentials credentials = new Credentials();
        credentials.setUsername(form.username());
        credentials.setPassword(passwordEncoder.encode(form.password()));
        credentials.setRole(parseRole(form.role()));
        credentials.setUser(user);

        Credentials saved = credentialsRepository.save(credentials);
        return ResponseEntity.status(HttpStatus.CREATED).body(toDto(saved));
    }

    @PutMapping("/{id}")
    public UserAccountDTO update(@PathVariable Long id, @RequestBody UserAccountFormDTO form) {
        Credentials credentials = credentialsRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Utente non trovato"));

        credentials.getUser().setName(form.name());
        credentials.getUser().setSurname(form.surname());
        credentials.getUser().setEmail(form.email());
        credentials.setRole(parseRole(form.role()));

        // password vuota/nulla = non cambiarla (l'admin la lascia in bianco se non vuole resettarla)
        if (form.password() != null && !form.password().isBlank()) {
            credentials.setPassword(passwordEncoder.encode(form.password()));
        }

        return toDto(credentialsRepository.save(credentials));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!credentialsRepository.existsById(id)) {
            throw new ResourceNotFoundException("Utente non trovato");
        }
        credentialsRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // ---- conversioni String <-> Role, tenute separate apposta (vedi nota in cima al file) ----

    /** String -> Role. Piu' permissivo di Role.valueOf(...): tollera minuscole/maiuscole miste. */
    private Role parseRole(String role) {
        return "ADMIN".equalsIgnoreCase(role) ? Role.ADMIN : Role.USER;
    }

    /** Credentials (+ il suo User collegato) -> UserAccountDTO. Role -> String qui e' solo .name(). */
    private UserAccountDTO toDto(Credentials c) {
        User u = c.getUser();
        return new UserAccountDTO(c.getId(), c.getUsername(), u.getName(), u.getSurname(), u.getEmail(), c.getRole().name());
    }
}
