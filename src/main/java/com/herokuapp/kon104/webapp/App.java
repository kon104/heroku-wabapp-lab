package com.herokuapp.kon104.webapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.RequestMapping;
//	import org.springframework.web.bind.annotation.RestController;

/**
 * Hello world!
 *
 */
//	@RestController
@EnableAutoConfiguration
@SpringBootApplication
public class App 
{

/*
    @RequestMapping("/")
    public String index()
    {
        return "Hello SB!";
    }
*/

    public static void main( String[] args )
    {
        System.out.println( "Started SpringBootApplication#main()" );
        SpringApplication.run(App.class, args);
    }
}
