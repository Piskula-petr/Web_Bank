package cz.web_bank.services;

import cz.web_bank.entities.CreditCard;

public interface CreditCardService {

	/**
	 * 	Kreditní karta podle uživatelského ID
	 * 
	 * 	@param userID - uživatelské ID
	 * 	
	 * 	@return - vrací kreditní kartu
	 */
	public CreditCard getCreditCardByUserID(Long userID);
	
}
