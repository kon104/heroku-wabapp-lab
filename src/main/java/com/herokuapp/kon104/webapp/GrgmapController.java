package com.herokuapp.kon104.webapp;

import java.io.File;
import java.io.IOException;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

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

//	@Autowired
//	ApplicationFormsService service;

	// {{{ public String index(Model model)
	@RequestMapping("/")
	public String index(Model model)
	{
		String tmpDir = System.getProperty("java.io.tmpdir");
		File tmpFile = null;
		String tmpPath = null;
		try {
			tmpFile = File.createTempFile("prefix", ".suffix");
			tmpPath = tmpFile.getPath();
		} catch(IOException e) {
			System.err.println(e.getMessage());
		} finally {
			if (tmpFile != null && tmpFile.exists()) {
				tmpFile.delete();
			}
		}
 
		model.addAttribute("tmpdir", tmpDir);
		model.addAttribute("tmppath", tmpPath);

//		model.addAttribute("appforms", service.getAppForms());
		model.addAttribute("lat", 35.47131841901187);
		model.addAttribute("lng", 139.4283853703149);
		model.addAttribute("gmapApiKey", gmapApiKey);

		return "grgmap/index";
	}
	// }}}

	// {{{ public String pdfeditor()
	@RequestMapping("/pdfeditor")
	@ResponseBody
	public String pdfeditor()
	{
		return "hello world!!";
	}
	// }}}

}
