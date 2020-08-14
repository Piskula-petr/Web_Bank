package cz.web_bank.servise.impl;

import javax.transaction.Transactional;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cz.web_bank.entity.CreditCard;
import cz.web_bank.servise.CreditCardServise;

@Service
public class CreditCardServiseImpl implements CreditCardServise {

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
