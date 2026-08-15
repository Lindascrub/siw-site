package it.uniroma3.siw.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import it.uniroma3.siw.exception.BusinessRuleException;
import it.uniroma3.siw.model.Hall;
import it.uniroma3.siw.modelDTO.HallFormDTO;
import it.uniroma3.siw.repository.CredentialsRepository;
import it.uniroma3.siw.repository.HallRepository;
import it.uniroma3.siw.repository.ScreeningRepository;
import it.uniroma3.siw.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;


@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor  
public class HallService {
	    private final HallRepository hallRepository;
	    private final ScreeningRepository screeningRepository;
	    
	    public List<Hall> findAll() {
	        return hallRepository.findAll();
	    }
	    
	    public Hall findById(Long id) {
	        return hallRepository.findById(id)
	            .orElseThrow(() -> new RuntimeException("Sala non trovata: id="+ id));
	    }
	    
	    @Transactional
		public Hall create(HallFormDTO form) {
			Hall h = new Hall();
			applyForm(h, form);
			return hallRepository.save(h);
			
		}

		public Hall update(Long id, HallFormDTO form) {
			Hall h = findById(id);
			applyForm(h, form);
			return hallRepository.save(h);
			
		}

		public void delete(Long id) {
			Hall hall = findById(id);
			if(screeningRepository.existsByHallId(id)) {
				throw new BusinessRuleException( "Impossibile eliminare la sala '" + hall.getName() + "': esistono proiezioni programmate che la usano.");
			}
			hallRepository.delete(hall);
			
		}
	    
	    private void applyForm(Hall h, HallFormDTO form) {
			h.setName(form.getName());
			h.setAddress(form.getAddress());
			h.setCapacity(form.getCapacity());
	    }

	    

}
