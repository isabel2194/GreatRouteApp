package com.greatRoute.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import com.greatRoute.model.RutaModel;
import com.greatRoute.model.UserModel;
import com.greatRoute.services.RutaService;
import com.greatRoute.services.UserService;

@Controller
public class RutaController {

	private static String DEFAULT_LAYOUT = "default";
	private static String DEFAULT_VIEW_ATTRIBUTE_NAME = "view";

	@Autowired
	@Qualifier("userServiceImpl")
	private UserService userService;

	@Autowired
	@Qualifier("rutaServiceImpl")
	private RutaService rutaService;
	
	private UserModel usuarioActivo;

	@PostMapping(path="/guardarRuta", consumes="application/json")
	public String addRuta(@RequestBody String jsonResponse) {
		UserDetails userDetails=(UserDetails)SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		usuarioActivo = userService.findByUsername(userDetails.getUsername());
		rutaService.procesarRuta(jsonResponse,usuarioActivo);
		return "redirect:/index";
	}
	
	@GetMapping("/misRutas")
	public ModelAndView misRutas() {
		UserDetails userDetails=(UserDetails)SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		usuarioActivo = userService.findByUsername(userDetails.getUsername());
		List<RutaModel> rutas= rutaService.allRoutes(usuarioActivo);
		ModelAndView mav = new ModelAndView();
		mav.setViewName(DEFAULT_LAYOUT);
		mav.addObject(DEFAULT_VIEW_ATTRIBUTE_NAME, "misRutas");
		mav.addObject("rutas", rutas);
		return mav;
	}
	
	@PostMapping("/borrarRuta")
	public String deleteRuta(@RequestParam("rutaId") String id) {
		rutaService.borrarRuta(id);
		return "redirect:/misRutas";
	}
	
	

}
