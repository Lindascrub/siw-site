package it.uniroma3.siw.repository;


import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import it.uniroma3.siw.model.Credentials;

@Repository
public interface CredentialsRepository extends JpaRepository<Credentials, Long> {

	Optional<Credentials> findByUsername(String username);
	
	boolean existsByUsername(String username);
}
