package com.example.demo.config;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CloudinaryConfig {

    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(ObjectUtils.asMap(
            "cloud_name", "dwlwp6bio",
            "api_key", "476621638922373",
            "api_secret", "8i_Zc-PVKKNro1kbkFx-f1en5ek"
        ));
    }
}