package cz.web_bank.controllers;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
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
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.security.test.context.support.WithUserDetails;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;

import cz.web_bank.ApplicationMain;
import cz.web_bank.pojo.LoginData;
import cz.web_bank.services.UserService;

@WebMvcTest(LoginPageController.class)
public class LoginPageControllerTest {

	private Random random;
	
	private LoginData loginData;
	
	@Autowired
	private MockMvc mockMvc;
	
	@MockBean
	private AuthenticationManager authenticationManager;
	
	@MockBean
	private UserService userService;
	
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
		
		// Nastavení testovacího uživatele
		loginData.setClientNumber(1234567890L);
		loginData.setPassword("password");
		
		Authentication authentication = new UsernamePasswordAuthenticationToken(
			loginData.getClientNumber(), loginData.getPassword()
		);
		
		when(authenticationManager.authenticate(any(Authentication.class))).thenReturn(authentication);
		
		// ID uživatele
		Long userID = random.nextLong();
		
		when(userService.getUserIDByClientNumber(anyLong())).thenReturn(userID);
		
		// Porovnání výstupních hodnot
		mockMvc.perform(post("/api/login")
			.contentType(MediaType.APPLICATION_JSON)
			.content(new ObjectMapper().writeValueAsString(loginData)))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.token").isString())
			.andExpect(jsonPath("$.expireTime").exists())
			.andExpect(jsonPath("$.userID").value(userID))
			.andExpect(jsonPath("$.timestamp").exists());
		
		verify(authenticationManager, times(1)).authenticate(any(Authentication.class));
		verify(userService, times(1)).getUserIDByClientNumber(anyLong());
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
			.andExpect(status().isForbidden())
			.andExpect(jsonPath("$.clientNumber").value("Klientské číslo nesmí být prázdné"))
			.andExpect(jsonPath("$.password").value("Heslo nesmí být prázdné"))
			.andExpect(jsonPath("$.timestamp").exists());
			
		verify(authenticationManager, times(0)).authenticate(any(Authentication.class));
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
			.andExpect(status().isForbidden())
			.andExpect(jsonPath("$.clientNumber").value("Klientské číslo musí mýt 10 znaků"))
			.andExpect(jsonPath("$.password").value("Heslo nesmí být prázdné"))
			.andExpect(jsonPath("$.timestamp").exists());
	
		verify(authenticationManager, times(0)).authenticate(any(Authentication.class));
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
			.andExpect(status().isForbidden())
			.andExpect(jsonPath("$.clientNumber").value("Klientské číslo musí mýt 10 znaků"))
			.andExpect(jsonPath("$.password").doesNotExist())
			.andExpect(jsonPath("$.timestamp").exists());
		
		verify(authenticationManager, times(0)).authenticate(any(Authentication.class));
	}
	
}
