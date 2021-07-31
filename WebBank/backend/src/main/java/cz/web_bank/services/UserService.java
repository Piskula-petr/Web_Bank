package cz.web_bank.services;

import cz.web_bank.entities.UserInfo;

public interface UserService {
	
	
	/**
	 * 	Uživatelské ID
	 * 
	 * 	@param clientNumber - klientské číslo
	 * 
	 * 	@return - vrací uživatelské ID
	 */
	public Long getUserIDByClientNumber(Long clientNumber);

	
	/**
	 * 	Informace o uživateli podle ID
	 * 
	 * 	@param userID - uživatelské ID
	 * 
	 * 	@return - vrací informace o uživateli
	 */
	public UserInfo getUserInfoByID(Long userID);
	
	
}