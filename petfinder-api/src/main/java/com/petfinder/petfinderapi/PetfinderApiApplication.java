package com.petfinder.petfinderapi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class PetfinderApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(PetfinderApiApplication.class, args);
	}

}
