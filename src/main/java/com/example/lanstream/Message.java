package com.example.lanstream;

import lombok.Data;

@Data
public class Message {

	private String content;

	private String name;

	private String type;

	public Message() {
	}

	public Message(String content) {
		this.content = content;
	}

	public Message(String content, String name, String type) {
		this.content = content;
		this.name = name;
		this.type = type;
	}
}
