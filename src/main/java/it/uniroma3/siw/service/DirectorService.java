package it.uniroma3.siw.service;

import it.uniroma3.siw.exception.BusinessRuleException;
import it.uniroma3.siw.exception.ResourceNotFoundException;
import it.uniroma3.siw.model.Director;
import it.uniroma3.siw.modelDTO.DirectorFormDTO;
import it.uniroma3.siw.repository.DirectorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DirectorService {

    private final DirectorRepository directorRepository;

    public List<Director> findAll() {
        return directorRepository.findAll();
    }

    public Director findById(Long id) {
        return directorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Regista non trovato: id=" + id));
    }

    @Transactional
    public Director create(DirectorFormDTO form) {
        Director d = new Director();
        applyForm(d, form);
        return directorRepository.save(d);
    }

    @Transactional
    public Director update(Long id, DirectorFormDTO form) {
        Director d = findById(id);
        applyForm(d, form);
        return directorRepository.save(d);
    }

    @Transactional
    public void delete(Long id) {
        Director d = findById(id);
        // NIENTE cascade su Director.movies (vedi entita'): un regista con
        // film collegati non puo' essere cancellato, altrimenti si
        // romperebbe il vincolo NOT NULL su Movie.director.
        if (!d.getMovies().isEmpty()) {
            throw new BusinessRuleException(
                    "Impossibile eliminare il regista '" + d.getName() + " " + d.getSurname()
                            + "': esistono film a lui associati.");
        }
        directorRepository.delete(d);
    }

    private void applyForm(Director d, DirectorFormDTO form) {
        d.setName(form.getName());
        d.setSurname(form.getSurname());
        d.setBirthDate(form.getBirthDate());
        d.setNationality(form.getNationality());
    }
}
