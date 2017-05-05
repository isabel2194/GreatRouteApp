package com.greatRoute.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import com.greatRoute.entity.User;
import com.greatRoute.model.RutaModel;
import com.greatRoute.model.UserModel;
import com.greatRoute.services.RutaService;
import com.greatRoute.services.UserService;


@Controller
public class HomeController {

	private static String DEFAULT_LAYOUT = "default";
	private static String DEFAULT_VIEW_ATTRIBUTE_NAME = "view";

	@Autowired
	@Qualifier("userServiceImpl")
	private UserService userService;

	@Autowired
	@Qualifier("rutaServiceImpl")
	private RutaService rutaService;

	UserModel usuarioActivo;

	@GetMapping({ "/index", "/" })
	public ModelAndView home(@RequestParam(value = "rutaId", required = false) String rutaId) {
		ModelAndView mav = new ModelAndView(DEFAULT_LAYOUT);
		UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		usuarioActivo = userService.findByUsername(userDetails.getUsername());
		if (rutaId != null) {
			RutaModel ruta = rutaService.obtenerRuta(Integer.valueOf(rutaId), usuarioActivo);

			mav.addObject("distancia", ruta.getDistancia());
			mav.addObject("origen", ruta.getOrigen());
			mav.addObject("destino", ruta.getDestino());
			mav.addObject("rutaResponse", rutaService.obtenerRecorrido(ruta.getRecorrido()));
			mav.addObject("rutaID", rutaId);
		}
		mav.addObject("username", usuarioActivo.getUsername());
		mav.addObject(DEFAULT_VIEW_ATTRIBUTE_NAME, "mapa");
		return mav;
	}

	@GetMapping("/public/login")
	public ModelAndView login(@RequestParam(name = "error", required = false) String error,
			@RequestParam(name = "logout", required = false) String logout) {
		ModelAndView mav = new ModelAndView(DEFAULT_LAYOUT);
		mav.addObject(DEFAULT_VIEW_ATTRIBUTE_NAME, "login");
		mav.addObject("error", error);
		mav.addObject("logout", logout);
		return mav;
	}

	@GetMapping("/public/registro")
	public ModelAndView registro(@RequestParam(name = "error", required = false) String error) {
		ModelAndView mav = new ModelAndView(DEFAULT_LAYOUT);
		mav.addObject(DEFAULT_VIEW_ATTRIBUTE_NAME, "registro");
		mav.addObject("user", new UserModel());
		mav.addObject("error", error);
		return mav;
	}

	@GetMapping("/public/contacto")
	public ModelAndView contacto() {
		ModelAndView mav = new ModelAndView(DEFAULT_LAYOUT);
		mav.addObject(DEFAULT_VIEW_ATTRIBUTE_NAME, "contacto");
		return mav;
	}

	@PostMapping("/public/addUser")
	public String addUser(@ModelAttribute("user") UserModel user,
			@RequestParam(name = "password2", required = true) String password2) {
		String resultado = userService.compruebaCampos(user.getPassword(), password2, user.getUsername(),
				user.getEmail());
		if (resultado.equals("EXITO"))
			userService.registrarUsuario(user);
		else
			return "redirect:/public/registro?error=" + resultado;
		return "redirect:/public/login";
	}

	@GetMapping({ "/loginsuccess" })
	public String loguear(@ModelAttribute("user") User user) {
		return "redirect:/index";
	}

	@GetMapping("/logout")
	public String logout(Model model) {
		model.addAttribute("user", null);
		usuarioActivo = null;
		return "redirect:/public/login";
	}

}
