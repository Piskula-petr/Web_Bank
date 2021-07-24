package cz.web_bank.pojo;

import java.math.BigDecimal;

public class MonthSum {

	private int month;
	private BigDecimal income;
	private BigDecimal costs;
	
// Bezparametrový konstruktor ////////////////////////////////////////////////////////////////
	
	public MonthSum() {
		
	}

// Gettery + Settery /////////////////////////////////////////////////////////////////////////
	
	public int getMonth() {
		return month;
	}

	public void setMonth(int month) {
		this.month = month;
	}
	
	public BigDecimal getIncome() {
		return income;
	}

	public void setIncome(BigDecimal income) {
		this.income = income;
	}

	public BigDecimal getCosts() {
		return costs;
	}

	public void setCosts(BigDecimal costs) {
		this.costs = costs;
	}
	
}
