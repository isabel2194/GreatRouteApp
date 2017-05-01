package com.greatRoute.services;

import java.util.List;

import com.greatRoute.entity.Ruta;
import com.greatRoute.model.RutaModel;
import com.greatRoute.model.UserModel;

public interface RutaService {
	
	public abstract List<RutaModel> allRoutes(UserModel user);
	
	public abstract boolean procesarRuta(String jsonResponse,UserModel user);
	
	public abstract boolean guardarRuta(Ruta ruta);
	
	void borrarRuta(String id);
	
	RutaModel obtenerRuta(int rutaId,UserModel user);

	String obtenerRecorrido(String path);

}
