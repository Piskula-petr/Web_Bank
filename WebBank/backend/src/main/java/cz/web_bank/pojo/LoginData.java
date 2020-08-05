package cz.web_bank.pojo;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

public class LoginData {

	private final String LENGHT_ERROR_MESSAGE = "Klientské číslo musí mýt 10 znaků";
	
	@NotNull(message = "Klientské číslo nesmí být prázdné")
	@Min(value = 1000000000L, message = LENGHT_ERROR_MESSAGE)
	@Max(value = 9999999999L, message = LENGHT_ERROR_MESSAGE)
	private long clientNumber;
	
	@NotBlank(message = "Heslo nesmí být prázdné")
	private String password;
	
// Konstruktor //////////////////////////////////////////////////////////////////////////////////////////////
	
	public LoginData() {
		
	}
	
// Gettery + Settery ////////////////////////////////////////////////////////////////////////////////////////
	
	public long getClientNumber() {
		return clientNumber;
	}

	public void setClientNumber(long clientNumber) {
		this.clientNumber = clientNumber;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}
	
}
