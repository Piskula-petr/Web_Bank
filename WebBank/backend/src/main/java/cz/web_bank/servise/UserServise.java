package cz.web_bank.servise;

import cz.web_bank.entity.User;

public interface UserServise {
	
	/**
	 * 	Uživatelské ID
	 * 
	 * 	@param clientNumber - klientské číslo
	 * 	@param password - heslo
	 * 
	 * 	@return - vrací uživatelské ID
	 */
	public Long getUserIDByLoginData(Long clientNumber, String password);

	/**
	 * 	Detaily o uživatelei podle ID
	 * 
	 * 	@param userID - uživatelské ID
	 * 
	 * 	@return - vrací uživatele
	 */
	public User getUserByID(Long userID);
	
}