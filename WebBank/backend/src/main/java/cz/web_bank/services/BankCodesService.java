package cz.web_bank.services;

import java.util.List;

import cz.web_bank.entities.BankCode;

public interface BankCodesService {

	
	/**
	 * 	Seznam bankovních kódů
	 * 
	 * 	@return - vrací List bankovních kódů
	 */
	public List<BankCode> getBankCodes();
	
}
