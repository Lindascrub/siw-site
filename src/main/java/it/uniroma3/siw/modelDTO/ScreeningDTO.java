package it.uniroma3.siw.modelDTO;

import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ScreeningDTO {

    private Long id;

    @NotNull(message = "Il festival e' obbligatorio")
    private Long festivalId;

    @NotNull(message = "Il film e' obbligatorio")
    private Long movieId;

    @NotNull(message = "La sala e' obbligatoria")
    private Long HallId;

    @NotNull(message = "La data e' obbligatoria")
    private LocalDate date;

    @NotNull(message = "L'ora e' obbligatoria")
    private LocalTime time;

 
}
