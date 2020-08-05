package cz.web_bank.servise;

import javax.transaction.Transactional;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cz.web_bank.entity.CreditCard;

@Service
public class CreditCardServiseImpl implements CreditCardServise {

	@Autowired
	private SessionFactory sessionFactory;
	
	@Override
	@Transactional
	public CreditCard getCreditCardByUserID(long userID) {

		Session session = sessionFactory.getCurrentSession();
		CreditCard creditCard = session.get(CreditCard.class, userID);
		
		return creditCard;
	}
	
}
