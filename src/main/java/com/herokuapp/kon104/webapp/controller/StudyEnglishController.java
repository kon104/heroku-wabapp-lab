package com.herokuapp.kon104.webapp;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
/**
 * Study English Controller
 */
@Controller
public class StudyEnglishController
{
	@RequestMapping("/studyeng")
    public String index()
    {
        return "studyeng/index";
    }
}
