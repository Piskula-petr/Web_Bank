package cz.web_bank.entities;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Currency;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateSerializer;

@Entity()
@Table(name = "payments")
public class Payment {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Long id;
	
	@Column(name = "user_id")
	private Long userID;
	
	@NotBlank(message = "Název platby nesmí být prázdné")
	@Column(name = "name")
	private String name;
	
	@Column(name = "mark", length = 1)
	private String mark;
	
	@Min(value = 1, message = "Částka platby nesmí být prázdná")
	@Column(name = "amount")
	private BigDecimal amount;
	
	@Column(name = "currency", length = 3)
	private Currency currency;
	
	@Max(value = 9999999999L, message = "Variabilní symbol může mýt maximálně 10 znaků")
	@Column(name = "variable_symbol", length = 10)
	private Long variableSymbol;
	
	@Max(value = 9999999999L, message = "Konstantní symbol může mýt maximálně 10 znaky")
	@Column(name = "constant_symbol", length = 10)
	private Long constantSymbol;
	
	@Max(value = 9999999999L, message = "Specifický symbol může mýt maximálně 10 znaků")
	@Column(name = "specific_symbol", length = 10)
	private Long specificSymbol;
	
	@JsonDeserialize(using = LocalDateDeserializer.class)  
	@JsonSerialize(using = LocalDateSerializer.class) 
	@Column(name = "payment_date")
	private LocalDate paymentDate;
	
	@Column(name = "payment_type")
	private String paymentType;

	@NotBlank(message = "Číslo účtu nesmí být prázdné")
	@Size(min = 15, max = 15, message = "Číslo účtu musí mýt 10 znaků")
	@Column(name = "account_number", length = 15)
	private String accountNumber;
	
// Bezparametrový konstruktor //////////////////////////////////////////////////////////////////////
	
	public Payment() {
		
	}
	
// Gettery + Settery ///////////////////////////////////////////////////////////////////////////////
	
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}
	
	public Long getUserID() {
		return userID;
	}

	public void setUserID(Long userID) {
		this.userID = userID;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getMark() {
		return mark;
	}

	public void setMark(String mark) {
		this.mark = mark;
	}

	public BigDecimal getAmount() {
		
		return amount;
	}

	public void setAmount(BigDecimal amount) {
		this.amount = amount;
	}

	public Currency getCurrency() {
		return currency;
	}

	public void setCurrency(Currency currency) {
		this.currency = currency;
	}

	public Long getVariableSymbol() {
		return variableSymbol;
	}

	public void setVariableSymbol(Long variableSymbol) {
		this.variableSymbol = variableSymbol;
	}

	public Long getConstantSymbol() {
		return constantSymbol;
	}

	public void setConstantSymbol(Long constantSymbol) {
		this.constantSymbol = constantSymbol;
	}

	public Long getSpecificSymbol() {
		return specificSymbol;
	}

	public void setSpecificSymbol(Long specificSymbol) {
		this.specificSymbol = specificSymbol;
	}

	public LocalDate getPaymentDate() {
		return paymentDate;
	}

	public void setPaymentDate(LocalDate paymentDate) {
		this.paymentDate = paymentDate;
	}

	public String getPaymentType() {
		return paymentType;
	}

	public void setPaymentType(String paymentType) {
		this.paymentType = paymentType;
	}

	public String getAccountNumber() {
		return accountNumber;
	}

	public void setAccountNumber(String accountNumber) {
		this.accountNumber = accountNumber;
	}
	
}
