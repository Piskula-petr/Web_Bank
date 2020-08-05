package cz.web_bank.servise;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import javax.transaction.Transactional;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cz.web_bank.entity.Payment;

@Service
public class PaymentServiseImpl implements PaymentServise {

	@Autowired
	private SessionFactory sessionFactory;
	
	@Override
	@Transactional
	public long getPaymentsCount(long userID) {
		
		Session session = sessionFactory.getCurrentSession();
		Query query = session.createQuery(
				
		"SELECT COUNT(*) "
	  + "FROM payments "
	  + "WHERE user_id = :userID");
		
		query.setParameter("userID", userID);
		
		Long paymentsCount = (Long) query.uniqueResult();
		
		return paymentsCount;
	}
	
	@Override
	@Transactional
	public List<Payment> getPaymentsByUserID(long userID, LocalDate startOfMonth,
											 LocalDate endOfMonth) {
		
		Session session = sessionFactory.getCurrentSession();
		Query query = session.createQuery(	
				
		"FROM payments "
	  + "WHERE user_id = :userID "
	  + "AND payment_date BETWEEN :startOfMonth AND :endOfMonth "
	  + "ORDER BY payment_date DESC");
		
		query.setParameter("userID", userID);
		query.setParameter("startOfMonth", startOfMonth);
		query.setParameter("endOfMonth", endOfMonth);
		
		List<Payment> payments = query.list();
 		
		return payments;
	}
	
	@Override
	@Transactional
	public BigDecimal getPaymentsSum(long userID, String mark, LocalDate startOfMonth, 
								 LocalDate endOfMonth) {
		
		Session session = sessionFactory.getCurrentSession();
		Query query = session.createQuery(
		
		"SELECT SUM(amount) "
	  + "FROM payments "
	  + "WHERE user_id = :userID AND mark = :mark "
	  + "AND payment_date BETWEEN :startOfMonth AND :endOfMonth");
		
		query.setParameter("userID", userID);
		query.setParameter("mark", mark);
		query.setParameter("startOfMonth", startOfMonth);
		query.setParameter("endOfMonth", endOfMonth);
		
		return (BigDecimal) query.uniqueResult();
	}
	
}
