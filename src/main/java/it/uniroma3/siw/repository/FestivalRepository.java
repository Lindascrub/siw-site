package it.uniroma3.siw.repository;


import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import it.uniroma3.siw.model.Festival;

public interface FestivalRepository extends JpaRepository<Festival, Long> {

	
	Page<Festival> findByYear(Integer year, Pageable pageable);
    Page<Festival> findByCity(String city, Pageable pageable);
    Page<Festival> findByNameContaining(String name, Pageable pageable);
    Page<Festival> findByStartDateBetween(LocalDate startDate, LocalDate endDate, Pageable pageable);
    
    List<Festival> findByStartDateAfter(LocalDate date);
    List<Festival> findByEndDateBefore(LocalDate date);
    
    @Query("SELECT f FROM Festival f WHERE f.startDate <= CURRENT_DATE AND f.endDate >= CURRENT_DATE")
    List<Festival> findActiveFestivals();
        
    @EntityGraph(attributePaths = {"movies"})
    Optional<Festival> findByIdWithMovies(Long id);
    
    @EntityGraph(attributePaths = {"movies", "screenings"})
    Optional<Festival> findByIdWithAllDetails(Long id);
    
    @EntityGraph(attributePaths = {"movies"})
    Page<Festival> findAll(Pageable pageable);
    
    @Query("SELECT COUNT(f) FROM Festival f WHERE f.year = :year")
    long countByYear(@Param("year") Integer year);
    
    @Query("SELECT COUNT(DISTINCT f.city) FROM Festival f")
    long countDistinctCities();
    @Query("SELECT f, SIZE(f.movies) as movieCount FROM Festival f")
    List<Object[]> findFestivalsWithMovieCount();
        
    @Query("SELECT f FROM Festival f WHERE f.startDate <= :endDate AND f.endDate >= :startDate ")
    List<Festival> findOverlappingWithPeriod(
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
        );
    @Query("SELECT f FROM Festival f LEFT JOIN f.movies GROUP BY f.id ORDER BY COUNT(m) DESC")
    List<Festival> findTopFestivalsByMovieCount(Pageable pageable);
    
    @Query("SELECT f FROM Festival f LEFT JOIN f.screenings s GROUP BY f.id ORDER BY COUNT(s) DESC")
    List<Festival> findTopFestivalsByScreening(Pageable pageable);

    @Query("SELECT f FROM Festival f  WHERE f.city = :city AND f.year = :year")
    List<Festival> findByCityAndYear(
    		@Param("city") String city, 
    		@Param("year") Integer year
    		);

    @Query("SELECT f FROM Festival f WHERE f.year = :year AND f.startDate <= CURRENT_DATE ORDER BY f.startDate DESC")
    List<Festival> findRecentFestivalsInYear(
    		@Param("year") Integer year
    		);
	List<Festival> findAllByOrderByDataInizioDesc();
    

}
