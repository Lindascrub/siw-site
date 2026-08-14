package it.uniroma3.siw.model;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
public class Movie {

	@Id 
	@GeneratedValue(strategy=GenerationType.AUTO)
	private Long id;
	
	@NotBlank(message = "Il titolo è obbligatorio")
	@Column(nullable = false, length = 100)
	private String title;
	
	@NotNull(message = "L'anno è obbligatorio")
	@Column(nullable = false, length = 100)
	private Integer year;
	
	@NotBlank(message = "La durata è obbligatorio")
	@Min(1)
	@Max(400)
	private Integer duration;

	@NotNull(message = "Il genere è obbligatorio")
	@Column(nullable = false, length = 100)
	private String genre;

	@Column(length = 100)
	private String contryProduction;
	
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "director_id", nullable = false)
	private Director director;

	@ManyToMany
	@JoinTable(
            name = "festival_movie",
            joinColumns = @JoinColumn(name = "movie_id"),
            inverseJoinColumns = @JoinColumn(name = "festival_id")
    )
	private List<Festival> festivals = new ArrayList<>();

	@OneToMany(mappedBy = "movie")
	private List<Screening> screenings = new ArrayList<>();

	@OneToMany(mappedBy = "movie", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<Review> reviews = new ArrayList<>();




}
