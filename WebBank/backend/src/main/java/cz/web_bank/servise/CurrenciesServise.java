package cz.web_bank.servise;

import java.util.List;

import cz.web_bank.entity.Currency;

public interface CurrenciesServise {

	/**
	 * 	Seznam měn
	 * 
	 * 	@return - vrací List měn
	 */
	public List<Currency> getCurrencies();
	
}
