package cz.web_bank.controllers;

import static java.lang.System.currentTimeMillis;

import java.util.ArrayList;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import cz.web_bank.pojo.LoginData;
import cz.web_bank.services.UserService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("api")
public class LoginPageController {

	@Autowired
	private String secretKey;
	
	@Autowired
	private AuthenticationManager authenticationManager;
	
	@Autowired
	private UserService userServise;
	
	
	/**
	 * 	Ověření přihlašovacích údajů
	 * 
	 * 	@param loginData - přihlašovací údaje
	 * 	@param result - BindingResult
	 * 
	 * 	@return - vrací JWT + ID uživatele
	 */
	@PostMapping("/login")
	public ResponseEntity<Object> login(@Valid @RequestBody LoginData loginData, BindingResult result) {
		
		HttpStatus status = HttpStatus.FORBIDDEN;
		Map<String, Object> body = new LinkedHashMap<>();
		
		// Chyba při validaci
		if (result.hasErrors()) {
			
			List<FieldError> errors = result.getFieldErrors();
			
			// Přidání chybových zpráv do odpovědi
			for (FieldError error : errors) {
				body.put(error.getField(), error.getDefaultMessage());
			}
			
		// Ověření přihlašovacích údajů
		} else {
			
			Authentication authentication = new UsernamePasswordAuthenticationToken(
				loginData.getClientNumber(), loginData.getPassword()
			);
			
			// Ověření přihlášení
			authentication = authenticationManager.authenticate(authentication);

			// Čas vypršení - 10 min 
			Date expireTime = new Date(currentTimeMillis() + 10 * 60 * 1000);
			
			// Vygenerování JWT
			String token = Jwts.builder()
				.setSubject(authentication.getName())
				.claim("authorities", authentication.getAuthorities())
				.setIssuedAt(new Date())
				.setExpiration(expireTime)
				.signWith(Keys.hmacShaKeyFor(secretKey.getBytes()))
				.compact();
			
			Long userID = userServise.getUserIDByClientNumber(loginData.getClientNumber());
			
			body.put("token", token);
			body.put("expireTime", expireTime);
			body.put("userID", userID);
			status = HttpStatus.OK;
		}
		
		body.put("timestamp", new Date());
		
		return new ResponseEntity<Object>(body, status);
	}
	
	
	/**
	 * Obnovení JWT
	 * 
	 * @param request - HttpServletRequest
	 * 
	 * @return - vrací nový JWT
	 */
	@GetMapping("/refresh")
	public ResponseEntity<Object> refreshToken(HttpServletRequest request) {
		
		HttpStatus status = HttpStatus.FORBIDDEN;
		Map<String, Object> body = new LinkedHashMap<>();
		
		String authorizationHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
		String oldToken = authorizationHeader.replace("Bearer ", "");
		
		try {
			
			// Validace tokenu
			Jws<Claims> claimsJws = Jwts.parserBuilder()
				.setSigningKey(Keys.hmacShaKeyFor(secretKey.getBytes()))
				.build()
				.parseClaimsJws(oldToken);
			
			String username = claimsJws.getBody().getSubject();
			List<GrantedAuthority> authorities = new ArrayList<>();
			
			for (Map<String, String> map : (List<Map<String, String>>) claimsJws.getBody().get("authorities")) {
				
				authorities.add(new SimpleGrantedAuthority(map.get("authority")));
			}
			
			// Čas vypršení - 10 min 
			Date expireTime = new Date(currentTimeMillis() + 10 * 60 * 1000);
			
			// Vygenerování nového JWT
			String newToken = Jwts.builder()
				.setSubject(username)
				.claim("authorities", authorities)
				.setIssuedAt(new Date())
				.setExpiration(expireTime)
				.signWith(Keys.hmacShaKeyFor(secretKey.getBytes()))
				.compact();
			
			body.put("token", newToken);
			body.put("expireTime", expireTime);
			status = HttpStatus.OK;
			
		} catch (JwtException e) {
			throw new JwtException("Token " + oldToken + " is invalid or expired.");
		}
		
		body.put("timestamp", new Date());
		
		return new ResponseEntity<Object>(body, status);
	}
	
}
