package cz.web_bank.controllers;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Currency;
import java.util.List;
import java.util.Random;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import cz.web_bank.ApplicationMain;
import cz.web_bank.entities.CreditCard;
import cz.web_bank.entities.Payment;
import cz.web_bank.entities.UserInfo;
import cz.web_bank.services.CreditCardService;
import cz.web_bank.services.PaymentService;
import cz.web_bank.services.UserService;

@WebMvcTest(OverviewPageController.class)
public class OverviewPageControllerTest {

	private Random random;
	private LocalDate localDate;
	
	@Autowired
	private MockMvc mockMvc;
	
	@MockBean
	private UserService userService;
	
	@MockBean
	private CreditCardService creditCardService;
	
	@MockBean
	private PaymentService paymentService;
	
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
		localDate = LocalDate.now();
	}
	
	
	/**
	 * Test metody pro získání uživatele
	 * 
	 * @throws Exception
	 */
	@Test
	@WithMockUser(authorities = {"user"})
	public void getUser() throws Exception {
		
		// Testovací uživatel
		UserInfo userInfo = new UserInfo();
		userInfo.setId(random.nextLong());
		userInfo.setName("name");
		userInfo.setSurname("surname");
		userInfo.setBalance(new BigDecimal(random.nextLong()));
		userInfo.setCurrency(Currency.getInstance("CZK"));
		userInfo.setAccountNumber("1234567890/0000");
		
		when(userService.getUserInfoByID(anyLong())).thenReturn(userInfo);
		
		// ID uživatele
		long userID = random.nextLong();
		
		// Porovnání výstupních hodnot
		mockMvc.perform(get("/api/userInfo/userID=" + userID))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.id").value(userInfo.getId()))
			.andExpect(jsonPath("$.name").value(userInfo.getName()))
			.andExpect(jsonPath("$.surname").value(userInfo.getSurname()))
			.andExpect(jsonPath("$.balance").value(userInfo.getBalance()))
			.andExpect(jsonPath("$.currency").value(userInfo.getCurrency().toString()))
			.andExpect(jsonPath("$.accountNumber").value(userInfo.getAccountNumber()));
		
		verify(userService, times(1)).getUserInfoByID(anyLong());
	}
	
	
	/**
	 * Test metody pro získání kreditní karty
	 * 
	 * @throws Exception
	 */
	@Test
	@WithMockUser(authorities = {"user"})
	public void getCreditCard() throws Exception {
		
		// Testovací kreditní karta
		CreditCard creditCard = new CreditCard();
		creditCard.setId(random.nextLong());
		creditCard.setCardNumber("1122334455667788");
		creditCard.setValidFrom(localDate);
		creditCard.setValidTo(localDate.plusYears(1));
		creditCard.setType("type");
		
		when(creditCardService.getCreditCardByUserID(anyLong())).thenReturn(creditCard);
		
		// ID uživatele
		long userID = random.nextLong();
		
		// Porovnání výstupních hodnot
		mockMvc.perform(get("/api/creditCard/userID=" + userID))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.id").value(creditCard.getId()))
			.andExpect(jsonPath("$.cardNumber").value(creditCard.getCardNumber()))
			.andExpect(jsonPath("$.validFrom").value(creditCard.getValidFrom()))
			.andExpect(jsonPath("$.validTo").value(creditCard.getValidTo()))
			.andExpect(jsonPath("$.type").value(creditCard.getType()));
		
		verify(creditCardService, times(1)).getCreditCardByUserID(anyLong());
	}
	
	
	/**
	 * Test metody pro získání počtu plateb
	 * 
	 * @throws Exception
	 */
	@Test
	@WithMockUser(authorities = {"user"})
	public void getPaymentCount() throws Exception {
		
		// Počet plateb
		long paymentCount = random.nextLong();
		
		when(paymentService.getPaymentsCount(anyLong())).thenReturn(paymentCount);
		
		// ID uživatele
		long userID = random.nextLong();
		
		mockMvc.perform(get("/api/payments/count/userID=" + userID))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.paymentsCount").value(paymentCount));
		
		verify(paymentService, times(1)).getPaymentsCount(anyLong());
	}
	
	
	/**
	 * Test metody pro získání plateb uživatele
	 * 
	 * @throws Exception
	 */
	@Test
	@WithMockUser(authorities = {"user"})
	public void getPayments() throws Exception {
		
		List<Payment> payments = new ArrayList<>();
		
		// Vytvoření testovací platby
		Payment payment = new Payment();
		payment.setId(random.nextLong());
		payment.setUserID(random.nextLong());
		payment.setName("name");
		payment.setMark("+");
		payment.setAmount(new BigDecimal(random.nextDouble()));
		payment.setCurrency(Currency.getInstance("CZK"));
		payment.setVariableSymbol(random.nextLong());
		payment.setConstantSymbol(random.nextLong());
		payment.setSpecificSymbol(random.nextLong());
		payment.setPaymentDate(localDate);
		payment.setPaymentType("payment type");
		payment.setAccountNumber("1234567890/0000");
		payments.add(payment);
		
		when(paymentService.getPaymentsByUserID(anyLong(), any(LocalDate.class), any(LocalDate.class))).thenReturn(payments);
		
		// URL parametry
		long userID = random.nextLong();
		int month = localDate.getMonthValue();
		int year = localDate.getYear();
		
		// Porovnání výstupních hodnot
		mockMvc.perform(get("/api/payments/month/userID=" + userID + "&month=" + month + "&year=" + year))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.length()").value(payments.size()))
			.andExpect(jsonPath("$[0].id").value(payment.getId()))
			.andExpect(jsonPath("$[0].userID").value(payment.getUserID()))
			.andExpect(jsonPath("$[0].name").value(payment.getName()))
			.andExpect(jsonPath("$[0].mark").value(payment.getMark()))
			.andExpect(jsonPath("$[0].amount").value(payment.getAmount()))
			.andExpect(jsonPath("$[0].currency").value(payment.getCurrency().toString()))
			.andExpect(jsonPath("$[0].variableSymbol").value(payment.getVariableSymbol()))
			.andExpect(jsonPath("$[0].constantSymbol").value(payment.getConstantSymbol()))
			.andExpect(jsonPath("$[0].specificSymbol").value(payment.getSpecificSymbol()))
			.andExpect(jsonPath("$[0].paymentDate").value(payment.getPaymentDate().toString()))
			.andExpect(jsonPath("$[0].paymentType").value(payment.getPaymentType()))
			.andExpect(jsonPath("$[0].accountNumber").value(payment.getAccountNumber()));
		
		verify(paymentService, times(2)).getPaymentsByUserID(anyLong(), any(LocalDate.class), any(LocalDate.class));
	}
	
	
	/**
	 * Test metody pro získání příjmů a výdajů
	 * 
	 * @throws Exception
	 */
	@Test
	@WithMockUser(authorities = {"user"})
	public void getMonnthSum() throws Exception {
		
		// Testovací data
		BigDecimal income = new BigDecimal(random.nextDouble());
		BigDecimal costs = new BigDecimal(random.nextDouble());
		BigDecimal balance = new BigDecimal(income.doubleValue() - costs.doubleValue());
		
		when(paymentService.getPaymentsSum(anyLong(), eq("+"), any(LocalDate.class), any(LocalDate.class))).thenReturn(income);
		when(paymentService.getPaymentsSum(anyLong(), eq("-"), any(LocalDate.class), any(LocalDate.class))).thenReturn(costs);
		
		// URL parametry
		long userID = random.nextLong();
		int month = localDate.getMonthValue();
		int year = localDate.getYear();
		
		// Porovnání výstupních hodnot
		mockMvc.perform(get("/api/payments/sum/month/userID=" + userID + "&month=" + month + "&year=" + year))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.length()").value(3))
			.andExpect(jsonPath("$.income").value(income))
			.andExpect(jsonPath("$.costs").value(costs))
			.andExpect(jsonPath("$.balance").value(balance));
		
		verify(paymentService, times(2)).getPaymentsSum(anyLong(), anyString(), any(LocalDate.class), any(LocalDate.class));
	}
	
	
	/**
	 * Test metody pro získání příjmů a výdajů za 3 měsíce
	 * 
	 * @throws Exception
	 */
	@Test
	@WithMockUser(authorities = {"user"})
	public void getMonthsSum() throws Exception {
		
		// Testovací data
		BigDecimal income = new BigDecimal(random.nextDouble());
		BigDecimal costs = new BigDecimal(random.nextDouble());
		
		when(paymentService.getPaymentsSum(anyLong(), eq("+"), any(LocalDate.class), any(LocalDate.class))).thenReturn(income);
		when(paymentService.getPaymentsSum(anyLong(), eq("-"), any(LocalDate.class), any(LocalDate.class))).thenReturn(costs);
		
		// ID uživatele
		long userID = random.nextLong();
		
		// Porovnání výstupních hodnot
		mockMvc.perform(get("/api/payments/sum/graphs/userID=" + userID))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.length()").value(3))
			.andExpect(jsonPath("$[0].income").value(income))
			.andExpect(jsonPath("$[0].costs").value(costs));
		
		verify(paymentService, times(6)).getPaymentsSum(anyLong(), anyString(), any(LocalDate.class), any(LocalDate.class));
	}
	
}
