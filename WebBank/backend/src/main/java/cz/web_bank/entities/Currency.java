package cz.web_bank.entities;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity(name = "currencies")
public class Currency {

	@Id
	@GeneratedValue()
	@Column(name = "id")
	private Long id;
	
	@Column(name = "state")
	private String state;
	
	@Column(name = "code", length = 3)
	private String code;
	
// Bezparametrový konstruktor ////////////////////////////////////////////////////////////////////
	
	public Currency() {
		
	}
	
// Gettery + Settery /////////////////////////////////////////////////////////////////////////////
	
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}
	
}
