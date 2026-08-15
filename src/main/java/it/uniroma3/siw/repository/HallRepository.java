package it.uniroma3.siw.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import it.uniroma3.siw.model.Hall;

public interface HallRepository extends JpaRepository<Hall, Long> {
	
}
