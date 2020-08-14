package cz.web_bank.servise;

import java.util.List;

import cz.web_bank.entity.BankCode;

public interface BankCodesServise {

	/**
	 * 	Seznam bankovních kódů
	 * 
	 * 	@return - vrací List bankovních kódů
	 */
	public List<BankCode> getBankCodes();
	
}
