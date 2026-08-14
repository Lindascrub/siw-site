package it.uniroma3.siw.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import it.uniroma3.siw.model.Director;

public interface DirectorRepository extends JpaRepository<Director, Long> {

	List<Director> findByNameAndSurname(String name, String surname);
	
	List<Director> findByNationality(String nationality);
	
	List<Director> findByBirthAfter(LocalDate date);
	
	
	@Query("SELECT d FROM Director d WHERE SIZE(d.movies) > 0")
	List<Director> findDirectorsWithMovies();
	
    @Query("SELECT d FROM Director d LEFT JOIN FETCH d.movies WHERE d.id = :id")
    Optional<Director> findByIdWithMovies(@Param("id") Long id);
	
}
