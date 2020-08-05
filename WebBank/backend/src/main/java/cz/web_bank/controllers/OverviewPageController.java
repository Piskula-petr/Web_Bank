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
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import cz.web_bank.entity.CreditCard;
import cz.web_bank.entity.Payment;
import cz.web_bank.entity.User;
import cz.web_bank.pojo.MonthSum;
import cz.web_bank.servise.CreditCardServise;
import cz.web_bank.servise.PaymentServise;
import cz.web_bank.servise.UserServise;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("api")
public class OverviewPageController {

	@Autowired
	private UserServise userServise;
	
	@Autowired
	private CreditCardServise creditCardServise;
	
	@Autowired
	private PaymentServise paymentServise;
	
	@GetMapping("/user/{userID}")
	public @ResponseBody User getUser(@PathVariable("userID") long userID) {
		
		User user = userServise.getUserByID(userID);
		
		return user;
	}
	
	@GetMapping("/credit-card/{userID}")
	public @ResponseBody CreditCard getCreditCard(@PathVariable("userID") long userID) {
		
		CreditCard creditCard = creditCardServise.getCreditCardByUserID(userID);
	
		return creditCard;
	}
	
	@GetMapping("/payments/count/{userID}")
	public @ResponseBody Map<String, Long> getPaymentCount(@PathVariable("userID") long userID) {
		
		long count = paymentServise.getPaymentsCount(userID);
		
		Map<String, Long> paymentsCount = new HashMap<>();
		paymentsCount.put("paymentsCount", count);
		
		return paymentsCount;
	}
	
	@GetMapping("/payments/{userID}/year={year}&month={month}")
	public @ResponseBody List<Payment> getPayments(@PathVariable("userID") long userID,
												   @PathVariable("year") int year,
												   @PathVariable("month") int month) {
		
		// Začátek měsíce "2020-01-01"
		LocalDate startOfMonth = LocalDate.of(year, month, 1);
		
		// Konec měsíce "2020-01-31"
		LocalDate endOfMonth = LocalDate.of(year, month, startOfMonth.lengthOfMonth());
		
		List<Payment> payments = paymentServise.getPaymentsByUserID(userID, startOfMonth, endOfMonth);
		
		// Načtení plateb z pozdějšího měsíce 
		// Pouze při nízkém počtu plateb a v aktuálním měsíci
		if (payments.size() < 10 && LocalDate.now().getMonthValue() == month) {
			
			startOfMonth = LocalDate.of(year, month - 1, 1);
			endOfMonth = LocalDate.of(year, month - 1, startOfMonth.lengthOfMonth());
			
			List<Payment> olderPayments = paymentServise.getPaymentsByUserID(userID, startOfMonth, endOfMonth);
			payments.addAll(olderPayments);
		}
		
		return payments;
	}
	
	@GetMapping("/payments/sum/{userID}/year={year}&month={month}")
	public @ResponseBody Map<String, BigDecimal> getMonnthSum(@PathVariable("userID") long userID,
											       			  @PathVariable("year") int year,
										       				  @PathVariable("month") int month) {
		
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
	
	@GetMapping("/payments/sum/{userID}")
	public @ResponseBody List<MonthSum> getMonthsSum(@PathVariable("userID") long userID) {
		
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
