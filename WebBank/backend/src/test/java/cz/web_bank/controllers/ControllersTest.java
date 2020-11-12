package cz.web_bank.controllers;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class ControllersTest {

	@Autowired
	private LoginPageController loginPageController;
	
	@Autowired
	private NewPaymentController newPaymentController;
	
	@Autowired
	private OverviewPageController overviewPageController;
	
	@Test
	void contextLoads() throws Exception {
		
		assertThat(loginPageController).isNotNull();
		assertThat(newPaymentController).isNotNull();
		assertThat(overviewPageController).isNotNull();
	}

}
