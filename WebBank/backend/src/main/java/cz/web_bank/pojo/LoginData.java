package cz.web_bank.pojo;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class LoginData {
	
	@NotNull(message = "Klientské číslo nesmí být prázdné")
	private Long clientNumber;
	
	@NotBlank(message = "Heslo nesmí být prázdné")
	private String password;
	
}
