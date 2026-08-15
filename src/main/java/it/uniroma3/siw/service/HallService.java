package it.uniroma3.siw.service;

import it.uniroma3.siw.exception.BusinessRuleException;
import it.uniroma3.siw.exception.ResourceNotFoundException;
import it.uniroma3.siw.model.Hall;
import it.uniroma3.siw.modelDTO.HallFormDTO;
import it.uniroma3.siw.repository.HallRepository;
import it.uniroma3.siw.repository.ScreeningRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class HallService {

    private final HallRepository hallRepository;
    private final ScreeningRepository screeningRepository;

    public List<Hall> findAll() {
        return hallRepository.findAll();
    }

    public Hall findById(Long id) {
        return hallRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sala non trovata: id=" + id));
    }

    @Transactional
    public Hall create(HallFormDTO form) {
        Hall h = new Hall();
        applyForm(h, form);
        return hallRepository.save(h);
    }

    @Transactional
    public Hall update(Long id, HallFormDTO form) {
        Hall h = findById(id);
        applyForm(h, form);
        return hallRepository.save(h);
    }

    @Transactional
    public void delete(Long id) {
        Hall h = findById(id);
        if (screeningRepository.existsByHallId(id)) {
            throw new BusinessRuleException(
                    "Impossibile eliminare la sala '" + h.getName() + "': esistono proiezioni programmate che la usano.");
        }
        hallRepository.delete(h);
    }

    private void applyForm(Hall h, HallFormDTO form) {
        h.setName(form.getName());
        h.setAddress(form.getAddress());
        h.setCapacity(form.getCapacity());
    }
}
