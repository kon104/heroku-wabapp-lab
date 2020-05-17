package com.herokuapp.kon104.webapp.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

import com.herokuapp.kon104.webapp.domain.StudyEnglishService;
import com.herokuapp.kon104.webapp.SentenceJpn2Eng;

/**
 * WebAPI Controller
 */
@RestController
@RequestMapping("/webapi")
public class WebApiController
{

	@Autowired
	StudyEnglishService studyEnglishService;

    // {{{ public List<SentenceJpn2Eng> getStudyEnglish()
	@GetMapping("/studyeng")
    public List<SentenceJpn2Eng> getStudyEnglish()
    {
		List<SentenceJpn2Eng> resultList = studyEnglishService.main();
		return resultList;
    }
	// }}}

}
