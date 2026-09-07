package it.uniroma3.siw.controllerApi;

import it.uniroma3.siw.modelDTO.UserAccountDTO;
import it.uniroma3.siw.modelDTO.UserAccountFormDTO;
import it.uniroma3.siw.service.UserAdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Gestione utenti dal pannello admin. Protetto sia da @PreAuthorize sia
 * dalla regola URL "/api/admin/**" -> hasRole("ADMIN") gia' in
 * SecurityConfig (stessa difesa in profondita' di AdminApiController).
 */
@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class UserAdminApiController {

    private final UserAdminService userAdminService;

    @GetMapping
    public List<UserAccountDTO> list() {
        return userAdminService.findAll().stream().map(UserAccountDTO::from).toList();
    }

    @PostMapping
    public ResponseEntity<UserAccountDTO> create(@RequestBody UserAccountFormDTO form) {
        UserAccountDTO created = UserAccountDTO.from(userAdminService.create(form));
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public UserAccountDTO update(@PathVariable Long id, @RequestBody UserAccountFormDTO form) {
        return UserAccountDTO.from(userAdminService.update(id, form));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        userAdminService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
