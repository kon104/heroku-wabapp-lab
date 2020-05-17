package com.herokuapp.kon104.webapp;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.core.JsonProcessingException;

import java.net.URL;
import java.net.HttpURLConnection;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.List;
import java.util.ArrayList;

import com.herokuapp.kon104.webapp.SentenceJpn2Eng;


/**
 * Study English for WebAPI Controller
 */
@RestController
public class WebapiStudyEnglishController
{

    // {{{ public List<SentenceJpn2Eng> getStudyEnglish()
	@RequestMapping(path = "/webapi/studyeng", method = RequestMethod.GET)
    public List<SentenceJpn2Eng> getStudyEnglish()
    {
		List<SentenceJpn2Eng> resultList = this.main();
		return resultList;
    }
	// }}}

    // {{{ private List<SentenceJpn2Eng> main()
    private List<SentenceJpn2Eng> main()
	{
		String url = "https://spreadsheets.google.com/"
			+ "feeds/list/"
			+ "1zHOtL6kBNJ9K_VB7hpC9Z2O0tAEkKs96e3iFHSDQxts/1"
			+ "/public/values?alt=json";

		String responseBody = this.requestHttpGET(url);
		List<SentenceJpn2Eng> beanList = this.replaceGssJson2Bean(responseBody);

		return beanList;
	}
	// }}}

    // {{{ private String requestHttpGET(String url)
    private String requestHttpGET(String url)
	{
		String responseBody = null;

		try{
			URL obj = new URL(url);
			HttpURLConnection con = (HttpURLConnection) obj.openConnection();
			con.setRequestMethod("GET");

			int responseCode = con.getResponseCode();
			BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
			String inputLine;
			StringBuffer response = new StringBuffer();
			while ((inputLine = in.readLine()) != null) {
				response.append(inputLine);
			}
			in.close();
			responseBody = response.toString();
		} catch(Exception e) {
			e.printStackTrace();
		}

		return responseBody;
	}
	// }}}

    // {{{ private List<SentenceJpn2Eng> replaceGssJson2Bean(String json)
    private List<SentenceJpn2Eng> replaceGssJson2Bean(String json)
	{
		ObjectMapper mapper = new ObjectMapper();
		JsonNode node = null;
		try{
			node = mapper.readTree(json);
		} catch(JsonProcessingException e) {
			e.printStackTrace();
		}

		List<SentenceJpn2Eng> beanList = new ArrayList<SentenceJpn2Eng>();
		for (JsonNode n : node.get("feed").get("entry")) {
			SentenceJpn2Eng sentence = new SentenceJpn2Eng();
			String colSrc = n.get("gsx$source").get("$t").asText();
			if ((colSrc != null) && (colSrc != "")) {
				sentence.setSource(colSrc);
			}
			String colJpn = n.get("gsx$japanese").get("$t").asText();
			if ((colJpn != null) && (colJpn != "")) {
				sentence.setJapanese(colJpn);
			}
			String colEng = n.get("gsx$english").get("$t").asText();
			if ((colEng != null) && (colEng != "")) {
				sentence.setEnglish(colEng);
			}
			beanList.add(sentence);
		}

		return beanList;
	}
	// }}}

}
