package it.uniroma3.siw.service;

import it.uniroma3.siw.exception.BusinessRuleException;
import it.uniroma3.siw.model.Credentials;
import it.uniroma3.siw.model.Role;
import it.uniroma3.siw.model.User;
import it.uniroma3.siw.repository.CredentialsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final CredentialsRepository credentialsRepository;
    private final PasswordEncoder passwordEncoder;

   
    @Transactional
    public Credentials register(String username, String rawPassword, String name, String surname, String email) {
        if (credentialsRepository.existsByUsername(username)) {
            throw new BusinessRuleException("Username gia' in uso: " + username);
        }
        User profile = new User(name, surname, email);
        Credentials credentials = new Credentials(username, passwordEncoder.encode(rawPassword), Role.USER, profile);
        return credentialsRepository.save(credentials);
    }
}
