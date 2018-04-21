package com.herokuapp.kon104.webapp;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
/**
 * Test Controller
 *
 */
@Controller
@RequestMapping("/test")
public class TestController
{
    @RequestMapping("/t1")
    public String index()
    {
        return "test/t1";
    }
}
