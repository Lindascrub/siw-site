package it.uniroma3.siw.modelDTO;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record RegisterRequestDTO(
        @NotBlank(message = "Lo username e' obbligatorio") String username,
        @NotBlank(message = "La password e' obbligatoria") String password,
        @NotBlank(message = "Il nome e' obbligatorio") String name,
        @NotBlank(message = "Il cognome e' obbligatorio") String surname,
        @NotBlank(message = "L'email e' obbligatoria")
        @Email(message = "Email non valida") String email
) {
}
