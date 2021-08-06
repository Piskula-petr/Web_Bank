package cz.web_bank.pojo;

import java.math.BigDecimal;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class MonthSum {

	private int month;
	private BigDecimal income;
	private BigDecimal costs;
	
}
