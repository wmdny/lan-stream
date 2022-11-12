package com.example.lanstream;

import com.example.lanstream.pojo.Message;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.stream.Collectors;

@Slf4j
@Controller
public class StreamController {

	@Autowired
	private ArrayBlockingQueue<Message> arrayBlockingQueue;

	@MessageMapping("/send")
	@SendTo("/topic/message")
	public Message greeting(Message message) {
		if (!message.isOld()) {
			if (arrayBlockingQueue.size() >= 5) {
				arrayBlockingQueue.poll();
			}
			arrayBlockingQueue.add(message);
		}
		return message;
	}

	@GetMapping("/history")
	@ResponseBody
	public List<Message> greeting() {
		return new ArrayList<>(arrayBlockingQueue);
	}
}
