package cz.web_bank.services.impl;

import javax.transaction.Transactional;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cz.web_bank.entities.CreditCard;
import cz.web_bank.services.CreditCardService;

@Service
public class CreditCardServiceImpl implements CreditCardService {

	@Autowired
	private SessionFactory sessionFactory;
	
	/**
	 * 	Kreditní karta podle uživatelského ID
	 * 
	 * 	@param userID - uživatelské ID
	 * 	
	 * 	@return - vrací kreditní kartu
	 */
	@Override
	@Transactional
	public CreditCard getCreditCardByUserID(Long userID) {

		Session session = sessionFactory.getCurrentSession();
		CreditCard creditCard = session.get(CreditCard.class, userID);
		
		return creditCard;
	}
	
}
