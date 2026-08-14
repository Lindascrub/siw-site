package it.uniroma3.siw.service;


import it.uniroma3.siw.model.Director;
import it.uniroma3.siw.repository.DirectorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class DirectorService {
    
    @Autowired
    private DirectorRepository directorRepository;
    
    
    @Transactional(readOnly = true)
    public List<Director> findAll() {
        return directorRepository.findAll();
    }
    
    @Transactional(readOnly = true)
    public Optional<Director> findById(Long id) {
        return directorRepository.findById(id);
    }
    
    @Transactional(readOnly = true)
    public Director findByIdWithMovies(Long id) {
        return directorRepository.findByIdWithMovies(id)
            .orElseThrow(() -> new RuntimeException("Regista non trovato con id: " + id));
    }
    
    @Transactional(readOnly = true)
    public List<Director> findByNameAndSurname(String name, String surname) {
        return directorRepository.findByNameAndSurname(name, surname);
    }
    
    @Transactional(readOnly = true)
    public List<Director> findByNationality(String nationality) {
        return directorRepository.findByNationality(nationality);
    }
    
    @Transactional(readOnly = true)
    public List<Director> findDirectorsWithMovies() {
        return directorRepository.findDirectorsWithMovies();
    }
    
    
    public Director save(Director director) {

        List<Director> existing = directorRepository.findByNameAndSurname(
            director.getName(), director.getSurname());
        if (!existing.isEmpty()) {
            throw new RuntimeException("Regista già presente nel sistema");
        }
        return directorRepository.save(director);
    }
    
    public Director update(Director director) {
        Director existing = directorRepository.findById(director.getId())
            .orElseThrow(() -> new RuntimeException("Regista non trovato"));
        
        existing.setName(director.getName());
        existing.setSurname(director.getSurname());
        existing.setBirth(director.getBirth());
        existing.setNationality(director.getNationality());
        
        return directorRepository.save(existing);
    }
    
    public void delete(Long id) {
        directorRepository.deleteById(id);
    }
}