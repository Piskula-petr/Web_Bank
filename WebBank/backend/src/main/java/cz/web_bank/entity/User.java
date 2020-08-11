package cz.web_bank.entity;

import java.math.BigDecimal;
import java.util.Currency;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity(name = "users")
public class User {

	@Id
	@GeneratedValue()
	@Column(name = "id")
	private Long id;
	
	@Column(name = "name", length = 100)
	private String name;
	
	@Column(name = "surname", length = 100)
	private String surname;
	
	@Column(name = "email", length = 100)
	private String email;
	
	@Column(name = "client_number")
	private Long clientNumber;
	
	@Column(name = "password", length = 100)
	private String password;
	
	@Column(name = "balance")
	private BigDecimal balance;
	
	@Column(name = "currency", length = 3)
	private Currency currency; 
	
	@Column(name = "account_number", length = 15)
	private String accountNumber;
	
// Konstruktor ///////////////////////////////////////////////////////////////////////////////////////

	public User() {

	}
	
// Gettery + Settery /////////////////////////////////////////////////////////////////////////////////
	
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}
	
	public void setName(String name) {
		this.name = name;
	}
	
	public String getSurname() {
		return surname;
	}
	
	public void setSurname(String surname) {
		this.surname = surname;
	}
	
	public String getEmail() {
		return email;
	}
	
	public void setEmail(String email) {
		this.email = email;
	}
	
	public Long getClientNumber() {
		return clientNumber;
	}
	
	public void setClientNumber(Long clientNumber) {
		this.clientNumber = clientNumber;
	}
	
	public String getPassword() {
		return password;
	}
	
	public void setPassword(String password) {
		this.password = password;
	}
	
	public BigDecimal getBalance() {
		return balance;
	}
	
	public void setBalance(BigDecimal balance) {
		this.balance = balance;
	}
	
	public Currency getCurrency() {
		return currency;
	}

	public void setCurrency(Currency currency) {
		this.currency = currency;
	}

	public String getAccountNumber() {
		return accountNumber;
	}

	public void setAccountNumber(String accountNumber) {
		this.accountNumber = accountNumber;
	}
	
}
