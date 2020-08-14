package cz.web_bank.servise;

import cz.web_bank.entity.CreditCard;

public interface CreditCardServise {

	/**
	 * 	Kreditní karta podle uživatelského ID
	 * 
	 * 	@param userID - uživatelské ID
	 * 	
	 * 	@return - vrací kreditní kartu
	 */
	public CreditCard getCreditCardByUserID(Long userID);
	
}
