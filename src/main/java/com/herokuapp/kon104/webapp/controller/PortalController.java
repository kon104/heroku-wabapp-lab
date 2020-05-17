package com.herokuapp.kon104.webapp.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
/**
 * Portal Controller
 *
 */
@Controller
public class PortalController
{
    @RequestMapping("/")
    public String index()
    {
        return "portal/index";
    }
}
