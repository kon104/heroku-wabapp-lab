package com.herokuapp.kon104.webapp;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import java.net.URL;
import java.net.HttpURLConnection;
import java.io.BufferedReader;
import java.io.InputStreamReader;
/**
 * Study English for WebAPI Controller
 */
@RestController
@RequestMapping("/webapi/studyeng")
public class WebapiStudyEnglishController
{
	@RequestMapping(method = RequestMethod.GET)
    public String getStudyEnglish()
    {
		String url = "https://spreadsheets.google.com/feeds/list/1zHOtL6kBNJ9K_VB7hpC9Z2O0tAEkKs96e3iFHSDQxts/1/public/values?alt=json";

		String result = null;

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
			result = response.toString();
		} catch(Exception e) {
			e.printStackTrace();
		}

		return result;
    }
}
