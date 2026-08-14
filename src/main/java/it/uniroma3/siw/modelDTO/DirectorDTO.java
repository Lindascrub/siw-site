package it.uniroma3.siw.modelDTO;

import java.time.LocalDate;

import it.uniroma3.siw.model.Director;

public record DirectorDTO(
		Long id,
		String name,
		String surname,
		LocalDate birthDate, 
		String nationality
		) {

	public static DirectorDTO from(Director d) {
		return new DirectorDTO(
				d.getId(),
				d.getName(),
				d.getSurname(),
				d.getBirthDate(),
				d.getNationality());
	}

}
