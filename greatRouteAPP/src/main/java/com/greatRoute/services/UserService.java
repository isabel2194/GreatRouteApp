package com.greatRoute.services;

import com.greatRoute.model.UserModel;

public interface UserService {

	public boolean comprobarCredenciales(UserModel actualUser);
	public boolean registrarUsuario(UserModel userModel);
	UserModel findByUsername(String username);
	String compruebaCampos(String password1, String password2, String username, String email);
	
}