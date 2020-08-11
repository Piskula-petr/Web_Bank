package cz.web_bank.pojo;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

public class LoginData {
	
	@NotNull(message = "Klientské číslo nesmí být prázdné")
	@Min(value = 1000000000L, message = "Klientské číslo musí mýt 10 znaků")
	@Max(value = 9999999999L, message = "Klientské číslo musí mýt 10 znaků")
	private Long clientNumber;
	
	@NotBlank(message = "Heslo nesmí být prázdné")
	private String password;
	
// Konstruktor //////////////////////////////////////////////////////////////////////////////////////////////
	
	public LoginData() {
		
	}
	
// Gettery + Settery ////////////////////////////////////////////////////////////////////////////////////////
	
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
	
}
