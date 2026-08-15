package it.uniroma3.siw.repository;

import it.uniroma3.siw.model.Festival;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface FestivalRepository extends JpaRepository<Festival, Long> {

    List<Festival> findAllByOrderByStartDateDesc();

    @Query("select distinct f from Festival f left join fetch f.movies where f.id = :id")
    Optional<Festival> findByIdWithMovies(@Param("id") Long id);
}
