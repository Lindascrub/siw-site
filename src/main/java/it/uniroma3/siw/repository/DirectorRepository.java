package it.uniroma3.siw.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import it.uniroma3.siw.model.Director;

@Repository
public interface DirectorRepository extends JpaRepository<Director, Long> {
	
}
