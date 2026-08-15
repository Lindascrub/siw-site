package it.uniroma3.siw.service;

import it.uniroma3.siw.exception.ResourceNotFoundException;
import it.uniroma3.siw.model.Festival;
import it.uniroma3.siw.model.Movie;
import it.uniroma3.siw.modelDTO.FestivalFormDTO;
import it.uniroma3.siw.repository.FestivalRepository;
import it.uniroma3.siw.repository.MovieRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FestivalService {

    private final FestivalRepository festivalRepository;
    private final MovieRepository movieRepository;

    public List<Festival> findAll() {
        return festivalRepository.findAllByOrderByStartDateDesc();
    }

    public Festival findById(Long id) {
        return festivalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Festival non trovato: id=" + id));
    }

    public Festival findByIdWithMovie(Long id) {
        return festivalRepository.findByIdWithMovies(id)
                .orElseThrow(() -> new ResourceNotFoundException("Festival non trovato: id=" + id));
    }

    @Transactional
    public Festival create(FestivalFormDTO form) {
        Festival f = new Festival();
        applyForm(f, form);
        return festivalRepository.save(f);
    }

    @Transactional
    public Festival update(Long id, FestivalFormDTO form) {
        Festival f = findById(id);
        applyForm(f, form);
        return festivalRepository.save(f);
    }

    @Transactional
    public void delete(Long id) {
        festivalRepository.delete(findById(id));
    }

    
    @Transactional
    public void matchMovie(Long festivalId, Long movieId) {
        Festival festival = findById(festivalId);
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new ResourceNotFoundException("Film non trovato: id=" + movieId));
        if (!movie.getFestivals().contains(festival)) {
            movie.getFestivals().add(festival);
            movieRepository.save(movie);
        }
    }

    @Transactional
    public void removeMovie(Long festivalId, Long movieId) {
        Festival festival = findById(festivalId);
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new ResourceNotFoundException("Film non trovato: id=" + movieId));
        movie.getFestivals().remove(festival);
        movieRepository.save(movie);
    }

    private void applyForm(Festival f, FestivalFormDTO form) {
        f.setName(form.getName());
        f.setYear(form.getYear());
        f.setCity(form.getCity());
        f.setStartDate(form.getStartDate());
        f.setEndDate(form.getEndDate());
        f.setDescription(form.getDescription());
    }
}
