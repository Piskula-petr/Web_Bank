package cz.web_bank.servise;

import cz.web_bank.entity.User;

public interface UserServise {
	
	public long getUserIDByLoginData(long clientNumber, String password);

	public User getUserByID(long userID);
	
}