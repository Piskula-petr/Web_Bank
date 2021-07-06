package cz.web_bank.configuration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;

@Configuration
@PropertySource("classpath:application.properties")
public class JwtConfiguration {

	@Autowired
	private Environment environment;
	
	@Bean
	public String getSecretKey() {
		return environment.getProperty("jwt.secretKey");
	}
	
}
