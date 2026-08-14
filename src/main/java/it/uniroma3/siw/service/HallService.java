package it.uniroma3.siw.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import it.uniroma3.siw.model.Hall;
import it.uniroma3.siw.repository.HallRepository;


@Service
@Transactional
public class HallService {

	 @Autowired
	    private HallRepository hallRepository;
	    
	    @Transactional(readOnly = true)
	    public List<Hall> findAll() {
	        return hallRepository.findAll();
	    }
	    
	    @Transactional(readOnly = true)
	    public Hall findById(Long id) {
	        return hallRepository.findById(id)
	            .orElseThrow(() -> new RuntimeException("Sala non trovata"));
	    }
	    
	    public Hall save(Hall hall) {
	        return hallRepository.save(hall);
	    }
}
