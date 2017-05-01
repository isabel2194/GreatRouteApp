package com.greatRoute.converter;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.greatRoute.entity.User;
import com.greatRoute.model.UserModel;

@Component("userConverter")
public class UserConverter {
	
	@Autowired
	ModelMapper modelMapper;

	// Entity --> Model
	public UserModel entityToModel(User user) {
		return modelMapper.map(user, UserModel.class);
	}

	// Model --> Entity
	public User modelToEntity(UserModel userModel) {
		return modelMapper.map(userModel, User.class);
	}
}
