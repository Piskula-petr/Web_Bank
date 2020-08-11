package cz.web_bank.servise;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import cz.web_bank.entity.Payment;

public interface PaymentServise {

	public Long getPaymentsCount(Long userID);
	
	public List<Payment> getPaymentsByUserID(Long userID, LocalDate startOfMonth,
											 LocalDate endOfMonth);
	
	public BigDecimal getPaymentsSum(Long userID, String mark, LocalDate startOfMonth,
			 					     LocalDate endOfMonth);
	
	public void savePayment(Payment senderPayment);
}
