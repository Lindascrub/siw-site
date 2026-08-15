package it.uniroma3.siw.service;

import java.time.LocalTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import it.uniroma3.siw.model.Festival;
import it.uniroma3.siw.model.Hall;
import it.uniroma3.siw.model.Movie;
import it.uniroma3.siw.model.Screening;
import it.uniroma3.siw.model.Screening.Status;
import it.uniroma3.siw.modelDTO.ScreeningFormDTO;
import it.uniroma3.siw.repository.ScreeningRepository;
import jakarta.validation.Valid;

@Service
@Transactional
public class ScreeningService {
    
    @Autowired
    private ScreeningRepository screeningRepository;
    
    @Autowired
    private FestivalService festivalService;
    
    @Autowired
    private MovieService movieService;
    
    @Autowired
    private HallService hallService;
    
    @Transactional(readOnly = true)
    public List<Screening> findAll() {
        return screeningRepository.findAll();
    }
    
    @Transactional(readOnly = true)
    public Screening findById(Long id) {
        return screeningRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Proiezione non trovata con id: " + id));
    }
    
    @Transactional(readOnly = true)
    public List<Screening> findByFestival(Long festivalId) {
        return screeningRepository.findByFestivalId(festivalId);
    }
    
    @Transactional(readOnly = true)
    public List<Screening> findByMovie(Long movieId) {
        return screeningRepository.findByMovieId(movieId);
    }
    
    @Transactional(readOnly = true)
    public List<Screening> findByStatus(ScreeningStatus status) {
        return screeningRepository.findByStatus(status);
    }
    
    @Transactional(isolation = Isolation.SERIALIZABLE)
    public Screening scheduleScreening(Screening screening) {
        
        // ✅ CORRETTO - i service restituiscono l'oggetto direttamente
        Festival festival = festivalService.findById(screening.getFestival().getId());
        Movie movie = movieService.findById(screening.getMovie().getId());
        Hall hall = hallService.findById(screening.getHall().getId());
        
        // 2. Verifica che la proiezione sia nel periodo del festival
        if (screening.getDate().isBefore(festival.getStart()) || 
            screening.getDate().isAfter(festival.getEnd())) {
            throw new IllegalArgumentException("La proiezione deve essere nel periodo del festival");
        }
        
        // 3. Calcola l'orario di fine (durata film + 15 min per cambio sala)
        LocalTime endTime = screening.getTime().plusMinutes(movie.getDuration() + 15);
        
        // 4. Verifica disponibilità della sala (non sovrapposta)
        List<Screening> overlapping = screeningRepository.findOverlappingScreenings(
            hall.getId(),
            screening.getDate(),
            screening.getTime(),
            endTime
        );
        
        if (!overlapping.isEmpty()) {
            throw new RuntimeException("Sala non disponibile per questo orario");
        }
        
        // 5. Imposta le associazioni e salva
        screening.setFestival(festival);
        screening.setMovie(movie);
        screening.setHall(hall);
        screening.setStatus(ScreeningStatus.SCHEDULED);
        
        return screeningRepository.save(screening);
    }
    
    public Screening updateScreening(Screening screening) {
        Screening existing = screeningRepository.findById(screening.getId())
            .orElseThrow(() -> new RuntimeException("Proiezione non trovata con id: " + screening.getId()));
        
        existing.setDate(screening.getDate());
        existing.setTime(screening.getTime());
        existing.setStatus(screening.getStatus());
        
        return screeningRepository.save(existing);
    }
    
    public void deleteScreening(Long id) {
        screeningRepository.deleteById(id);
    }

	public void schedule(@Valid ScreeningFormDTO form) {
		// TODO Auto-generated method stub
		
	}

	public void update(Long id, @Valid ScreeningFormDTO form) {
		// TODO Auto-generated method stub
		
	}

	public void delete(Long id) {
		// TODO Auto-generated method stub
		
	}
}