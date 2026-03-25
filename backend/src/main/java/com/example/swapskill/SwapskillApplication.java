package com.example.swapskill;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan(basePackages = {"com.example.swapskill", "com.skillswap"})
@EnableJpaRepositories(basePackages = "com.skillswap.repository")
@EntityScan(basePackages = "com.skillswap.model")
public class SwapskillApplication {

	public static void main(String[] args) {
		SpringApplication.run(SwapskillApplication.class, args);
	}

}
