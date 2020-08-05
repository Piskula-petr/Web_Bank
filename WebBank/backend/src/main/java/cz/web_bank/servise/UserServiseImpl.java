package cz.web_bank.servise;

import javax.transaction.Transactional;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cz.web_bank.entity.User;

@Service
public class UserServiseImpl implements UserServise {

	@Autowired
	private SessionFactory sessionFactory;
	
	@Override
	@Transactional
	public long getUserIDByLoginData(long clientNumber, String password) {
		
		Session session = sessionFactory.getCurrentSession();
		Query query = session.createQuery(
				
		"SELECT id "
	  + "FROM users "
	  + "WHERE client_number = :clientNumber AND password = :password");
		
		query.setParameter("clientNumber", clientNumber);
		query.setParameter("password", password);
		
		return (Long) query.uniqueResult();
	}

	@Override
	@Transactional
	public User getUserByID(long userID) {
		
		Session session = sessionFactory.getCurrentSession();
		User user = session.get(User.class, userID);
		
		return user;
	}
	
}
