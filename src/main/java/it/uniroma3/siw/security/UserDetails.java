package it.uniroma3.siw.security;

import it.uniroma3.siw.model.Credentials;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.List;

public class UserDetails implements org.springframework.security.core.userdetails.UserDetails {

    private final Credentials credentials;

    public UserDetails(Credentials credentials) {
        this.credentials = credentials;
    }

    public Credentials getCredentials() {
        return credentials;
    }

    /** Id del profilo (User), usato per collegare le entita' di dominio (es. Review) all'autore. */
    public Long getId() {
        return credentials.getUser().getId();
    }

    @Override
    public List<GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + credentials.getRole().name()));
    }

    @Override
    public String getPassword() {
        return credentials.getPassword();
    }

    @Override
    public String getUsername() {
        return credentials.getUsername();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
