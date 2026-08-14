package it.uniroma3.siw.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.boot.data.autoconfigure.web.DataWebProperties.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import it.uniroma3.siw.model.Movie;

public interface MovieRepository extends CrudRepository<Movie, Long> {

	List<Movie> findByTitle(String title);
    List<Movie> findByTitleContaining(String title);
    List<Movie> findByYear(Integer year);
    List<Movie> findByDirectorId(Long directorId);
    List<Movie> findByGenre(String genre);
    
    boolean existsByTitleAndYear(String title, Integer year);
    
    Page<Movie> findByTitleContaining(String title, Pageable pageable);
    Page<Movie> findByYearBetween(Integer startYear, Integer endYear, Pageable pageable);
    
    @Query("SELECT m FROM Movie m JOIN FETCH m.director")
    List<Movie> findAllWithDirector();
    
    @Query("SELECT m FROM Movie m JOIN FETCH m.director WHERE m.id = :id")
    Optional<Movie> findByIdWithDirector(@Param("id") Long id);
    
    @Query("SELECT m FROM Movie m JOIN FETCH m.director LEFT JOIN FETCH m.festivals WHERE m.id = :id")
    Optional<Movie> findByIdWithDetails(@Param("id") Long id);
    
    @EntityGraph(attributePaths = {"director", "festivals"})
    List<Movie> findAll();
    
    @Query("SELECT m FROM Movie m WHERE " +
           "(:title IS NULL OR LOWER(m.title) LIKE LOWER(CONCAT('%', :title, '%'))) AND " +
           "(:genre IS NULL OR LOWER(m.genre) = LOWER(:genre)) AND " +
           "(:minYear IS NULL OR m.year >= :minYear) AND " +
           "(:maxYear IS NULL OR m.year <= :maxYear)")
    List<Movie> searchMovies(@Param("title") String title,
                            @Param("genre") String genre,
                            @Param("minYear") Integer minYear,
                            @Param("maxYear") Integer maxYear);
    
    @Query("SELECT m FROM Movie m JOIN m.festivals f WHERE f.id = :festivalId")
    List<Movie> findByFestivalId(@Param("festivalId") Long festivalId);
    
    @Query("SELECT m FROM Movie m JOIN FETCH m.director JOIN m.festivals f WHERE f.id = :festivalId")
    List<Movie> findByFestivalIdWithDirector(@Param("festivalId") Long festivalId);
}
