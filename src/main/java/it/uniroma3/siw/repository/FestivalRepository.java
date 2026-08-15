package it.uniroma3.siw.repository;


import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import it.uniroma3.siw.model.Festival;

public interface FestivalRepository extends JpaRepository<Festival, Long> {

	List<Festival> findAllByOrderByStartDateDecr();

    @Query("SELECT DISTINCT f FROM Festival f LEFT JOIN FETCH f.movie where f.id = :id")
    Optional<Festival> findByIdWithMovie(@Param("id") Long id);


}
