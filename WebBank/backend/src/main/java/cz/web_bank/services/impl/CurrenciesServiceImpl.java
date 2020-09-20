package cz.web_bank.services.impl;

import java.util.List;

import javax.transaction.Transactional;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cz.web_bank.entities.Currency;
import cz.web_bank.services.CurrenciesService;

@Service
public class CurrenciesServiceImpl implements CurrenciesService {

	@Autowired
	private SessionFactory sessionFactory;
	
	/**
	 * 	Seznam měn
	 * 
	 * 	@return - vrací List měn
	 */
	@Override
	@Transactional
	public List<Currency> getCurrencies() {

		Session session = sessionFactory.getCurrentSession();
		Query query = session.createQuery("FROM currencies");
		
		List<Currency> currencies = query.list();
		 
		return currencies;
	}
	
}
