package cz.web_bank.controllers;

import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Random;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;

import cz.web_bank.pojo.LoginData;
import cz.web_bank.services.UserService;

@WebMvcTest
public class LoginPageControllerTest {

	private Random random;
	
	private LoginData loginData;
	
	@Autowired
	private MockMvc mockMvc;
	
	@MockBean
	private UserService userService;
	
	
	/**
	 * Inicializace parametrů
	 * 
	 * @throws Exception
	 */
	@BeforeEach
	public void setUp() throws Exception {

		random = new Random();
		
		loginData = new LoginData();
	}
	
	
	/**
	 * Test metody pro ověření přihlašovacích údajů 
	 * (úspěšné přihlášení)
	 * 
	 * @throws Exception
	 */
	@Test
	public void loginSuccess() throws Exception {
		
		// ID uživatele
		Long userID = random.nextLong();
		
		when(userService.getUserIDByLoginData(anyLong(), anyString())).thenReturn(userID);
		
		// Přihlašovací data
		loginData.setClientNumber(1234567890L);
		loginData.setPassword("password");
		
		// Porovnání výstupních hodnot
		mockMvc.perform(post("/api/login")
			.contentType(MediaType.APPLICATION_JSON)
			.content(new ObjectMapper().writeValueAsString(loginData)))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.userID").value(userID))
			.andExpect(jsonPath("$.timestamp").exists());
		
		verify(userService, times(1)).getUserIDByLoginData(anyLong(), anyString());
	}
	
	
	/**
	 * Test metody pro ověření přihlašovacích údajů 
	 * (neúspěšné přihlášení)
	 * 
	 * @throws Exception
	 */
	@Test
	public void loginFailed() throws Exception {
		
		when(userService.getUserIDByLoginData(anyLong(), anyString())).thenReturn(null);
		
		// Přihlašovací data
		loginData.setClientNumber(1234567890L);
		loginData.setPassword("password");
		
		// Porovnání výstupních hodnot
		mockMvc.perform(post("/api/login")
			.contentType(MediaType.APPLICATION_JSON)
			.content(new ObjectMapper().writeValueAsString(loginData)))
			.andExpect(status().isBadRequest())
			.andExpect(jsonPath("$.clientNumber").value("Přihlašovací údaje jsou nesprávné"))
			.andExpect(jsonPath("$.timestamp").exists());
		
		verify(userService, times(1)).getUserIDByLoginData(anyLong(), anyString());
	}
	
	
	/**
	 * Test metody pro ověření přihlašovacích údajů 
	 * (neuvedené klientské číslo ani heslo)
	 * 
	 * @throws Exception
	 */
	@Test
	public void loginInvalidNoClientNumberNoPassword() throws Exception {
		
		// Porovnání výstupních hodnot
		mockMvc.perform(post("/api/login")
			.contentType(MediaType.APPLICATION_JSON)
			.content(new ObjectMapper().writeValueAsString(loginData)))
			.andExpect(status().isBadRequest())
			.andExpect(jsonPath("$.clientNumber").value("Klientské číslo nesmí být prázdné"))
			.andExpect(jsonPath("$.password").value("Heslo nesmí být prázdné"));
			
		verify(userService, times(0)).getUserIDByLoginData(anyLong(), anyString());
	}
	
	
	/**
	 * Test metody pro ověření přihlašovacích údajů 
	 * (příliš krátké klientské číslo a neuvedené heslo)
	 * 
	 * @throws Exception
	 */
	@Test
	public void loginInvalidShortClientNumberNoPassword() throws Exception {
		
		loginData.setClientNumber(12345L);
		
		// Porovnání výstupních hodnot
		mockMvc.perform(post("/api/login")
			.contentType(MediaType.APPLICATION_JSON)
			.content(new ObjectMapper().writeValueAsString(loginData)))
			.andExpect(status().isBadRequest())
			.andExpect(jsonPath("$.clientNumber").value("Klientské číslo musí mýt 10 znaků"))
			.andExpect(jsonPath("$.password").value("Heslo nesmí být prázdné"));
	
		verify(userService, times(0)).getUserIDByLoginData(anyLong(), anyString());
	}
	
	
	/**
	 * Test metody pro ověření přihlašovacích údajů 
	 * (příliš dlouhé klientské číslo)
	 * 
	 * @throws Exception
	 */
	@Test
	public void loginInvalidLongClientNumber() throws Exception {
		
		loginData.setClientNumber(112233445566778899L);
		loginData.setPassword("password");
		
		// Porovnání výstupních hodnot
		mockMvc.perform(post("/api/login")
			.contentType(MediaType.APPLICATION_JSON)
			.content(new ObjectMapper().writeValueAsString(loginData)))
			.andExpect(status().isBadRequest())
			.andExpect(jsonPath("$.clientNumber").value("Klientské číslo musí mýt 10 znaků"))
			.andExpect(jsonPath("$.password").doesNotExist());
		
		verify(userService, times(0)).getUserIDByLoginData(anyLong(), anyString());
	}
	
}
