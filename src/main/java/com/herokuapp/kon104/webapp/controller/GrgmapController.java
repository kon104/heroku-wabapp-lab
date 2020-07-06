package com.herokuapp.kon104.webapp.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
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
	private String gmapApiKey = "AIzaSyBCYBPbwRyLV_urAoagNVlNn2T3BHspQW4";
//	private String gmapApiKey = "AIzaSyCErcdJQ5Pc1jP5pKhaKsBMruAM0GE8tnI";

	// {{{ public String index(Model model)
	@GetMapping("/")
	public String index(Model model)
	{
		model.addAttribute("gmapApiKey", gmapApiKey);

		return "grgmap/index";
	}
	// }}}

}
