package com.greatRoute.converter;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.greatRoute.entity.Ruta;
import com.greatRoute.model.RutaModel;

@Component("rutaConverter")
public class RutaConverter {
	
	@Autowired
	ModelMapper modelMapper;

	// Entity --> Model
	public RutaModel entityToModel(Ruta ruta) {
		return modelMapper.map(ruta,RutaModel.class);
	}

	// Model --> Entity
	public Ruta modelToEntity(RutaModel rutaModel) {
		return modelMapper.map(rutaModel, Ruta.class);
	}
}
