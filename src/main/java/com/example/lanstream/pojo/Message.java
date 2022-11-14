package com.example.lanstream.pojo;

import lombok.Data;

@Data
public class Message {

	private String content;

	private String fileName;

	private String type;
	
	private Double fileSize;
	
	private boolean old;

	private long timestamp = System.currentTimeMillis();

	public Message() {
	}
}
