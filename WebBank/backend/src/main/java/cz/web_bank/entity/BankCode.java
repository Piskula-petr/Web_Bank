package cz.web_bank.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity(name = "bank_codes")
public class BankCode {
	
	@Id
	@GeneratedValue()
	@Column(name = "id")
	private Long id;
	
	@Column(name = "code", length = 4)
	private String code;
	
	@Column(name = "name")
	private String name;
	
// Konstruktor /////////////////////////////////////////////////////////////////////////////////////

	public BankCode() {
	
	}
	
// Gettery + Settery ///////////////////////////////////////////////////////////////////////////////

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}
	
	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
	
}
