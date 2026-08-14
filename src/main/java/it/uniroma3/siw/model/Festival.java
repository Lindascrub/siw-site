package it.uniroma3.siw.model;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
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
public class Festival {
	
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private Long id;
	
	@Column(nullable = false, length = 100)
	private String name;
	
	@Column(nullable = false)
	private Integer year;

	@Column(nullable = false, length = 100)
	private String city;
	
	@Column(nullable = false)
	private LocalDate startDate;
	
	@NotNull
	@Column(nullable = false)
	private LocalDate endDate;
	
	@Column(length = 2000)
	private String description;
	
	
	@ManyToMany(mappedBy = "festival")
	private List<Movie> movies = new ArrayList<>();
	
	@OneToMany(mappedBy = "festival", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<Screening> screenings = new ArrayList<>();


}
