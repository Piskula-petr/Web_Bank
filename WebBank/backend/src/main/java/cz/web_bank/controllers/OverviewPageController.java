package cz.web_bank.controllers;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import cz.web_bank.entities.CreditCard;
import cz.web_bank.entities.Payment;
import cz.web_bank.entities.UserInfo;
import cz.web_bank.pojo.MonthSum;
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
	 * 	Získání informací o uživateli podle ID
	 * 
	 * 	@param userID - uživatelské ID
	 * 
	 * 	@return - vrací informace o uživateli
	 */
	@GetMapping("/userInfo/userID={userID}")
	public UserInfo getUser(@PathVariable("userID") long userID) {
		
		UserInfo userInfo = userServise.getUserInfoByID(userID);
		
		return userInfo;
	}
	
	
	/**
	 * 	Získání kreditní karty podle uživatelského ID
	 * 
	 * 	@param userID - uživatelské ID
	 * 
	 * 	@return - vrací požadovanou kreditní kartu
	 */
	@GetMapping("/creditCard/userID={userID}")
	public CreditCard getCreditCard(@PathVariable("userID") long userID) {
		
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
	@GetMapping("/payments/count/userID={userID}")
	public Map<String, Long> getPaymentCount(@PathVariable("userID") long userID) {
		
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
	@GetMapping("/payments/month/userID={userID}&month={month}&year={year}")
	public List<Payment> getPayments(@PathVariable("userID") long userID,
									 @PathVariable("month") int month,
									 @PathVariable("year") int year) {
		
		// Začátek měsíce "2020-01-01"
		LocalDate startOfMonth = LocalDate.of(year, month, 1);
		
		// Konec měsíce "2020-01-31"
		LocalDate endOfMonth = LocalDate.of(year, month, startOfMonth.lengthOfMonth());
		
		List<Payment> payments = paymentServise.getPaymentsByUserID(userID, startOfMonth, endOfMonth);
		
		// Načtení plateb z pozdějšího měsíce 
		// Pouze při nízkém počtu plateb a v aktuálním měsíci
		if (payments.size() < 10 && LocalDate.now().getMonthValue() == month) {
			
			// Dekrementace o jeden měsíc
			startOfMonth = startOfMonth.minusMonths(1);
			endOfMonth = endOfMonth.minusMonths(1);
			
			List<Payment> olderPayments = paymentServise.getPaymentsByUserID(userID, startOfMonth, endOfMonth);
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
	@GetMapping("/payments/sum/month/userID={userID}&month={month}&year={year}")
	public Map<String, BigDecimal> getMonnthSum(@PathVariable("userID") long userID, 
												@PathVariable("month") int month,
												@PathVariable("year") int year) {
		
		// Začátek měsíce "2020-01-01"
		LocalDate startOfMonth = LocalDate.of(year, month, 1);
		
		// Konec měsíce "2020-01-31"
		LocalDate endOfMonth = LocalDate.of(year, month, startOfMonth.lengthOfMonth());
		
		Map <String, BigDecimal> paymentsSum = new HashMap<>();
		
		BigDecimal income = paymentServise.getPaymentsSum(userID, "+", startOfMonth, endOfMonth);
		BigDecimal costs = paymentServise.getPaymentsSum(userID, "-", startOfMonth, endOfMonth);
		
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
	@GetMapping("/payments/sum/graphs/userID={userID}")
	public List<MonthSum> getMonthsSum(@PathVariable("userID") long userID) {
		
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
			monthSum.setMonth(localDate.getMonthValue());
			monthSum.setIncome(paymentServise.getPaymentsSum(userID, "+", startOfMonth, endOfMonth));
			monthSum.setCosts(paymentServise.getPaymentsSum(userID, "-", startOfMonth, endOfMonth));
			monthsSum.add(monthSum);
			
			// Dekrementace o jeden měsíc
			localDate = localDate.minusMonths(1);
		}
		
		return monthsSum;
	}
	
}
