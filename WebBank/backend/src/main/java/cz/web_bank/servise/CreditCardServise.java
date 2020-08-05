package cz.web_bank.servise;

import cz.web_bank.entity.CreditCard;

public interface CreditCardServise {

	public CreditCard getCreditCardByUserID(long userID);
	
}
