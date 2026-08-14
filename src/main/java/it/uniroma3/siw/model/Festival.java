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
	private Long Id;
	
	@NotBlank(message = "Il nome è obbligatorio")
	@Column(nullable = false, length = 100)
	private String name;
	
	@NotNull(message = "L'anno è obbligatorio")
	@Column(nullable = false, length = 5)
	private Integer year;
	
	@NotBlank(message = "La città è obbligatorio")
	@Column(nullable = false, length = 100)
	private String city;
	
	@NotNull
	@Column(nullable = false)
	private LocalDate startDate;
	
	@NotNull
	@Column(nullable = false)
	private LocalDate endDate;
	
	@Column(length = 2000)
	private String description;
	
	
	@OneToMany(mappedBy = "festival")
	private List<Movie> movies = new ArrayList<>();
	
	@OneToMany(mappedBy = "festival", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<Screening> screenings = new ArrayList<>();
	
    
    public Festival(String name, Integer year, String city, LocalDate startDate, LocalDate endDate) {
        this.name = name;
        this.year = year;
        this.city = city;
        this.startDate = startDate;
        this.endDate = endDate;
    }


}
