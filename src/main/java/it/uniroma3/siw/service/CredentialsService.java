package it.uniroma3.siw.service;

import it.uniroma3.siw.model.Credentials;
import it.uniroma3.siw.model.User;
import it.uniroma3.siw.repository.CredentialsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
public class CredentialsService {
    
    public static final String DEFAULT_ROLE = "USER";
    public static final String ADMIN_ROLE = "ADMIN";
    
    @Autowired
    private CredentialsRepository credentialsRepository;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Transactional(readOnly = true)
    public Optional<Credentials> findByUsername(String username) {
        return credentialsRepository.findByUsername(username);
    }
    
    @Transactional(readOnly = true)
    public boolean existsByUsername(String username) {
        return credentialsRepository.existsByUsername(username);  // <-- CORRETTO
    }
    
    public void registerUser(User user, Credentials credentials) {
        if (credentialsRepository.existsByUsername(credentials.getUsername())) {  // <-- CORRETTO
            throw new RuntimeException("Username già in uso");
        }
        
        if (userService.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email già in uso");
        }
        
        userService.save(user);
        
        credentials.setUser(user);
        credentials.setRole(DEFAULT_ROLE);
        credentials.setPassword(passwordEncoder.encode(credentials.getPassword()));
        
        credentialsRepository.save(credentials);
    }
    
    public void createAdminUser(User user, Credentials credentials) {
        if (credentialsRepository.existsByUsername(credentials.getUsername())) {  // <-- CORRETTO
            throw new RuntimeException("Username già in uso");
        }
        
        userService.save(user);
        
        credentials.setUser(user);
        credentials.setRole(ADMIN_ROLE);
        credentials.setPassword(passwordEncoder.encode(credentials.getPassword()));
        
        credentialsRepository.save(credentials);
    }
}