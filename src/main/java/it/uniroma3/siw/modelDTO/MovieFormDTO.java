package it.uniroma3.siw.modelDTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MovieFormDTO {
	
	private Long id;
	
	@NotBlank(message = "Il titolo è obbligatorio")
	private String title;

	@NotNull(message = "L'anno è obbligatorio")
	private Integer year;

	@NotNull(message = "La durata è obbligatoria")
	private Integer duration;

	@NotBlank(message = "Il genere è obbligatorio")
	private String genre;

	private String contryProduction;

	@NotNull(message = "Il regista è obbligatorio")
	private Long directorId;

}
