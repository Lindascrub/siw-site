package it.uniroma3.siw.model;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity 
@Table(name = "reviews", 
		uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "movie_id"}))
@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
public class Review {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	@Column(nullable = false, length = 2000)
	private String text; 
	
	@Column(nullable = false)
	private Integer vote;
	
	@Column(nullable = false)
	private LocalDate date = LocalDate.now();

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "movie_id", nullable = false)
	private Movie movie;
	
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "user_id", nullable = false)
	private User user;

}
