package cz.web_bank.services.impl;

import javax.transaction.Transactional;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import cz.web_bank.entities.User;

@Service
public class UserDetailsImpl implements UserDetailsService {

	@Autowired
	private SessionFactory sessionFactory;
	
	
	/**
	 * Získání uživatele podle klientského čísla
	 */
	@Override
	@Transactional
	public UserDetails loadUserByUsername(String clientNumber) throws UsernameNotFoundException {
		
		Session session = sessionFactory.getCurrentSession();
		Query query = session.createQuery(
		
	    "FROM User "
	  + "WHERE client_number = :clientNumber");
		
		query.setParameter("clientNumber", Long.parseLong(clientNumber));
		
		UserDetails userDetails = (User) query.uniqueResult();
		
		return userDetails;
	}

}
