package cz.web_bank;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.event.EventListener;

import cz.web_bank.entities.Payment;
import cz.web_bank.services.PaymentService;

@SpringBootApplication(exclude = HibernateJpaAutoConfiguration.class)
@ComponentScan(basePackages = "cz.web_bank")
public class ApplicationMain {

	@Autowired
	private PaymentService paymentService;
	
	public static void main(String[] args) {
		SpringApplication.run(ApplicationMain.class, args);
	}
	
	
	/**
	 * Aktualizace datumů plateb
	 */
	@EventListener(ApplicationReadyEvent.class)
	public void updatePayments() {
		
		LocalDate previousMonth = LocalDate.now().minusMonths(1);
		LocalDate lastPayment = paymentService.getLastPaymentDate();
		
		if (previousMonth.getMonthValue() != lastPayment.getMonthValue()) {
			
			// Začátek měsíce "2020-01-01"
			LocalDate startOfMonth = LocalDate.of(lastPayment.getYear(), lastPayment.getMonthValue(), 1);
			
			// Konec měsíce "2020-01-31"
			LocalDate endOfMonth = LocalDate.of(lastPayment.getYear(), lastPayment.getMonthValue(), 
				startOfMonth.lengthOfMonth());
			
			while (true) {
				
				// Získání plateb v měsící
				List<Payment> payments = paymentService.getPaymentsOfMonth(startOfMonth, endOfMonth);
				
				for (Payment payment : payments) {
					
					LocalDate newPaymentDate = LocalDate.of(previousMonth.getYear(), 
						previousMonth.getMonthValue(), payment.getPaymentDate().getDayOfMonth());
					
					// Změna datumu platby
					paymentService.updatePaymentDate(payment.getId(), newPaymentDate);
				}
				
				// Přerušení cyklu, po aktualizaci všech plateb
				if (payments.size() == 0) break;
				
				// Dekrementace o měsíc
				startOfMonth = startOfMonth.minusMonths(1);
				endOfMonth = endOfMonth.minusMonths(1);
				previousMonth = previousMonth.minusMonths(1);
			}			
		}
	}

}
