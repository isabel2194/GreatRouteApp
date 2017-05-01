package com.greatRoute.repository;

import java.io.Serializable;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.greatRoute.entity.User;

@Repository("userRepository")
public interface UserRepository extends JpaRepository<User, Serializable>{

	public abstract User findByUsername(String username);
	public abstract User findByUsernameAndPassword(String username, String password);
	public abstract User findByUsernameAndEmail(String username, String email);
	
}
