package com.greatRoute.configuration;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;


@Configuration
@ComponentScan("com.greatRoute.controller")
public class WebMvcConfiguration extends WebMvcConfigurerAdapter {

	@Bean
	public ModelMapper modelMapper() {
	    return new ModelMapper();
	}
	
	
}
