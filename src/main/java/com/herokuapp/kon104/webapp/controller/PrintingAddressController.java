package com.herokuapp.kon104.webapp.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Printing Address Controller
 */
@Controller
@RequestMapping("/printaddr")
public class PrintingAddressController
{

    // {{{ public String index()
	@GetMapping("/")
    public String index()
    {
        return "printaddr/index";
    }
	// }}}

}
