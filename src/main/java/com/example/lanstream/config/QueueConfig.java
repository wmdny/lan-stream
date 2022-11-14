package com.example.lanstream.config;

import com.example.lanstream.pojo.Message;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.ArrayBlockingQueue;

/**
 * description:  <br>
 * date: 2022/11/11 14:36 <br>
 */
@Configuration
public class QueueConfig {

    @Bean
    public ArrayBlockingQueue<Message> arrayBlockingQueue(){
        return new ArrayBlockingQueue<>(20, true);
    }
}
