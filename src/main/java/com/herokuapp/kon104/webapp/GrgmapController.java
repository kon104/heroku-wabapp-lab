package com.herokuapp.kon104.webapp;

//	import org.springframework.beans.factory.annotation.Autowired;;
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

//	@Autowired
//	ApplicationFormsService service;

	@RequestMapping("/grgmap")
	public String index(Model model)
	{
//		model.addAttribute("appforms", service.getAppForms());
		model.addAttribute("lat", 35.47131841901187);
		model.addAttribute("lng", 139.4283853703149);
		model.addAttribute("gmapApiKey", gmapApiKey);

		return "grgmap";
	}
}
