package it.uniroma3.siw.modelDTO;

import it.uniroma3.siw.model.Hall;

public record HallDTO(
		Long id,
		String name,
		String address,
		Integer capacity
		) {
	public static HallDTO from(Hall h) {
		return new HallDTO(
				h.getId(),
				h.getName(),
				h.getAddress(),
				h.getCapacity());
	}

}
