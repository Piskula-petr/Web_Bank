package cz.web_bank.services.impl;

import javax.transaction.Transactional;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cz.web_bank.entities.User;
import cz.web_bank.services.UserService;

@Service
public class UserServiceImpl implements UserService {

	@Autowired
	private SessionFactory sessionFactory;
	
	
	/**
	 * 	Uživatelské ID
	 * 
	 * 	@param clientNumber - klientské číslo
	 * 	@param password - heslo
	 * 
	 * 	@return - vrací uživatelské ID
	 */
	@Override
	@Transactional
	public Long getUserIDByLoginData(Long clientNumber, String password) {
		
		Session session = sessionFactory.getCurrentSession();
		Query query = session.createQuery(
				
		"SELECT id "
	  + "FROM users "
	  + "WHERE client_number = :clientNumber AND password = :password");
		
		query.setParameter("clientNumber", clientNumber);
		query.setParameter("password", password);
		
		return (Long) query.uniqueResult();
	}

	
	/**
	 * 	Detaily o uživatelei podle ID
	 * 
	 * 	@param userID - uživatelské ID
	 * 
	 * 	@return - vrací uživatele
	 */
	@Override
	@Transactional
	public User getUserByID(Long userID) {
		
		Session session = sessionFactory.getCurrentSession();
		User user = session.get(User.class, userID);
		
		return user;
	}
	
}
