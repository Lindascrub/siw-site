package it.uniroma3.siw.model;

import java.util.Objects;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.validation.constraints.NotBlank;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
public class Credentials {
	
	 public enum Role {
	        USER,
	        ADMIN
	    }

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	@NotBlank(message = "Username obbligatorio")
	@Column(unique = true, nullable = false)
	private String username;

	@NotBlank(message = "Password obbligatorio")
	@Column(nullable = false)
	private String password;

	@Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.USER; 

	@OneToOne
	@JoinColumn(name = "user_id")
	private User user;
	
    public Credentials(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public Credentials(String username, String password, Role role) {
        this.username = username;
        this.password = password;
        this.role = role;
    }


}