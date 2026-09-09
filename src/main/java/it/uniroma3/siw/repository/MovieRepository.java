package it.uniroma3.siw.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import it.uniroma3.siw.model.Movie;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long> {

    @Query("select m from Movie m join m.festivals fest where fest.id = :festivalId")
    List<Movie> findByFestivalIdLazy(@Param("festivalId") Long festivalId);

    @Query("select distinct m from Movie m join fetch m.director where m.id in " +
           "(select m2.id from Movie m2 join m2.festivals fest where fest.id = :festivalId)")
    List<Movie> findByFestivalIdJoinFetch(@Param("festivalId") Long festivalId);

    @EntityGraph(attributePaths = {"director"})
    @Query("select m from Movie m join m.festivals fest where fest.id = :festivalId")
    List<Movie> findByFestivalIdEntityGraph(@Param("festivalId") Long festivalId);

    @Query("SELECT m FROM Movie m JOIN FETCH m.director LEFT JOIN FETCH m.festivals WHERE m.id = :id")
    Optional<Movie> findByIdWithDetails(@Param("id") Long id);

    /**
     * Catalogo pubblico: ricerca facoltativa per titolo, genere o nome/cognome
     * del regista, filtro facoltativo per genere esatto (usato dal Select di
     * filtro), entrambi opzionali e combinabili. Paginato.
     */
    // CAST(:q as string)/CAST(:genre as string) - senza il cast esplicito,
    // Postgres non riesce a dedurre il tipo del parametro quando e' null
    // (compare nella clausola "IS NULL"), e lo assume bytea: lower(bytea)
    // non esiste e la query fallisce con un errore quando search/genre non
    // sono passati (es. GET /api/movies senza query string).
    @Query(value = "SELECT m FROM Movie m WHERE "
            + "(CAST(:q as string) IS NULL OR "
            + "lower(m.title) LIKE lower(concat('%', CAST(:q as string), '%')) OR "
            + "lower(m.genre) LIKE lower(concat('%', CAST(:q as string), '%')) OR "
            + "lower(m.director.name) LIKE lower(concat('%', CAST(:q as string), '%')) OR "
            + "lower(m.director.surname) LIKE lower(concat('%', CAST(:q as string), '%'))) "
            + "AND (CAST(:genre as string) IS NULL OR m.genre = CAST(:genre as string))",
            countQuery = "SELECT COUNT(m) FROM Movie m WHERE "
            + "(CAST(:q as string) IS NULL OR "
            + "lower(m.title) LIKE lower(concat('%', CAST(:q as string), '%')) OR "
            + "lower(m.genre) LIKE lower(concat('%', CAST(:q as string), '%')) OR "
            + "lower(m.director.name) LIKE lower(concat('%', CAST(:q as string), '%')) OR "
            + "lower(m.director.surname) LIKE lower(concat('%', CAST(:q as string), '%'))) "
            + "AND (CAST(:genre as string) IS NULL OR m.genre = CAST(:genre as string))")
    Page<Movie> search(@Param("q") String query, @Param("genre") String genre, Pageable pageable);

    /** Elenco distinto dei generi presenti, per popolare il filtro a tendina. */
    @Query("SELECT DISTINCT m.genre FROM Movie m ORDER BY m.genre")
    List<String> findDistinctGenres();

    /**
     * Film ordinati per media voti decrescente (a parita' di media, per numero
     * di recensioni), per la sezione "in evidenza" della home. Query nativa:
     * "GROUP BY m" in JPQL sull'intera entita' non e' affidabile con ORDER BY
     * su un aggregato, qui invece raggruppiamo per chiave primaria (supportato
     * da Postgres per dipendenza funzionale) e Hibernate mappa le colonne sul
     * risultato List&lt;Movie&gt;.
     */
    @Query(value = "SELECT m.* FROM movie m LEFT JOIN reviews r ON r.movie_id = m.id "
            + "GROUP BY m.id "
            + "ORDER BY COALESCE(AVG(r.vote), 0) DESC, COUNT(r.id) DESC, m.title ASC",
            nativeQuery = true)
    List<Movie> findTopRated(Pageable pageable);
}