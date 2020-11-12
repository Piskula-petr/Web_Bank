package cz.web_bank.controllers;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
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
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;

import cz.web_bank.entities.CreditCard;
import cz.web_bank.entities.Payment;
import cz.web_bank.entities.User;
import cz.web_bank.pojo.SelectedTerm;
import cz.web_bank.services.CreditCardService;
import cz.web_bank.services.PaymentService;
import cz.web_bank.services.UserService;

@WebMvcTest
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
	public void getUser() throws Exception {
		
		// Testovací uživatel
		User user = new User();
		user.setId(random.nextLong());
		user.setName("name");
		user.setSurname("surname");
		user.setEmail("email@email.com");
		user.setClientNumber(1234567890L);
		user.setPassword("password");
		user.setBalance(new BigDecimal(random.nextLong()));
		user.setCurrency(Currency.getInstance("CZK"));
		user.setAccountNumber("1234567890/0000");
		
		when(userService.getUserByID(anyLong())).thenReturn(user);
		
		// ID uživatele
		long userID = random.nextLong();
		
		// Porovnání výstupních hodnot
		mockMvc.perform(post("/api/user")
			.contentType(MediaType.APPLICATION_JSON)
			.content(new ObjectMapper().writeValueAsString(userID)))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.id").value(user.getId()))
			.andExpect(jsonPath("$.name").value(user.getName()))
			.andExpect(jsonPath("$.surname").value(user.getSurname()))
			.andExpect(jsonPath("$.email").value(user.getEmail()))
			.andExpect(jsonPath("$.clientNumber").value(user.getClientNumber()))
			.andExpect(jsonPath("$.password").value(user.getPassword()))
			.andExpect(jsonPath("$.balance").value(user.getBalance()))
			.andExpect(jsonPath("$.currency").value(user.getCurrency().toString()))
			.andExpect(jsonPath("$.accountNumber").value(user.getAccountNumber()));
		
		verify(userService, times(1)).getUserByID(anyLong());
	}
	
	
	/**
	 * Test metody pro získání kreditní karty
	 * 
	 * @throws Exception
	 */
	@Test
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
		mockMvc.perform(post("/api/credit-card")
			.contentType(MediaType.APPLICATION_JSON)
			.content(new ObjectMapper().writeValueAsString(userID)))
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
	public void getPaymentCount() throws Exception {
		
		// Počet plateb
		long paymentCount = random.nextLong();
		
		when(paymentService.getPaymentsCount(anyLong())).thenReturn(paymentCount);
		
		// ID uživatele
		long userID = random.nextLong();
		
		mockMvc.perform(post("/api/payments/count")
			.contentType(MediaType.APPLICATION_JSON)
			.content(new ObjectMapper().writeValueAsString(userID)))
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
		
		// Zvolené období
		SelectedTerm selectedTerm = getSelectedTerm();
		
		// Porovnání výstupních hodnot
		mockMvc.perform(post("/api/payments/month")
			.contentType(MediaType.APPLICATION_JSON)
			.content(new ObjectMapper().writeValueAsString(selectedTerm)))
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
	public void getMonnthSum() throws Exception {
		
		// Testovací data
		BigDecimal income = new BigDecimal(random.nextDouble());
		BigDecimal costs = new BigDecimal(random.nextDouble());
		BigDecimal balance = new BigDecimal(income.doubleValue() - costs.doubleValue());
		
		when(paymentService.getPaymentsSum(anyLong(), eq("+"), any(LocalDate.class), any(LocalDate.class))).thenReturn(income);
		when(paymentService.getPaymentsSum(anyLong(), eq("-"), any(LocalDate.class), any(LocalDate.class))).thenReturn(costs);
		
		// Zvolené období
		SelectedTerm selectedTerm = getSelectedTerm();
		
		// Porovnání výstupních hodnot
		mockMvc.perform(post("/api/payments/sum/month")
			.contentType(MediaType.APPLICATION_JSON)
			.content(new ObjectMapper().writeValueAsString(selectedTerm)))
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
	public void getMonthsSum() throws Exception {
		
		// Testovací data
		BigDecimal income = new BigDecimal(random.nextDouble());
		BigDecimal costs = new BigDecimal(random.nextDouble());
		
		when(paymentService.getPaymentsSum(anyLong(), eq("+"), any(LocalDate.class), any(LocalDate.class))).thenReturn(income);
		when(paymentService.getPaymentsSum(anyLong(), eq("-"), any(LocalDate.class), any(LocalDate.class))).thenReturn(costs);
		
		// ID uživatele
		long userID = random.nextLong();
		
		// Porovnání výstupních hodnot
		mockMvc.perform(post("/api/payments/sum/graphs")
			.contentType(MediaType.APPLICATION_JSON)
			.content(new ObjectMapper().writeValueAsString(userID)))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.length()").value(3))
			.andExpect(jsonPath("$[0].income").value(income))
			.andExpect(jsonPath("$[0].costs").value(costs));
		
		verify(paymentService, times(6)).getPaymentsSum(anyLong(), anyString(), any(LocalDate.class), any(LocalDate.class));
	}
	
	
	/**
	 * Vytvoření testovacího objektu
	 * 
	 * @return - vrací testovací objekt
	 */
	private SelectedTerm getSelectedTerm() {
		
		SelectedTerm selectedTerm = new SelectedTerm();
		selectedTerm.setUserID(random.nextLong());
		selectedTerm.setMonth(localDate.getMonthValue());
		selectedTerm.setYear(localDate.getYear());
		
		return selectedTerm;
	}
	
}
