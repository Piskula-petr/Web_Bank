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
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateSerializer;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity()
@Table(name = "payments")
@NoArgsConstructor
@Getter
@Setter
public class Payment {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Long id;
	
	@Column(name = "user_id")
	private Long userID;
	
	@NotBlank(message = "Název platby nesmí být prázdný")
	@Column(name = "name")
	private String name;
	
	@Column(name = "mark", length = 1)
	private String mark;
	
	@Min(value = 1, message = "Částka platby nesmí být prázdná")
	@Column(name = "amount")
	private BigDecimal amount;
	
	@Column(name = "currency", length = 3)
	private Currency currency;
	
	@Column(name = "variable_symbol", length = 10)
	private Long variableSymbol;
	
	@Column(name = "constant_symbol", length = 10)
	private Long constantSymbol;
	
	@Column(name = "specific_symbol", length = 10)
	private Long specificSymbol;
	
	@JsonDeserialize(using = LocalDateDeserializer.class)  
	@JsonSerialize(using = LocalDateSerializer.class) 
	@Column(name = "payment_date")
	private LocalDate paymentDate;
	
	@Column(name = "payment_type")
	private String paymentType;

	@NotBlank(message = "Číslo účtu nesmí být prázdné")	
	@Column(name = "account_number", length = 15)
	private String accountNumber;
	
}
