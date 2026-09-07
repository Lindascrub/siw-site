package it.uniroma3.siw.modelDTO;

import it.uniroma3.siw.model.Credentials;

public record UserAccountDTO(Long id, String username, String name, String surname, String email, String role) {

    public static UserAccountDTO from(Credentials c) {
        return new UserAccountDTO(
                c.getId(),
                c.getUsername(),
                c.getUser().getName(),
                c.getUser().getSurname(),
                c.getUser().getEmail(),
                c.getRole().name()
        );
    }
}
