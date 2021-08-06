package cz.web_bank.entities;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity()
@Table(name = "credit_cards")
@NoArgsConstructor
@Setter
public class CreditCard {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Long id;
	
	@Column(name = "card_number", length = 16)
	private String cardNumber;
	
	@Column(name = "valid_from")
	private LocalDate validFrom;
	
	@Column(name = "valid_to")
	private LocalDate validTo;
	
	@Column(name = "type")
	private String type;
	
// Gettery ////////////////////////////////////////////////////////////////////////////////
	
	public Long getId() {
		return id;
	}


	public String getCardNumber() {
		return cardNumber.substring(0, 4) + "-" + cardNumber.substring(4, 8) + "-" + cardNumber.substring(8, 12) + "-" + cardNumber.substring(12, 16);
	}

	public String getValidFrom() {
		return validFrom.format(DateTimeFormatter.ofPattern("MM/yy"));
	}

	public String getValidTo() {
		return validTo.format(DateTimeFormatter.ofPattern("MM/yy"));
	}

	public String getType() {
		return type;
	}
	
}
