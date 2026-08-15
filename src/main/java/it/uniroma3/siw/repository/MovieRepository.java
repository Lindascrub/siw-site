package it.uniroma3.siw.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import it.uniroma3.siw.model.Movie;

public interface MovieRepository extends JpaRepository<Movie, Long> {
    @Query("select m from Movie m join m.festival fest where fest.id = :festivalId")
    List<Movie> findByFestivalIdLazy(@Param("festivalId") Long festivalId);
    @Query("select distinct m from Movie m join fetch m.director where m.id in " +
            "(select m2.id from Movie m2 join m2.festival fest where fest.id = :festivalId)")
    List<Movie> findByFestivalIdJoinFetch(@Param("festivalId") Long festivalId);
    @EntityGraph(attributePaths = {"director"})
    @Query("select m from Movie m join m.festival fest where fest.id = :festivalId")
    List<Movie> findByFestivalIdEntityGraph(@Param("festivalId") Long festivalId);
	 @Query("SELECT m FROM Movie m JOIN FETCH m.director LEFT JOIN FETCH m.festivals WHERE m.id = :id")
	 Optional<Movie> findByIdWithDetails(@Param("id") Long id);
	
    @Query("SELECT m FROM Movie m WHERE lower(m.title) like lower(concat('%', :title, '%'))")
	List<Movie> searchByTitle(@Param("title") String title);
	

}
