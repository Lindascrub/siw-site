package it.uniroma3.siw.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
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
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	@Column(unique = true, nullable = false, length = 100)
	private String username;

	@Column(nullable = false)
	private String password;

	@Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.USER; 

	@OneToOne(cascade = CascadeType.ALL)
	@JoinColumn(name = "user_id", nullable = false, unique = true)
	private User user;
	
    public Credentials(String username, String password, Role role, User user) {
        this.username = username;
        this.password = password;
        this.role = role;
        this.user = user;
    }


}