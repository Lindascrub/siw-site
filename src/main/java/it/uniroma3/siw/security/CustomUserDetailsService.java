package it.uniroma3.siw.security;

import it.uniroma3.siw.repository.CredentialsRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
public class CustomUserDetailsService implements org.springframework.security.core.userdetails.UserDetailsService {

    private final CredentialsRepository credentialsRepository;

    public CustomUserDetailsService(CredentialsRepository credentialsRepository) {
        this.credentialsRepository = credentialsRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public org.springframework.security.core.userdetails.UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {
        return credentialsRepository.findByUsername(username)
                .map(UserDetails::new)
                .orElseThrow(() -> new UsernameNotFoundException("Utente non trovato: " + username));
    }
}
