package it.uniroma3.siw.model;

import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
public class Screening {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	
	@Column(nullable = false)
	private LocalDate date;

	@Column(nullable = false)
	private LocalTime time;
	
	@Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
	private ScreeningStatus status = ScreeningStatus.SCHEDULED; 

	@ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "festival_id",nullable = false)
	private Festival festival;
	
	@ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "movie_id", nullable = false)
	private Movie movie;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "hall_id", nullable = false)
	private Hall hall;
	


}


