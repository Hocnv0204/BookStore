package com.bookstore.backend.configuration;

import com.bookstore.backend.common.enums.Role;
import com.bookstore.backend.model.User;
import com.bookstore.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;
@Configuration
@RequiredArgsConstructor
public class ApplicationinitConfig {
    private final PasswordEncoder passwordEncoder ;
    @Bean
    ApplicationRunner applicationRunner(UserRepository userRepository){
        return args -> {
            if(userRepository.findByUsername("admin").isEmpty()){
                User user = User.builder()
                        .username("admin")
                        .fullName("Admin")
                        .password(passwordEncoder.encode("admin"))
                        .role(Role.ADMIN.toString())
                        .build() ;
                userRepository.save(user);
            }
        } ;
    }
}
