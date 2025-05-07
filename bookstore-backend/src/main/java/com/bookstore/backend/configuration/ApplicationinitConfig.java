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
                HashSet<String> roles = new HashSet<>() ;
                roles.add(Role.ADMIN.name()) ;
                User user = User.builder()
                        .username("admin")
                        .password(passwordEncoder.encode("admin"))
                        .roles(roles)
                        .build() ;
                userRepository.save(user);
            }
        } ;
    }
}
