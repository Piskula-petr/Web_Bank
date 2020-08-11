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
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import cz.web_bank.entity.BankCode;
import cz.web_bank.entity.Currency;
import cz.web_bank.entity.Payment;
import cz.web_bank.servise.BankCodesServise;
import cz.web_bank.servise.CurrenciesServise;
import cz.web_bank.servise.PaymentServise;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("api")
public class NewPaymentController {

	@Autowired
	private BankCodesServise bankCodesServise;
	
	@Autowired
	private CurrenciesServise currenciesServise;
	
	@Autowired
	private PaymentServise paymentServise;
	
	@GetMapping("/bank-codes")
	public @ResponseBody List<BankCode> getBankCodes() {
		
		List<BankCode> bankCodes = bankCodesServise.getBankCodes();
		
		return bankCodes;
	}
	
	@GetMapping("/currencies")
	public @ResponseBody List<Currency> getCurrencies() {
		
		List<Currency> currencies = currenciesServise.getCurrencies();
		
		return currencies;
	}
	
	@PostMapping("/new-payment")
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
