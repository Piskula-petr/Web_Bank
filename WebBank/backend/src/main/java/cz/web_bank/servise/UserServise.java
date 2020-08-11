package cz.web_bank.servise;

import cz.web_bank.entity.User;

public interface UserServise {
	
	public Long getUserIDByLoginData(Long clientNumber, String password);

	public User getUserByID(Long userID);
	
}