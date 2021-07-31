package cz.web_bank.services.impl;

import javax.transaction.Transactional;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cz.web_bank.entities.UserInfo;
import cz.web_bank.services.UserService;

@Service
public class UserServiceImpl implements UserService {

	@Autowired
	private SessionFactory sessionFactory;
	
	
	/**
	 * 	Uživatelské ID
	 * 
	 * 	@param clientNumber - klientské číslo
	 * 
	 * 	@return - vrací uživatelské ID
	 */
	@Override
	@Transactional
	public Long getUserIDByClientNumber(Long clientNumber) {
		
		Session session = sessionFactory.getCurrentSession();
		Query query = session.createQuery(
			
		"SELECT id "
	  + "FROM User "
	  + "WHERE client_number = :clientNumber");
		
		query.setParameter("clientNumber", clientNumber);
		
		return (Long) query.uniqueResult();
	}

	
	/**
	 * 	Informace o uživateli podle ID
	 * 
	 * 	@param userID - uživatelské ID
	 * 
	 * 	@return - vrací informace o uživateli
	 */
	@Override
	@Transactional
	public UserInfo getUserInfoByID(Long userID) {
		
		Session session = sessionFactory.getCurrentSession();
		UserInfo userInfo = session.get(UserInfo.class, userID);
		
		return userInfo;
	}
	
}
