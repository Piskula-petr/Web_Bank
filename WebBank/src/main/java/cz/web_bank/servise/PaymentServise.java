package cz.web_bank.servise;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import cz.web_bank.entity.Payment;

public interface PaymentServise {

	public long getPaymentsCount(long userID);
	
	public List<Payment> getPaymentsByUserID(long userID, LocalDate startOfMonth,
											 LocalDate endOfMonth);
	
	public BigDecimal getPaymentsSum(long userID, String mark, LocalDate startOfMonth,
			 					     LocalDate endOfMonth);
	
}
