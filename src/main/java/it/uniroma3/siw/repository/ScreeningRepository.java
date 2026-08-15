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
	  
	  @Query("select s from Screening s "
	  		+ "join fetch s.movie "
	  		+ "join fetch m.hall "
	  		+ "where s.festival.id = :festivalId "
	  		+ "order by s.date, s.time ")
	  List<Screening> findFestivalIdByJoinFetch(@Param("festivalId") Long fetivalId);
	  
	  @EntityGraph(attributePaths = {"movie", "hall"})
	  @Query("select s from Screening s"
			  + "where s.festival.id = : festivalId"
			  + "order by s.date, s.time")
	  List<Screening> findFestivalIdByEntityGraph(@Param("festivalId") Long fetivalId);
	
    @Query("SELECT s FROM Screening s " +
           "WHERE s.hall.id = :hallId " +
           "AND s.date = :date " +
           "AND s.status <> it.uniroma3.siw.model.ScreeningStatus.CANCELLED" +
           "AND s.time BETWEEN :startTime AND :endTime")
    List<Screening> findConflictingScreenings(
        @Param("hallId") Long hallId,
        @Param("date") LocalDate date,
        @Param("startTime") LocalTime startTime,
        @Param("endTime") LocalTime endTime
    );
    
    boolean existsByMovieId(Long movieId);
    boolean existsByHallId(Long hallId);
    
}