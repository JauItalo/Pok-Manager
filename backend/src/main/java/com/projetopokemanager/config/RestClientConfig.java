package com.projetopokemanager.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class RestClientConfig {

    @Bean
    public RestClient pokeApiRestClient() {
        return RestClient.builder()
                .baseUrl("https://pokeapi.co/api/v2")
                .build();
    }
}