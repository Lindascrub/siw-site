package it.uniroma3.siw.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import it.uniroma3.siw.exception.ResourceNotFoundException;
import it.uniroma3.siw.model.Festival;
import it.uniroma3.siw.model.Movie;
import it.uniroma3.siw.modelDTO.FestivalFormDTO;
import it.uniroma3.siw.repository.FestivalRepository;
import it.uniroma3.siw.repository.MovieRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor  
@Transactional(readOnly = true, propagation = Propagation.REQUIRED)
public class FestivalService {

    private final FestivalRepository festivalRepository;
    private final MovieRepository movieRepository;
    
    public List<Festival> findAll() {
        return festivalRepository.findAllByOrderByStartDateDecr();
    }

    public Festival findById(Long id) {
        return festivalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Festival non trovato: id=" + id));
    }

    public Festival findByIdWithMovie(Long id) {
        return ((FestivalRepository) festivalRepository).findByIdWithMovie(id)
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
        Festival f = findById(id);
        festivalRepository.delete(f);
    }


    @Transactional
    public void associateMovie(Long festivalId, Long movieId) {
        Festival festival = findById(festivalId);
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new ResourceNotFoundException("Film non trovato: id=" + movieId));
        if (!movie.getFestivals().contains(festival)) {
            movie.getFestivals().add(festival);
            movieRepository.save(movie);
        }
    }

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