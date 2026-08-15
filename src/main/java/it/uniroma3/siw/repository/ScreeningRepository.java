package it.uniroma3.siw.repository;  

import it.uniroma3.siw.model.Screening;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface ScreeningRepository extends JpaRepository<Screening, Long> {

    List<Screening> findByFestivalId(Long festivalId);

    @Query("select s from Screening s join fetch s.movie join fetch s.hall where s.festival.id = :festivalId order by s.date, s.time")
    List<Screening> findByFestivalIdJoinFetch(@Param("festivalId") Long festivalId);

    @EntityGraph(attributePaths = {"movie", "hall"})
    @Query("select s from Screening s where s.festival.id = :festivalId order by s.date, s.time")
    List<Screening> findByFestivalIdEntityGraph(@Param("festivalId") Long festivalId);

    /** Usata per il controllo di disponibilita' di una sala prima di programmare una proiezione. */
    @Query("select s from Screening s where s.hall.id = :hallId and s.date = :date " +
            "and s.time between :startTime and :endTime and s.status <> it.uniroma3.siw.model.ScreeningStatus.CANCELLED")
    List<Screening> findConflictingScreenings(@Param("hallId") Long hallId,
                                               @Param("date") LocalDate date,
                                               @Param("startTime") LocalTime startTime,
                                               @Param("endTime") LocalTime endTime);

    // usati dai Service per impedire cancellazioni che orfanerebbero proiezioni
    boolean existsByMovieId(Long movieId);
    boolean existsByHallId(Long hallId);
}
