package com.greatRoute.repository;

import java.io.Serializable;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.greatRoute.entity.Ruta;
import com.greatRoute.entity.User;

@Repository("rutaRepository")
public interface RutaRepository extends JpaRepository<Ruta, Serializable>{

	@Query("SELECT rutas FROM Ruta rutas WHERE rutas.user=(:username)")
	public List<Ruta> findByUsername(@Param("username")User username);
	
	public Ruta findById(int id);
	
	public Ruta findByIdAndUser(int id, User user);

}
