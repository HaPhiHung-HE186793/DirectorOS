package com.myhung.mytask;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class MyTaskApplication {

    public static void main(String[] args) {
        SpringApplication.run(MyTaskApplication.class, args);
    }
}
