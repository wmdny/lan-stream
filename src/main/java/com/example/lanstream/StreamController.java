package com.example.lanstream;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class StreamController {


	@MessageMapping("/send")
	@SendTo("/topic/message")
	public Message greeting(Message message) {
		return message;
	}

}
