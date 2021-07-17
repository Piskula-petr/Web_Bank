package cz.web_bank.jwt;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

public class JwtVerifierFilter extends OncePerRequestFilter {

	private String secretKey;
	
	
	/**
	 * Konstruktor 
	 * 
	 * @param secretKey - tajný klíč JWT
	 */
	public JwtVerifierFilter(String secretKey) {
		this.secretKey = secretKey;
	}
	
	
	/**
	 * Filtr ověřující JWT
	 */
	@Override
	protected void doFilterInternal(HttpServletRequest request, 
									HttpServletResponse response, 
									FilterChain filterChain) throws ServletException, IOException {
		
		String authorizationHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
		
		// Volání dalšího filtru, při nenalezení tokenu
		if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
			
			filterChain.doFilter(request, response);
			return;
		}
		
		String token = authorizationHeader.replace("Bearer ", "");
		
		try {
			
			// Validace JWT
			Jws<Claims> claimsJws = Jwts.parserBuilder()
				.setSigningKey(Keys.hmacShaKeyFor(secretKey.getBytes()))
				.build()
				.parseClaimsJws(token);
			
			String username = claimsJws.getBody().getSubject();
			List<SimpleGrantedAuthority> authorities = new ArrayList<>();
			
			for (Map<String, String> map : (List<Map<String, String>>) claimsJws.getBody().get("authorities")) {
				
				authorities.add(new SimpleGrantedAuthority(map.get("authority")));
			}
			
			Authentication authentication = new UsernamePasswordAuthenticationToken(
				username, null, authorities
			);
			
			// Ověření uživatele
			SecurityContextHolder.getContext().setAuthentication(authentication);
			
		} catch (JwtException e) {
			throw new JwtException("Token " + token + " is invalid or expired.");
		}
		
		// Volání dalšího filtru
		filterChain.doFilter(request, response);
	}
	
}
