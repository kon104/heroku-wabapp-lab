package com.herokuapp.kon104.webapp;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
/**
 * Garage Map
 *
 */
@Controller
public class GrgmapController
{
    @RequestMapping("/grgmap")
    public String index()
    {
        return "grgmap";
    }
}
