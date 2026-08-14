package it.uniroma3.siw.modelDTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MovieFormDTO {
	  @NotBlank(message = "Il titolo e' obbligatorio")
	    private String title;

	    @NotNull(message = "L'anno e' obbligatorio")
	    private Integer year;

	    @NotNull(message = "La durata e' obbligatoria")
	    private Integer duration;

	    @NotBlank(message = "Il genere e' obbligatorio")
	    private String genre;

	    private String contryProduction;

	    @NotNull(message = "Il regista e' obbligatorio")
	    private Long directorId;

}
