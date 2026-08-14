package it.uniroma3.siw.modelDTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class HallFormDTO {

    private Long id;

    @NotBlank(message = "Il nome è obbligatorio")
    private String name;

    @NotBlank(message = "L'indirizzo è obbligatorio")
    private String address;

    @NotNull(message = "La capienza è obbligatoria")
    @Positive(message = "La capienza deve essere positiva")
    private Integer capacity;
}
