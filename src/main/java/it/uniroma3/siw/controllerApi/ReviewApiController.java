package it.uniroma3.siw.controllerApi;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import it.uniroma3.siw.modelDTO.ReviewCreateDTO;
import it.uniroma3.siw.modelDTO.ReviewDTO;
import it.uniroma3.siw.security.UserDetails;
import it.uniroma3.siw.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/movies")
@RequiredArgsConstructor
public class ReviewApiController {
	private final ReviewService reviewService;
	
    @PostMapping("/api/movies/{movieId}/reviews")
    public ResponseEntity<ReviewDTO> create(@PathVariable Long filmId,
                                                 @Valid @RequestBody ReviewCreateDTO dto,
                                                 @AuthenticationPrincipal UserDetails principal) {
        ReviewDTO created = ReviewDTO.from(
                reviewService.create(filmId, principal.getId(), dto));
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/api/reviews/{id}")
    public ReviewDTO update(@PathVariable Long id,
                                 @Valid @RequestBody ReviewCreateDTO dto,
                                 @AuthenticationPrincipal UserDetails principal) {
        return ReviewDTO.from(reviewService.update(id, principal.getId(), dto));
    }

    @DeleteMapping("/api/reviews/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, @AuthenticationPrincipal UserDetails principal) {
        reviewService.delete(id, principal.getId());
        return ResponseEntity.noContent().build();
    }
}
