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
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.OrderColumn;
import jakarta.persistence.JoinColumn;
import java.util.ArrayList;

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

	@Column(nullable = false)
	private LocalDate endDate;

	@Column(length = 2000)
	private String description;

	@ManyToMany(mappedBy = "festivals")
	private List<Movie> movies = new ArrayList<>();

	
	@OneToMany(mappedBy = "festival", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<Screening> screenings = new ArrayList<>();

	@ElementCollection
	@CollectionTable(name = "festival_images", joinColumns = @JoinColumn(name = "festival_id"))
	@OrderColumn(name = "position")
	@Column(name = "filename", length = 255)
	private List<String> imageFilenames = new ArrayList<>();
	 
}
