package it.uniroma3.siw.controllerApi;

import it.uniroma3.siw.modelDTO.*;
import it.uniroma3.siw.service.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * Endpoint REST per il pannello admin della SPA React. Corrisponde
 * esattamente a src/services/adminService.ts lato frontend - ogni path e
 * ogni verbo qui deve combaciare con le chiamate li' dentro.
 *
 * Protetto a due livelli, come discusso: @PreAuthorize qui (richiede
 * @EnableMethodSecurity in SecurityConfig, gia' presente) + il pattern
 * "/api/admin/**" -> hasRole("ADMIN") in SecurityConfig stesso (difesa in
 * profondita', non ridondanza inutile: se uno dei due venisse rimosso per
 * errore, l'altro protegge comunque l'endpoint).
 */
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminApiController {

    private final DirectorService directorService;
    private final HallService hallService;
    private final FestivalService festivalService;
    private final MovieService movieService;
    private final ScreeningService screeningService;

    // ===== Registi =====

    @GetMapping("/directors")
    public java.util.List<DirectorDTO> getDirectors() {
        return directorService.findAll().stream().map(DirectorDTO::from).toList();
    }

    @PostMapping("/directors")
    public ResponseEntity<DirectorDTO> createDirector(@Valid @RequestBody DirectorFormDTO form) {
        DirectorDTO created = DirectorDTO.from(directorService.create(form));
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/directors/{id}")
    public DirectorDTO updateDirector(@PathVariable Long id, @Valid @RequestBody DirectorFormDTO form) {
        return DirectorDTO.from(directorService.update(id, form));
    }

    @DeleteMapping("/directors/{id}")
    public ResponseEntity<Void> deleteDirector(@PathVariable Long id) {
        directorService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // ===== Sale =====

    @GetMapping("/halls")
    public java.util.List<HallDTO> getHalls() {
        return hallService.findAll().stream().map(HallDTO::from).toList();
    }

    @PostMapping("/halls")
    public ResponseEntity<HallDTO> createHall(@Valid @RequestBody HallFormDTO form) {
        HallDTO created = HallDTO.from(hallService.create(form));
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/halls/{id}")
    public HallDTO updateHall(@PathVariable Long id, @Valid @RequestBody HallFormDTO form) {
        return HallDTO.from(hallService.update(id, form));
    }

    @DeleteMapping("/halls/{id}")
    public ResponseEntity<Void> deleteHall(@PathVariable Long id) {
        hallService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // ===== Festival =====

    @GetMapping("/festivals")
    public java.util.List<FestivalDTO> getFestivalsAdmin() {
        return festivalService.findAll().stream().map(FestivalDTO::from).toList();
    }

    @PostMapping("/festivals")
    public ResponseEntity<FestivalDTO> createFestival(@Valid @RequestBody FestivalFormDTO form) {
        FestivalDTO created = FestivalDTO.from(festivalService.create(form));
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/festivals/{id}")
    public FestivalDTO updateFestival(@PathVariable Long id, @Valid @RequestBody FestivalFormDTO form) {
        return FestivalDTO.from(festivalService.update(id, form));
    }

    @DeleteMapping("/festivals/{id}")
    public ResponseEntity<Void> deleteFestival(@PathVariable Long id) {
        festivalService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/festivals/{festivalId}/movies/{movieId}")
    public ResponseEntity<Void> addMovieToFestival(@PathVariable Long festivalId, @PathVariable Long movieId) {
        festivalService.matchMovie(festivalId, movieId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/festivals/{festivalId}/movies/{movieId}")
    public ResponseEntity<Void> removeMovieFromFestival(@PathVariable Long festivalId, @PathVariable Long movieId) {
        festivalService.removeMovie(festivalId, movieId);
        return ResponseEntity.noContent().build();
    }

    // ===== Film =====

    @GetMapping("/movies")
    public java.util.List<MovieDTO> getMoviesAdmin() {
        return movieService.findAll().stream().map(MovieDTO::from).toList();
    }

    @PostMapping("/movies")
    public ResponseEntity<MovieDTO> createMovie(@Valid @RequestBody MovieFormDTO form) {
        MovieDTO created = MovieDTO.from(movieService.create(form));
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/movies/{id}")
    public MovieDTO updateMovie(@PathVariable Long id, @Valid @RequestBody MovieFormDTO form) {
        return MovieDTO.from(movieService.update(id, form));
    }

    @DeleteMapping("/movies/{id}")
    public ResponseEntity<Void> deleteMovie(@PathVariable Long id) {
        movieService.delete(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Upload della locandina di un film. Richiesta multipart/form-data (non
     * JSON come gli altri endpoint), con il file nel campo "file" - lato
     * frontend, va inviata come FormData, non come corpo JSON.
     */
    @PostMapping("/movies/{id}/poster")
    public MovieDTO uploadPoster(@PathVariable Long id, @RequestParam("file") org.springframework.web.multipart.MultipartFile file) {
        return MovieDTO.from(movieService.attachPoster(id, file));
    }

    // ===== Proiezioni =====

    @GetMapping("/screenings")
    public java.util.List<ScreeningDTO> getScreeningsAdmin() {
        return screeningService.findAll().stream().map(ScreeningDTO::from).toList();
    }


    @PostMapping("/screenings")
    public ResponseEntity<ScreeningDTO> createScreening(@Valid @RequestBody ScreeningFormDTO form) {
        ScreeningDTO created = ScreeningDTO.from(screeningService.schedule(form));
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/screenings/{id}")
    public ScreeningDTO updateScreening(@PathVariable Long id, @Valid @RequestBody ScreeningFormDTO form) {
        return ScreeningDTO.from(screeningService.update(id, form));
    }

    @DeleteMapping("/screenings/{id}")
    public ResponseEntity<Void> deleteScreening(@PathVariable Long id) {
        screeningService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
