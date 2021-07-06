package cz.web_bank.controllers;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;

import cz.web_bank.ApplicationMain;
import cz.web_bank.entities.BankCode;
import cz.web_bank.entities.Currency;
import cz.web_bank.entities.Payment;
import cz.web_bank.services.BankCodesService;
import cz.web_bank.services.CurrenciesService;
import cz.web_bank.services.PaymentService;

@WebMvcTest(NewPaymentController.class)
public class NewPaymentControllerTest {

	private Random random;
	
	@Autowired
	private MockMvc mockMvc;
	
	@MockBean
	private BankCodesService bankCodesServise;
	
	@MockBean
	private CurrenciesService currenciesServise;
	
	@MockBean
	private PaymentService paymentServise;
	
	@MockBean
	private ApplicationMain applicationMain;
	
	
	/**
	 * Inicializace parametrů
	 * 
	 * @throws Exception
	 */
	@BeforeEach
	public void setUp() throws Exception {
		
		random = new Random();
	}
	
	
	/**
	 * Test metody pro získání bankovních kódů
	 * 
	 * @throws Exception
	 */
	@Test
	@WithMockUser(authorities = {"user"})
	public void getBankCodes() throws Exception {
		
		List<BankCode> bankCodes = new ArrayList<>();
		
		// Vytvoření testovacího bankovního kódu
		BankCode bankCode = new BankCode();
		bankCode.setId(random.nextLong());
		bankCode.setCode("0710");
		bankCode.setName("Česká národní banka");
		bankCodes.add(bankCode);
		
		when(bankCodesServise.getBankCodes()).thenReturn(bankCodes);
		
		// Porovnání výstupních hodnot
		mockMvc.perform(get("/api/bankCodes"))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.length()").value(bankCodes.size()))
			.andExpect(jsonPath("$[0].id").value(bankCode.getId()))
			.andExpect(jsonPath("$[0].code").value(bankCode.getCode()))
			.andExpect(jsonPath("$[0].name").value(bankCode.getName()));
		
		verify(bankCodesServise, times(1)).getBankCodes();
	}
	
	
	/**
	 * Test metody pro získání měn
	 * 
	 * @throws Exception
	 */
	@Test
	@WithMockUser(authorities = {"user"})
	public void getCurrencies() throws Exception {
		
		List<Currency> currencies = new ArrayList<>();
		
		// Vytvoření testovací měny
		Currency currency = new Currency();
		currency.setId(random.nextLong());
		currency.setState("Koruna česká");
		currency.setCode("CZK");
		currencies.add(currency);
		
		when(currenciesServise.getCurrencies()).thenReturn(currencies);
		
		// Porovnání výstupních hodnot
		mockMvc.perform(get("/api/currencies"))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.length()").value(currencies.size()))
			.andExpect(jsonPath("$[0].id").value(currency.getId()))
			.andExpect(jsonPath("$[0].state").value(currency.getState()))
			.andExpect(jsonPath("$[0].code").value(currency.getCode()));
		
		verify(currenciesServise, times(1)).getCurrencies();
	}
	
	
	/**
	 * Test metody pro úspěšné uložení nové platby
	 * 
	 * @throws Exception
	 */
	@Test
	@WithMockUser(authorities = {"user"})
	public void newPaymentSuccess() throws Exception {
		
		// vytvoření testovací platby
		Payment payment = new Payment();
		payment.setId(random.nextLong());
		payment.setUserID(random.nextLong());
		payment.setName("name");
		payment.setMark("-");			
		payment.setAmount(new BigDecimal(random.nextInt(Integer.MAX_VALUE - 1 + 1) + 1)); // Rozmezí od 1 - 2 147 483 647
		payment.setCurrency(java.util.Currency.getInstance("CZK"));
		payment.setVariableSymbol((long) random.nextInt());
		payment.setConstantSymbol((long) random.nextInt());
		payment.setSpecificSymbol((long) random.nextInt());
		payment.setPaymentDate(LocalDate.now());
		payment.setPaymentType("paymentType");
		payment.setAccountNumber("1234567890/0000");
		
		// Porovnání výstupních hodnot
		mockMvc.perform((post("/api/newPayment")
			.contentType(MediaType.APPLICATION_JSON)
			.content(new ObjectMapper().writeValueAsString(payment))))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.timestamp").exists());
		
		verify(paymentServise, times(1)).savePayment(any(Payment.class));
	}
	
	
	/**
	 * Test metody pro neúspěšné uložení nové platby
	 * 
	 * @throws Exception
	 */
	@Test
	@WithMockUser(authorities = {"user"})
	public void newPaymentFailed() throws Exception {
		
		// vytvoření testovací platby
		Payment payment = new Payment();
		payment.setAmount(new BigDecimal(0));
		payment.setVariableSymbol(Long.MAX_VALUE);
		payment.setConstantSymbol(Long.MAX_VALUE);
		payment.setSpecificSymbol(Long.MAX_VALUE);
		
		// Porovnání výstupních hodnot
		mockMvc.perform((post("/api/newPayment")
			.contentType(MediaType.APPLICATION_JSON)
			.content(new ObjectMapper().writeValueAsString(payment))))
			.andExpect(status().isBadRequest())
			.andExpect(jsonPath("$.timestamp").exists())
			.andExpect(jsonPath("$.name").value("Název platby nesmí být prázdný"))
			.andExpect(jsonPath("$.amount").value("Částka platby nesmí být prázdná"))
			.andExpect(jsonPath("$.variableSymbol").value("Variabilní symbol může mýt maximálně 10 znaků"))
			.andExpect(jsonPath("$.constantSymbol").value("Konstantní symbol může mýt maximálně 10 znaky"))
			.andExpect(jsonPath("$.specificSymbol").value("Specifický symbol může mýt maximálně 10 znaků"))
			.andExpect(jsonPath("$.accountNumber").value("Číslo účtu nesmí být prázdné"));
		
		verify(paymentServise, times(0)).savePayment(any(Payment.class));;
	}
	
}
