package com.greatRoute.model;


public class RutaModel {

	private int id;
	private String origen;
	private String destino;
	private String tiempoEstimado;
	private String recorrido;
	private double distancia;
	private UserModel user;
	
	public RutaModel(){}

	public RutaModel(int id, String origen, String destino, String tiempoEstimado, String recorrido, double distancia,
			UserModel user) {
		super();
		this.id = id;
		this.origen = origen;
		this.destino = destino;
		this.tiempoEstimado = tiempoEstimado;
		this.recorrido = recorrido;
		this.distancia = distancia;
		this.user = user;
	}

	public RutaModel(String origen, String destino, String tiempoEstimado, String recorrido, double distancia,
			UserModel user) {
		super();
		this.origen = origen;
		this.destino = destino;
		this.tiempoEstimado = tiempoEstimado;
		this.recorrido = recorrido;
		this.distancia = distancia;
		this.user = user;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getOrigen() {
		return origen;
	}

	public void setOrigen(String origen) {
		this.origen = origen;
	}

	public String getDestino() {
		return destino;
	}

	public void setDestino(String destino) {
		this.destino = destino;
	}

	public String getTiempoEstimado() {
		return tiempoEstimado;
	}

	public void setTiempoEstimado(String tiempoEstimado) {
		this.tiempoEstimado = tiempoEstimado;
	}

	public String getRecorrido() {
		return recorrido;
	}

	public void setRecorrido(String recorrido) {
		this.recorrido = recorrido;
	}

	public double getDistancia() {
		return distancia;
	}

	public void setDistancia(double distancia) {
		this.distancia = distancia;
	}

	public UserModel getUser() {
		return user;
	}

	public void setUser(UserModel user) {
		this.user = user;
	}

	
	

}
