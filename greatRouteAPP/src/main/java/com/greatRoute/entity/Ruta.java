package com.greatRoute.entity;


import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name="Ruta")
public class Ruta{
	

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="Id")
	private int id;
	
	@Column(name="recorrido", nullable=false)
	private String recorrido;
	
	@Column(name="distancia", nullable=false)
	private double distancia;
	
	@ManyToOne
	@JoinColumn(name="username",nullable=false)
	private User user;
	
	@Column(name="origen",nullable=false)
	private String origen;
	
	@Column(name="destino",nullable=false)
	private String destino;
	
	@Column(name="tiempoEstimado",nullable=false)
	private int tiempoEstimado;
	
	public Ruta(){}

	public Ruta(int id, String recorrido, double distancia, User user, String origen, String destino,
			int tiempoEstimado) {
		super();
		this.id = id;
		this.recorrido = recorrido;
		this.distancia = distancia;
		this.user = user;
		this.origen = origen;
		this.destino = destino;
		this.tiempoEstimado = tiempoEstimado;
	}

	public Ruta(String recorrido, double distancia, User user, String origen, String destino, int tiempoEstimado) {
		super();
		this.recorrido = recorrido;
		this.distancia = distancia;
		this.user = user;
		this.origen = origen;
		this.destino = destino;
		this.tiempoEstimado = tiempoEstimado;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
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

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
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

	public int getTiempoEstimado() {
		return tiempoEstimado;
	}

	public void setTiempoEstimado(int tiempoEstimado) {
		this.tiempoEstimado = tiempoEstimado;
	}


}
