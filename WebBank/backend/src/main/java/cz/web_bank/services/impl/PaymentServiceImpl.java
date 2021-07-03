package cz.web_bank.services.impl;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.Date;
import java.util.List;

import javax.transaction.Transactional;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cz.web_bank.entities.Payment;
import cz.web_bank.services.PaymentService;

@Service
public class PaymentServiceImpl implements PaymentService {

	@Autowired
	private SessionFactory sessionFactory;
	
	
	/**
	 * 	Celkový počet plateb uřivatele
	 * 
	 * 	@param userID - uživatelské ID
	 * 	
	 * 	@return - vrací celkový počet plateb
	 */
	@Override
	@Transactional
	public Long getPaymentsCount(Long userID) {
		
		Session session = sessionFactory.getCurrentSession();
		Query query = session.createQuery(
				
		"SELECT COUNT(*) "
	  + "FROM Payment "
	  + "WHERE user_id = :userID");
		
		query.setParameter("userID", userID);
		
		Long paymentsCount = (Long) query.uniqueResult();
		
		return paymentsCount;
	}
	
	
	/**
	 * 	Seznam plateb uživatele v zadaném měsíci
	 * 
	 * 	@param userID - uživatelské ID
	 * 	@param startOfMonth - první den v měsíci
	 * 	@param endOfMonth - poslední den v měsíci
	 * 
	 * 	@return - vrací List plateb v měsíci
	 */
	@Override
	@Transactional
	public List<Payment> getPaymentsByUserID(Long userID, LocalDate startOfMonth,
											 LocalDate endOfMonth) {
		
		Session session = sessionFactory.getCurrentSession();
		Query query = session.createQuery(	
				
		"FROM Payment "
	  + "WHERE user_id = :userID "
	  + "AND payment_date BETWEEN :startOfMonth AND :endOfMonth "
	  + "ORDER BY payment_date DESC", Payment.class);
		
		query.setParameter("userID", userID);
		query.setParameter("startOfMonth", startOfMonth);
		query.setParameter("endOfMonth", endOfMonth);
		
		List<Payment> payments = query.list();
 		
		return payments;
	}
	
	
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
	@Override
	@Transactional
	public BigDecimal getPaymentsSum(Long userID, String mark, LocalDate startOfMonth, 
								 	 LocalDate endOfMonth) {
		
		Session session = sessionFactory.getCurrentSession();
		Query query = session.createQuery(
		
		"SELECT SUM(amount) "
	  + "FROM Payment "
	  + "WHERE user_id = :userID AND mark = :mark "
	  + "AND payment_date BETWEEN :startOfMonth AND :endOfMonth");
		
		query.setParameter("userID", userID);
		query.setParameter("mark", mark);
		query.setParameter("startOfMonth", startOfMonth);
		query.setParameter("endOfMonth", endOfMonth);
		
		BigDecimal resultSum = (BigDecimal) query.uniqueResult();
		
		// Natsavení 0, při žádném výsledku
		if (resultSum == null) {
			
			resultSum = resultSum.ZERO;
		}
		
		return resultSum;
	}
	
	
	/**
	 * 	Uložení nové platby
	 * 
	 * 	@param senderPayment - platba odesilatele
	 */
	@Override
	@Transactional
	public void savePayment(Payment senderPayment) {
		
		Session session = sessionFactory.getCurrentSession();
		
// Získání čísla účtu odesilatele ////////////////////////////////////////////////////////
		
		Query query = session.createQuery(
				
		"SELECT accountNumber "
	  + "FROM User "
	  + "WHERE id = :senderID");
		
		query.setParameter("senderID", senderPayment.getUserID());
		
		String senderAccountNumber = (String) query.uniqueResult();
		
// Odečtení částky z účtu odesilatele ////////////////////////////////////////////////////
		
		query = session.createQuery(
				
		"UPDATE User "
	  + "SET balance = balance - :amount "
	  + "WHERE account_number = :senderAccountNumber");
		
		query.setParameter("amount", senderPayment.getAmount());
		query.setParameter("senderAccountNumber", senderAccountNumber);
		
		query.executeUpdate();

// Uložení nové platby odesilatele ///////////////////////////////////////////////////////

		session.save(senderPayment);
		
// Získání ID příjemce ///////////////////////////////////////////////////////////////////		

		query = session.createQuery(
				
		"SELECT id "
	  + "FROM User "
	  + "WHERE account_number = :accountNumber");
		
		query.setParameter("accountNumber", senderPayment.getAccountNumber());
		
		Long recipientID = (Long) query.uniqueResult();
		
// Přičtení částky na účet příjemce //////////////////////////////////////////////////////		
		
		if (recipientID != null) {
			
			query = session.createQuery(
					
			"UPDATE User "
		  + "SET balance = balance + :amount "
		  + "WHERE account_number = :recipientAccountNumber");
			
			query.setParameter("amount", senderPayment.getAmount());
			query.setParameter("recipientAccountNumber", senderPayment.getAccountNumber());
			
			query.executeUpdate();
			
// Uložení nové platby příjemce ////////////////////////////////////////////////////////////

			Payment recipientPayment = new Payment();
			recipientPayment.setUserID(recipientID);
			recipientPayment.setName(senderPayment.getName());
			recipientPayment.setMark("+");
			recipientPayment.setAmount(senderPayment.getAmount());
			recipientPayment.setCurrency(senderPayment.getCurrency());
			recipientPayment.setVariableSymbol(senderPayment.getVariableSymbol());
			recipientPayment.setConstantSymbol(senderPayment.getConstantSymbol());
			recipientPayment.setSpecificSymbol(senderPayment.getSpecificSymbol());
			recipientPayment.setPaymentDate(senderPayment.getPaymentDate());
			recipientPayment.setPaymentType(senderPayment.getPaymentType());
			recipientPayment.setAccountNumber(senderAccountNumber);
			
			session.save(recipientPayment);
		}
	}
	
	
	/**
	 * 	Získání datumu poslední platby
	 * 
	 * 	@return - vrací datum poslední platby
	 */
	@Override
	@Transactional
	public LocalDate getLastPaymentDate() {
		
		Session session = sessionFactory.getCurrentSession();
		Query query = session.createQuery(
				
		"SELECT paymentDate "
	  + "FROM Payment "
	  + "ORDER BY id DESC");
		
		query.setMaxResults(1);
		
		LocalDate localDate = (LocalDate) query.uniqueResult();
		
		return localDate;
	}
	
	
	/**
	 * 	Získání plateb v měsící
	 * 
	 * 	@param startOfMonth - první den v měsíci
	 * 	@param endOfMonth - poslední den v měsíci
	 * 
	 * 	@return - vrací List plateb v měsíci
	 */
	@Override
	@Transactional
	public List<Payment> getPaymentsOfMonth(LocalDate startOfMonth, LocalDate endOfMonth) {
		
		Session session = sessionFactory.getCurrentSession();
		Query query = session.createQuery(	
				
		"FROM Payment "
	  + "WHERE payment_date BETWEEN :startOfMonth AND :endOfMonth "
	  + "ORDER BY payment_date DESC", Payment.class);
		
		query.setParameter("startOfMonth", startOfMonth);
		query.setParameter("endOfMonth", endOfMonth);
		
		List<Payment> payments = query.list();
		
		return payments;
	}

	
	/**
	 * Změna datumu platby
	 * 
	 * @param paymentID - ID platby
	 * @param newPaymentDate - nový datum platby
	 */
	@Override
	@Transactional
	public void updatePaymentDate(long paymentID, LocalDate newPaymentDate) {
		
		Session session = sessionFactory.getCurrentSession();
		Query query = session.createQuery(
				
		"UPDATE Payment "
	  + "SET payment_date = :newPaymentDate "
	  + "WHERE id = :paymentID");
		
		query.setParameter("newPaymentDate", newPaymentDate);
		query.setParameter("paymentID", paymentID);
		
		query.executeUpdate();
	}
	
}
