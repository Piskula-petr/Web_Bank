package cz.web_bank.entity;

import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Currency;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity(name = "payments")
public class Payment {

	@Id
	@GeneratedValue()
	@Column(name = "id")
	private long id;
	
	@Column(name = "name")
	private String name;
	
	@Column(name = "mark")
	private String mark;
	
	@Column(name = "amount")
	private BigDecimal amount;
	
	@Column(name = "currency")
	private Currency currency;
	
	@Column(name = "variable_symbol")
	private long variableSymbol;
	
	@Column(name = "constant_symbol")
	private int constantSymbol;
	
	@Column(name = "specific_symbol")
	private long specificSymbol;
	
	@Column(name = "payment_date")
	private LocalDate paymentDate;
	
	@Column(name = "payment_type")
	private String paymentType;

// Konstruktor /////////////////////////////////////////////////////////////////////////////////////
	
	public Payment() {
		
	}
	
// Gettery + Settery ///////////////////////////////////////////////////////////////////////////////
	
	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
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

	public String getAmount() {
		
		DecimalFormat decimalFormat = new DecimalFormat("##,###.00");
		
		return decimalFormat.format(amount);
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

	public long getVariableSymbol() {
		return variableSymbol;
	}

	public void setVariableSymbol(long variableSymbol) {
		this.variableSymbol = variableSymbol;
	}

	public int getConstantSymbol() {
		return constantSymbol;
	}

	public void setConstantSymbol(int constantSymbol) {
		this.constantSymbol = constantSymbol;
	}

	public long getSpecificSymbol() {
		return specificSymbol;
	}

	public void setSpecificSymbol(long specificSymbol) {
		this.specificSymbol = specificSymbol;
	}

	public String getPaymentDate() {
		return paymentDate.format(DateTimeFormatter.ofPattern("dd.MM.yyyy"));
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
	
}
