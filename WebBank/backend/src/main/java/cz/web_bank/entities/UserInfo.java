package cz.web_bank.entities;

import java.math.BigDecimal;
import java.util.Currency;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity()
@Table(name = "users")
@NoArgsConstructor
@Getter
@Setter
public class UserInfo {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Long id;
	
	@Column(name = "name", length = 100)
	private String name;
	
	@Column(name = "surname", length = 100)
	private String surname;
	
	@Column(name = "balance")
	private BigDecimal balance;
	
	@Column(name = "currency", length = 3)
	private Currency currency; 
	
	@Column(name = "account_number", length = 15)
	private String accountNumber;
	
}
