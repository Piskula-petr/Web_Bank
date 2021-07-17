package cz.web_bank.services;

import java.util.List;

import cz.web_bank.entities.Currency;

public interface CurrenciesService {

	
	/**
	 * 	Seznam měn
	 * 
	 * 	@return - vrací List měn
	 */
	public List<Currency> getCurrencies();
	
}
