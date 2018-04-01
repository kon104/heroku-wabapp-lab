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

	@Value("${spring.thymeleaf.cache:}")
	private String springThymeleafCache;

	@Value("${spring.devtools.restart.enabled:}")
	private String springDevtoolsRestartEnabled;

	@Value("${server.port:}")
	private String serverPort;

	@RequestMapping("/grgmap")
	public String index(Model model)
	{
		model.addAttribute("stcache", springThymeleafCache);
		model.addAttribute("devrest", springDevtoolsRestartEnabled);
		model.addAttribute("sport", serverPort);
		model.addAttribute("message", "HelloThymeleaf!!");
		return "grgmap";
	}
}
