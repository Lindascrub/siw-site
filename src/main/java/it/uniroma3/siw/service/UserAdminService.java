package it.uniroma3.siw.service;

import it.uniroma3.siw.exception.BusinessRuleException;
import it.uniroma3.siw.exception.ResourceNotFoundException;
import it.uniroma3.siw.model.Credentials;
import it.uniroma3.siw.model.Role;
import it.uniroma3.siw.model.User;
import it.uniroma3.siw.modelDTO.UserAccountFormDTO;
import it.uniroma3.siw.repository.CredentialsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Gestione utenti dal pannello admin: creazione, modifica (ruolo incluso),
 * eliminazione. E' un servizio a se' stante (non dentro UserService) per
 * non dover indovinare l'esatto contenuto del tuo UserService esistente -
 * usa solo CredentialsRepository, che e' il repository "radice" da cui si
 * arriva sia a Credentials che a User (relazione 1-1, Credentials e' il
 * lato proprietario con cascade ALL - salvare Credentials salva anche
 * User collegato).
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserAdminService {

    private final CredentialsRepository credentialsRepository;
    private final PasswordEncoder passwordEncoder;

    public List<Credentials> findAll() {
        return credentialsRepository.findAll();
    }

    @Transactional
    public Credentials create(UserAccountFormDTO form) {
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
        credentials.setRole(Role.valueOf(form.role()));
        credentials.setUser(user);

        return credentialsRepository.save(credentials);
    }

    @Transactional
    public Credentials update(Long id, UserAccountFormDTO form) {
        Credentials credentials = credentialsRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Utente non trovato"));

        credentials.getUser().setName(form.name());
        credentials.getUser().setSurname(form.surname());
        credentials.getUser().setEmail(form.email());
        credentials.setRole(Role.valueOf(form.role()));

        // password vuota = non cambiarla (l'admin la lascia in bianco se non vuole resettarla)
        if (form.password() != null && !form.password().isBlank()) {
            credentials.setPassword(passwordEncoder.encode(form.password()));
        }

        return credentialsRepository.save(credentials);
    }

    @Transactional
    public void delete(Long id) {
        if (!credentialsRepository.existsById(id)) {
            throw new ResourceNotFoundException("Utente non trovato");
        }
        credentialsRepository.deleteById(id);
    }
}
