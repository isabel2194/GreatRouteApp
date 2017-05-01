package com.greatRoute.model;

import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author Isabel
 */
public class UserModel {
    
    private int id;
    
    private String username;
    private String password;
    private String email;
    private List<RutaModel> rutas= new ArrayList<RutaModel>();
    
    public UserModel(){}

    public UserModel(String username, String password, String email,List<RutaModel> rutas) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.rutas=rutas;
    }
    
    public UserModel(String username, String password, String email) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.rutas=new ArrayList<RutaModel>();
    }
        
     public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }
     
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

	public List<RutaModel> getRutas() {
		return rutas;
	}

	public void setRutas(List<RutaModel> rutas) {
		this.rutas = rutas;
	}   
    
}
