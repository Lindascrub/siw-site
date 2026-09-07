package it.uniroma3.siw.service;

import it.uniroma3.siw.exception.BusinessRuleException;
import it.uniroma3.siw.exception.ResourceNotFoundException;
import it.uniroma3.siw.model.*;
import it.uniroma3.siw.modelDTO.ScreeningFormDTO;
import it.uniroma3.siw.repository.FestivalRepository;
import it.uniroma3.siw.repository.HallRepository;
import it.uniroma3.siw.repository.MovieRepository;
import it.uniroma3.siw.repository.ScreeningRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.util.List;


@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ScreeningService {

    private static final int BUFFER_MINUTES = 15;

    private final ScreeningRepository screeningRepository;
    private final FestivalRepository festivalRepository;
    private final MovieRepository movieRepository;
    private final HallRepository hallRepository;

    public List<Screening> findByFestival(Long festivalId) {
        return screeningRepository.findByFestivalIdJoinFetch(festivalId);
    }

    public Screening findById(Long id) {
        return screeningRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Proiezione non trovata: id=" + id));
    }

    @Transactional(isolation = Isolation.SERIALIZABLE)
    public Screening schedule(ScreeningFormDTO form) {
        Festival festival = festivalRepository.findById(form.getFestivalId())
                .orElseThrow(() -> new ResourceNotFoundException("Festival non trovato: id=" + form.getFestivalId()));
        Movie movie = movieRepository.findById(form.getMovieId())
                .orElseThrow(() -> new ResourceNotFoundException("Film non trovato: id=" + form.getMovieId()));
        Hall hall = hallRepository.findById(form.getHallId())
                .orElseThrow(() -> new ResourceNotFoundException("Sala non trovata: id=" + form.getHallId()));

        checkAvailability(hall.getId(), form.getDate(), form.getTime(), movie.getDuration());

        Screening s = new Screening();
        s.setFestival(festival);
        s.setMovie(movie);
        s.setHall(hall);
        s.setDate(form.getDate());
        s.setTime(form.getTime());
        s.setStatus(ScreeningStatus.SCHEDULED);

        return screeningRepository.save(s);
    }

    @Transactional(isolation = Isolation.SERIALIZABLE)
    public Screening update(Long id, ScreeningFormDTO form) {
        Screening s = findById(id);

        Festival festival = festivalRepository.findById(form.getFestivalId())
                .orElseThrow(() -> new ResourceNotFoundException("Festival non trovato: id=" + form.getFestivalId()));
        Movie movie = movieRepository.findById(form.getMovieId())
                .orElseThrow(() -> new ResourceNotFoundException("Film non trovato: id=" + form.getMovieId()));
        Hall hall = hallRepository.findById(form.getHallId())
                .orElseThrow(() -> new ResourceNotFoundException("Sala non trovata: id=" + form.getHallId()));

        boolean slotChanged = !hall.getId().equals(s.getHall().getId())
                || !form.getDate().equals(s.getDate())
                || !form.getTime().equals(s.getTime());
        if (slotChanged) {
            checkAvailability(hall.getId(), form.getDate(), form.getTime(), movie.getDuration());
        }

        s.setFestival(festival);
        s.setMovie(movie);
        s.setHall(hall);
        s.setDate(form.getDate());
        s.setTime(form.getTime());
        return screeningRepository.save(s);
    }

    @Transactional
    public void delete(Long id) {
        screeningRepository.delete(findById(id));
    }

    public List<Screening> findByFestivalLazy(Long festivalId) {
        return screeningRepository.findByFestivalId(festivalId);
    }

    public List<Screening> findByFestivalJoinFetch(Long festivalId) {
        return screeningRepository.findByFestivalIdJoinFetch(festivalId);
    }

    public List<Screening> findByFestivalEntityGraph(Long festivalId) {
        return screeningRepository.findByFestivalIdEntityGraph(festivalId);
    }

    private void checkAvailability(Long hallId, java.time.LocalDate date, LocalTime time, int movieDurationMinutes) {
        LocalTime startTime = time.minusMinutes(movieDurationMinutes + BUFFER_MINUTES);
        LocalTime endTime = time.plusMinutes(movieDurationMinutes + BUFFER_MINUTES);
        if (startTime.isAfter(time) || endTime.isBefore(time)) {
            startTime = LocalTime.MIN;
            endTime = LocalTime.MAX;
        }
        List<Screening> conflicts = screeningRepository.findConflictingScreenings(hallId, date, startTime, endTime);
        if (!conflicts.isEmpty()) {
            throw new BusinessRuleException(
                    "La sala selezionata non e' disponibile nell'intervallo richiesto: esiste gia' una proiezione in conflitto.");
        }
    }
    public List<Screening> findAll() {
        return screeningRepository.findAll();
    }
}
