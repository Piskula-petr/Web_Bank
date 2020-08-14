package cz.web_bank.entity;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity(name = "credit_cards")
public class CreditCard {

	@Id
	@GeneratedValue()
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
	
// Bezparametrový konstruktor ////////////////////////////////////////////////////////////////////
	
	public CreditCard() {
		
	}
	
// Gettery + Settery /////////////////////////////////////////////////////////////////////////////
	
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getCardNumber() {
		return cardNumber.substring(0, 4) + "-" + cardNumber.substring(4, 8) + "-" + cardNumber.substring(8, 12) + "-" + cardNumber.substring(12, 16);
	}

	public void setCardNumber(String cardNumber) {
		this.cardNumber = cardNumber;
	}

	public String getValidFrom() {
		return validFrom.format(DateTimeFormatter.ofPattern("MM/yy"));
	}

	public void setValidFrom(LocalDate validFrom) {
		this.validFrom = validFrom;
	}

	public String getValidTo() {
		return validTo.format(DateTimeFormatter.ofPattern("MM/yy"));
	}

	public void setValidTo(LocalDate validTo) {
		this.validTo = validTo;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}
	
}
