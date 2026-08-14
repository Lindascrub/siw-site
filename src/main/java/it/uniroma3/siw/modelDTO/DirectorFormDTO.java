package it.uniroma3.siw.modelDTO;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DirectorFormDTO {
	
	private Long id;
	
    @NotBlank(message = "Il nome è obbligatorio")
    private String name;

    @NotBlank(message = "Il cognome è obbligatorio")
    private String surname;

    private LocalDate birthDate;
    
    private String nationality;
}
