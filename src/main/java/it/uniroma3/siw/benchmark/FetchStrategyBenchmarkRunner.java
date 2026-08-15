package it.uniroma3.siw.benchmark;

import java.util.List;
import java.util.Optional;

import org.hibernate.SessionFactory;
import org.hibernate.stat.Statistics;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import it.uniroma3.siw.model.Festival;
import it.uniroma3.siw.model.Movie;
import it.uniroma3.siw.repository.FestivalRepository;
import it.uniroma3.siw.service.MovieService;
import jakarta.persistence.EntityManagerFactory;

@Component
@Profile("benchmark")
public class FetchStrategyBenchmarkRunner implements CommandLineRunner {

    private final FestivalRepository festivalRepository;
    private final MovieService movieService;
    private final EntityManagerFactory entityManagerFactory;

    public FetchStrategyBenchmarkRunner(FestivalRepository festivalRepository,
                                        MovieService movieService,
                                        EntityManagerFactory entityManagerFactory) {
        this.festivalRepository = festivalRepository;
        this.movieService = movieService;
        this.entityManagerFactory = entityManagerFactory;
    }

    @Override
    public void run(String... args) {
        Optional<Festival> festivalOpt = festivalRepository.findAll().stream().findFirst();
        if (festivalOpt.isEmpty()) {
            System.out.println("Nessun festival trovato: impossibile eseguire il benchmark. " +
                    "Avviare prima l'applicazione senza il profilo 'benchmark' per popolare i dati di esempio.");
            return;
        }

        Long festivalId = festivalOpt.get().getId();

        System.out.println();
        System.out.println("=== Test accesso ai film del festival (id=" + festivalId + ") ===");

        eseguiStrategia("LAZY (nessun fetch esplicito -> N+1)", () -> movieService.findByFestivalLazy(festivalId));
        eseguiStrategia("JOIN FETCH", () -> movieService.findByFestivalJoinFetch(festivalId));
        eseguiStrategia("ENTITY GRAPH", () -> movieService.findByFestivalEntityGraph(festivalId));

        System.out.println();
        System.out.println("Nota: la strategia LAZY genera 1 query per il festival/film piu' 1 query " +
                "aggiuntiva per ciascun regista distinto acceduto (problema N+1), perche' l'associazione " +
                "Movie.director e' marcata EAGER ma le query JPQL non aggiungono automaticamente il join SQL: " +
                "Hibernate la inizializza con una SELECT separata per ogni film. Le strategie JOIN FETCH ed " +
                "EntityGraph risolvono il problema con un'unica query.");
        System.out.println();
    }

    private void eseguiStrategia(String nome, java.util.function.Supplier<List<Movie>> operazione) {
        Statistics statistics = entityManagerFactory.unwrap(SessionFactory.class).getStatistics();
        boolean wasEnabled = statistics.isStatisticsEnabled();
        statistics.setStatisticsEnabled(true);
        statistics.clear();

        long start = System.nanoTime();
        List<Movie> risultato = operazione.get();

        risultato.forEach(f -> f.getDirector().getName());
        long elapsedMs = (System.nanoTime() - start) / 1_000_000;

        long queryCount = statistics.getPrepareStatementCount();

        System.out.println("Strategia: " + nome);
        System.out.println("  Film caricati: " + risultato.size());
        System.out.println("  Query SQL:     " + queryCount);
        System.out.println("  Tempo:         " + elapsedMs + " ms");

        statistics.setStatisticsEnabled(wasEnabled);
    }
}
