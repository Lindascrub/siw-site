package it.uniroma3.siw.controllerApi;

import it.uniroma3.siw.model.Review;
import it.uniroma3.siw.modelDTO.MyReviewDTO;
import it.uniroma3.siw.security.UserDetails;
import it.uniroma3.siw.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Endpoint per la pagina Profilo del frontend React: le recensioni scritte
 * dall'utente attualmente autenticato, con il titolo del film gia' incluso.
 *
 * Nessuna modifica a SecurityConfig necessaria: GET /api/reviews/mine non
 * combacia con nessuna regola permitAll esistente (quelle riguardano solo
 * /api/festivals/** e /api/movies/**), quindi ricade automaticamente sotto
 * anyRequest().authenticated() - esattamente il comportamento voluto
 * (richiede login, qualunque ruolo).
 *
 * NOTA: presuppone che ReviewService abbia un metodo findByUser(Long) - se
 * non esiste ancora, va aggiunto (vedi istruzioni-review-service.md).
 * Presuppone anche che ReviewRepository abbia
 * findByUserIdOrderByDateDesc(Long) - stessa cosa.
 */
@RestController
@RequiredArgsConstructor
public class MyReviewsApiController {

    private final ReviewService reviewService;

    @GetMapping("/api/reviews/mine")
    public List<MyReviewDTO> mine(@AuthenticationPrincipal UserDetails principal) {
        return reviewService.findByUser(principal.getId()).stream()
                .map(this::toDto)
                .toList();
    }

    private MyReviewDTO toDto(Review r) {
        return new MyReviewDTO(r.getId(), r.getText(), r.getVote(), r.getDate(), r.getMovie().getId(), r.getMovie().getTitle());
    }
}
