package it.uniroma3.siw.modelDTO;

import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ScreeningFormDTO {

    private Long id;
    
    @NotNull(message = "Il festival è obbligatorio")
    private Long festivalId;
    
    @NotNull(message = "Il film è obbligatorio")
    private Long movieId;   
    
    @NotNull(message = "La sala è obbligatoria")
    private Long hallId;
    
    @NotNull(message = "La data è obbligatoria")
    private LocalDate date;
    
    @NotNull(message = "L'ora è obbligatoria")
    private LocalTime time;


}
