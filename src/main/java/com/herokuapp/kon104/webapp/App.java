package com.herokuapp.kon104.webapp;

import org.springframework.boot.SpringApplication;
//	import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Hello world!
 *
 */
//	@EnableAutoConfiguration
@SpringBootApplication
public class App 
{
    public static void main( String[] args )
    {
        System.out.println( "Started SpringBootApplication#main()" );
        SpringApplication.run(App.class, args);
    }
}
