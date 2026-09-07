package it.uniroma3.siw.modelDTO;

/**
 * Password vuota/nulla in fase di UPDATE significa "non cambiare la
 * password" (l'utente admin la lascia in bianco se non vuole resettarla).
 * In fase di CREATE invece e' obbligatoria - il controllo e' nel service,
 * non qui, perche' la regola cambia a seconda dell'operazione.
 */
public record UserAccountFormDTO(String username, String password, String name, String surname,
                                  String email, String role) {
}
