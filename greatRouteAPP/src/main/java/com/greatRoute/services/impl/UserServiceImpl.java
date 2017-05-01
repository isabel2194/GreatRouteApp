package com.greatRoute.services.impl;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.greatRoute.converter.UserConverter;
import com.greatRoute.entity.User;
import com.greatRoute.entity.UserRole;
import com.greatRoute.model.UserModel;
import com.greatRoute.repository.UserRepository;
import com.greatRoute.services.UserService;

@Service("userServiceImpl")
public class UserServiceImpl implements UserService, UserDetailsService {
	
	@Autowired
	@Qualifier("userRepository")
	private UserRepository userRepository;
	
	@Autowired
	@Qualifier("userConverter")
	private UserConverter converter;

	@Override
	public boolean comprobarCredenciales(UserModel actualUser) {
		User user=converter.modelToEntity(actualUser);
		if(userRepository.findByUsernameAndPassword(user.getUsername(), user.getPassword())!=null)
			return true;
		return false;
	}
	
	@Override
	public UserModel findByUsername(String username){
		User user=userRepository.findByUsername(username);
		if(user!=null)
			return converter.entityToModel(user);
		return null;
	}

	@Override
	public boolean registrarUsuario(UserModel userModel) {
		User user= converter.modelToEntity(userModel);
		user.setEnabled(true);
		Set<UserRole> roles=new HashSet<UserRole>();
		roles.add(new UserRole(user,"USUARIO"));
		user.setUserRole(roles);
		BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
		user.setPassword(encoder.encode(user.getPassword()));
		if(userRepository.save(user)!=null)
			return true;
		return false;
	}
	
	@Override
	public String compruebaCampos(String password1,String password2, String username, String email){
		if(userRepository.findByUsernameAndEmail(username,email)!=null)
			return "El usuario ya esta registrado";
		if(!password1.equals(password2))
			return "Las contraseñas no coinciden";
		if(findByUsername(username)!=null)
			return "El username ya existe";
		return "EXITO";
	}

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		User user = userRepository.findByUsername(username);
		return buildUser(user,buildAuthorities(user.getUserRole()));
	}
	
	private org.springframework.security.core.userdetails.User buildUser(User user, List<GrantedAuthority> authorities){
		return new org.springframework.security.core.userdetails.User(user.getUsername(),user.getPassword(),user.isEnabled(),true,true,true,authorities);
	}
	
	private List<GrantedAuthority> buildAuthorities(Set<UserRole> userRole){
		Set<GrantedAuthority> auths = new HashSet<GrantedAuthority>();
		for(UserRole role:userRole){
			auths.add(new SimpleGrantedAuthority(role.getRole()));
		}
		return new ArrayList<GrantedAuthority>(auths);
	}

}
