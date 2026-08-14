package it.uniroma3.siw.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
public class User {
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	@Column(nullable = false, length = 100)
	private String name;

	@Column(nullable = false, length = 100)
	private String surname;

	@Column(unique = true, nullable = false)
	private String email;
	
	@OneToOne(mappedBy = "user", fetch = FetchType.LAZY)
	private Credentials credentials;
	
	public User(String name, String surname, String email) {
		this.name = name;
		this.surname = surname;
		this.email = email;
	}
	
    public String getCompleteName() {
        return name + " " + surname;
    }

	
}