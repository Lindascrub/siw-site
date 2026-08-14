package it.uniroma3.siw.repository;  

import it.uniroma3.siw.model.Screening;
import it.uniroma3.siw.model.Screening.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface ScreeningRepository extends JpaRepository<Screening, Long> {
    
    // ========== I TUOI METODI ==========
    List<Screening> findByStatus(Status status);
    
    // ========== ALTRI METODI UTILI ==========
    List<Screening> findByFestivalId(Long festivalId);
    List<Screening> findByMovieId(Long movieId);
    List<Screening> findByHallId(Long hallId);
    
    List<Screening> findByFestivalIdOrderByDateAscTimeAsc(Long festivalId);
    
    // QUERY PER SOVRAPPOSIZIONI (importante per il caso d'uso)
    @Query("SELECT s FROM Screening s " +
           "WHERE s.hall.id = :hallId " +
           "AND s.date = :date " +
           "AND s.status != 'CANCELLED' " +
           "AND s.time BETWEEN :startTime AND :endTime")
    List<Screening> findOverlappingScreenings(
        @Param("hallId") Long hallId,
        @Param("date") LocalDate date,
        @Param("startTime") LocalTime startTime,
        @Param("endTime") LocalTime endTime
    );
}