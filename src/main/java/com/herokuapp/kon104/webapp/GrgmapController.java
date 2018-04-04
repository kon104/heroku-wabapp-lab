package com.herokuapp.kon104.webapp;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
/**
 * Garage Map
 *
 */
@Controller
public class GrgmapController
{

	private String gmapApiKey = "AIzaSyBCYBPbwRyLV_urAoagNVlNn2T3BHspQW4";

	@RequestMapping("/grgmap")
	public String index(Model model)
	{
		model.addAttribute("gmapApiKey", gmapApiKey);

		return "grgmap";
	}
}
