package it.uniroma3.siw.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import it.uniroma3.siw.model.Hall;

public interface HallRepository extends JpaRepository<Hall, Long> {
	  List<Hall> findByName(String name);
	  List<Hall> findByCapacityGreaterThanEqual(Integer capacity);
	    
	  @Query("SELECT c FROM CinemaHall c LEFT JOIN FETCH c.screenings WHERE c.id = :id")
	  Optional<Hall> findByIdWithScreenings(@Param("id") Long id);
}
