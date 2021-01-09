package cz.web_bank.controllers;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import cz.web_bank.entities.CreditCard;
import cz.web_bank.entities.Payment;
import cz.web_bank.entities.User;
import cz.web_bank.pojo.MonthSum;
import cz.web_bank.pojo.SelectedTerm;
import cz.web_bank.services.CreditCardService;
import cz.web_bank.services.PaymentService;
import cz.web_bank.services.UserService;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("api")
public class OverviewPageController {

	@Autowired
	private UserService userServise;
	
	@Autowired
	private CreditCardService creditCardServise;
	
	@Autowired
	private PaymentService paymentServise;
	
	/**
	 * 	Získání uživatele podle ID
	 * 
	 * 	@param userID - uživatelské ID
	 * 
	 * 	@return - vrací požadovaného uživatele
	 */
	@PostMapping("/user")
	public @ResponseBody User getUser(@RequestBody long userID) {
		
		User user = userServise.getUserByID(userID);
		
		return user;
	}
	
	/**
	 * 	Získání kreditní karty podle uživatelského ID
	 * 
	 * 	@param userID - uživatelské ID
	 * 
	 * 	@return - vrací požadovanou kreditní kartu
	 */
	@PostMapping("/credit-card")
	public @ResponseBody CreditCard getCreditCard(@RequestBody long userID) {
		
		CreditCard creditCard = creditCardServise.getCreditCardByUserID(userID);
	
		return creditCard;
	}
	
	/**
	 * 	Získání celkového počtu plateb uživatele
	 * 
	 * 	@param userID - uživatelské ID
	 * 
	 * 	@return - vrací Mapu s počtem plateb
	 */
	@PostMapping("/payments/count")
	public @ResponseBody Map<String, Long> getPaymentCount(@RequestBody long userID) {
		
		long count = paymentServise.getPaymentsCount(userID);
		
		Map<String, Long> paymentsCount = new HashMap<>();
		paymentsCount.put("paymentsCount", count);
		
		return paymentsCount;
	}
	
	/**
	 * 	Získání plateb uživatele v požadovaném měsíci
	 * 
	 * 	@param selectedTerm - zadané období (userID, month, year)
	 * 
	 * 	@return - vrací List plateb
	 */
	@PostMapping("/payments/month")
	public @ResponseBody List<Payment> getPayments(@RequestBody SelectedTerm selectedTerm) {
		
		// Začátek měsíce "2020-01-01"
		LocalDate startOfMonth = LocalDate.of(selectedTerm.getYear(), selectedTerm.getMonth(), 1);
		
		// Konec měsíce "2020-01-31"
		LocalDate endOfMonth = LocalDate.of(selectedTerm.getYear(), selectedTerm.getMonth(), startOfMonth.lengthOfMonth());
		
		List<Payment> payments = paymentServise.getPaymentsByUserID(selectedTerm.getUserID(), startOfMonth, endOfMonth);
		
		// Načtení plateb z pozdějšího měsíce 
		// Pouze při nízkém počtu plateb a v aktuálním měsíci
		if (payments.size() < 10 && LocalDate.now().getMonthValue() == selectedTerm.getMonth()) {
			
			startOfMonth = LocalDate.of(selectedTerm.getYear(), selectedTerm.getMonth(), 1);
			startOfMonth = startOfMonth.minusMonths(1);
			
			endOfMonth = LocalDate.of(selectedTerm.getYear(), selectedTerm.getMonth(), startOfMonth.lengthOfMonth());
			endOfMonth = endOfMonth.minusMonths(1);
			
			List<Payment> olderPayments = paymentServise.getPaymentsByUserID(selectedTerm.getUserID(), startOfMonth, endOfMonth);
			payments.addAll(olderPayments);
		}
		
		return payments;
	}
	
	/**
	 * 	Získání příjmů a výdajů uživatele v požadovaném měsíci
	 * 
	 * 	@param selectedTerm - zadané období (userID, month, year)
	 * 
	 * 	@return - vrací List příjmů a výdajů
	 */
	@PostMapping("/payments/sum/month")
	public @ResponseBody Map<String, BigDecimal> getMonnthSum(@RequestBody SelectedTerm selectedTerm) {
		
		// Začátek měsíce "2020-01-01"
		LocalDate startOfMonth = LocalDate.of(selectedTerm.getYear(), selectedTerm.getMonth(), 1);
		
		// Konec měsíce "2020-01-31"
		LocalDate endOfMonth = LocalDate.of(selectedTerm.getYear(), selectedTerm.getMonth(), startOfMonth.lengthOfMonth());
		
		Map <String, BigDecimal> paymentsSum = new HashMap<>();
		
		BigDecimal income = paymentServise.getPaymentsSum(selectedTerm.getUserID(), "+", startOfMonth, endOfMonth);
		BigDecimal costs = paymentServise.getPaymentsSum(selectedTerm.getUserID(), "-", startOfMonth, endOfMonth);
		
		BigDecimal balance = new BigDecimal(income.doubleValue() - costs.doubleValue());
		
		paymentsSum.put("income", income);
		paymentsSum.put("costs", costs);
		paymentsSum.put("balance", balance);
		
		return paymentsSum;
	}
	
	/**
	 * 	Získání příjmů a výdajů uživatele z posledních 3 měsíců
	 * 
	 * 	@param userID - uživatelské ID
	 * 
	 * 	@return - vrací List měsíčních příjmů a výdajů
	 */
	@PostMapping("/payments/sum/graphs")
	public @ResponseBody List<MonthSum> getMonthsSum(@RequestBody long userID) {
		
		List<MonthSum> monthsSum = new ArrayList<>();
		
		// Aktuální datum
		LocalDate localDate = LocalDate.now();
		
		// Přidání záznamů za poslední 3 měsíce
		for (int i = 0; i < 3; i++) {
			
			// Začátek měsíce "2020-01-01"
			LocalDate startOfMonth = LocalDate.of(localDate.getYear(), localDate.getMonthValue(), 1);

			// Konec měsíce "2020-01-31"
			LocalDate endOfMonth = LocalDate.of(localDate.getYear(), localDate.getMonthValue(), startOfMonth.lengthOfMonth());
			
			MonthSum monthSum = new MonthSum();
			monthSum.setIncome(paymentServise.getPaymentsSum(userID, "+", startOfMonth, endOfMonth));
			monthSum.setCosts(paymentServise.getPaymentsSum(userID, "-", startOfMonth, endOfMonth));
			monthsSum.add(monthSum);
			
			// Dekrementace o jeden měsíc
			localDate = localDate.minusMonths(1);
		}
		
		return monthsSum;
	}
	
}
