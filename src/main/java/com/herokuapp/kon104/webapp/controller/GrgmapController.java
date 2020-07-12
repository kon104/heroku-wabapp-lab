package com.herokuapp.kon104.webapp.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Garage Map
 *
 */
@Controller
@RequestMapping("/grgmap")
public class GrgmapController
{

	// {{{ public String index(Model model)
	@GetMapping("/")
	public String index()
	{
		return "grgmap/index";
	}
	// }}}

}
