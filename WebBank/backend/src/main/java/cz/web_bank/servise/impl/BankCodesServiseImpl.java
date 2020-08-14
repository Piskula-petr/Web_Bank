package cz.web_bank.servise.impl;

import java.util.List;

import javax.transaction.Transactional;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cz.web_bank.entity.BankCode;
import cz.web_bank.servise.BankCodesServise;

@Service
public class BankCodesServiseImpl implements BankCodesServise {

	@Autowired
	private SessionFactory sessionFactory;
	
	/**
	 * 	Seznam bankovních kódů
	 * 
	 * 	@return - vrací List bankovních kódů
	 */
	@Override
	@Transactional
	public List<BankCode> getBankCodes() {

		Session session = sessionFactory.getCurrentSession();
		Query query = session.createQuery("FROM bank_codes");
		
		List<BankCode> bankCodes = query.list();
		 
		return bankCodes;
	}
	
}
