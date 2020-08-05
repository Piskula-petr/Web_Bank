package cz.web_bank.controllers;

import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import cz.web_bank.pojo.LoginData;
import cz.web_bank.servise.UserServise;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("api")
public class LoginPageController {

	@Autowired
	private UserServise userServise;
	
	/**
	 * 	Ověření přihlašovacích údajů
	 * 
	 * 	@param loginData - přihlašovací údaje
	 * 	@param result - BindingResult
	 */
	@PostMapping("/login")
	public ResponseEntity<Object> login(@Valid @RequestBody LoginData loginData, BindingResult result) {
		
		HttpStatus status = HttpStatus.BAD_REQUEST;
		Map<String, Object> body = new LinkedHashMap<>();
		
		// Chyba při validaci
		if (result.hasErrors()) {
			
			List<FieldError> errors = result.getFieldErrors();
			
			// Přidání chybových zpráv do odpovědi
			for (FieldError error : errors) {
				body.put(error.getField(), error.getDefaultMessage());
			}
			
		// Ověření přihlašovacích údajů
		} else {
			
			Long userID = userServise.getUserIDByLoginData(loginData.getClientNumber(), loginData.getPassword());
			
			// Přidání ID uživatele do odpovědi
			if (userID != null) {
				
				body.put("userID", userID);
				status = HttpStatus.OK;
				
			} else body.put("clientNumber", "Přihlašovací údaje jsou nesprávné");
		}
		
		body.put("timestamp", new Date());
		body.put("status", status);
		
		return new ResponseEntity<Object>(body, status);
	}
	
}
