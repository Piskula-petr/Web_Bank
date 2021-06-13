package cz.web_bank.services;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import cz.web_bank.entities.Payment;

public interface PaymentService {

	
	/**
	 * 	Celkový počet plateb uřivatele
	 * 
	 * 	@param userID - uživatelské ID
	 * 	
	 * 	@return - vrací celkový počet plateb
	 */
	public Long getPaymentsCount(Long userID);
	
	
	/**
	 * 	Seznam plateb uživatele v zadaném měsíci
	 * 
	 * 	@param userID - uživatelské ID
	 * 	@param startOfMonth - první den v měsíci
	 * 	@param endOfMonth - poslední den v měsíci
	 * 
	 * 	@return - vrací List plateb v měsíci
	 */
	public List<Payment> getPaymentsByUserID(Long userID, LocalDate startOfMonth,
											 LocalDate endOfMonth);
	
	
	/**
	 * 	Součet plateb uživatele v zadaném měsíci
	 * 
	 * 	@param userID - uživatelské ID
	 * 	@param mark - "+", "-"
	 * 	@param startOfMonth - první den v měsíci
	 * 	@param endOfMonth - poslední den v měsíci
	 * 	
	 * 	@return - vrací součet plateb
	 */
	public BigDecimal getPaymentsSum(Long userID, String mark, LocalDate startOfMonth,
			 					     LocalDate endOfMonth);
	
	
	/**
	 * 	Uložení nové platby
	 * 
	 * 	@param senderPayment - platba odesilatele
	 */
	public void savePayment(Payment senderPayment);
	
}
