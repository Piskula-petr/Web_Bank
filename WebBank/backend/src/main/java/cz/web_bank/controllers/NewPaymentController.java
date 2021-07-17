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
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import cz.web_bank.entities.BankCode;
import cz.web_bank.entities.Currency;
import cz.web_bank.entities.Payment;
import cz.web_bank.services.BankCodesService;
import cz.web_bank.services.CurrenciesService;
import cz.web_bank.services.PaymentService;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("api")
public class NewPaymentController {

	@Autowired
	private BankCodesService bankCodesServise;
	
	@Autowired
	private CurrenciesService currenciesServise;
	
	@Autowired
	private PaymentService paymentServise;
	
	
	/**
	 * 	Získání seznamu bankovních kódů
	 * 
	 * 	@return - vrací List bankovních kódů
	 */
	@GetMapping("/bankCodes")
	public List<BankCode> getBankCodes() {
		
		List<BankCode> bankCodes = bankCodesServise.getBankCodes();
		
		return bankCodes;
	}
	
	
	/**
	 * 	Získání seznamu měn
	 * 
	 * 	@return - vrací List měn
	 */
	@GetMapping("/currencies")
	public List<Currency> getCurrencies() {
		
		List<Currency> currencies = currenciesServise.getCurrencies();
		
		return currencies;
	}
	
	
	/**
	 * 	Uložení nové platby
	 * 
	 * 	@param payment - platba pro uložení
	 * 	@param result - BindingResult
	 * 
	 * 	@return - vrací chybové zprávy
	 */
	@PostMapping("/newPayment")
	public ResponseEntity<Object> newPayment(@Valid @RequestBody Payment payment, BindingResult result) {
		
		HttpStatus status = HttpStatus.OK;
		Map<String, Object> body = new LinkedHashMap<>();
		
		// Chyba při validaci
		if (result.hasErrors()) {
			
			List<FieldError> errors = result.getFieldErrors();
			
			// Přidání chybových zpráv do odpovědi
			for (FieldError error : errors) {
				body.put(error.getField(), error.getDefaultMessage());
			}
			
			status = HttpStatus.BAD_REQUEST;
			
		// Uložení platby
		} else {

			paymentServise.savePayment(payment);
		}
		
		body.put("timestamp", new Date());
		
		return new ResponseEntity<Object>(body, status);
	}
	
}
