package com.example.lanstream;

import com.example.lanstream.pojo.Message;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompFrameHandler;
import org.springframework.messaging.simp.stomp.StompHeaders;
import org.springframework.messaging.simp.stomp.StompSession;
import org.springframework.messaging.simp.stomp.StompSessionHandlerAdapter;
import org.springframework.stereotype.Component;

import java.lang.reflect.Type;
import java.util.concurrent.ArrayBlockingQueue;

/**
 * description:  <br>
 * date: 2022/11/4 13:32 <br>
 */
@Component
public class SystemStompSessionHandlerAdapter extends StompSessionHandlerAdapter {
    public SystemStompSessionHandlerAdapter(ArrayBlockingQueue<Message> arrayBlockingQueue) {
        super();
        this.arrayBlockingQueue = arrayBlockingQueue;
    }

    @Override
    public Type getPayloadType(StompHeaders headers) {
        return super.getPayloadType(headers);
    }

    @Override
    public void handleFrame(StompHeaders headers, Object payload) {
        super.handleFrame(headers, payload);
    }

    private final ArrayBlockingQueue<Message> arrayBlockingQueue;
    
    @Override
    public void afterConnected(StompSession session, StompHeaders connectedHeaders) {
        session.subscribe("/topic/message", new StompFrameHandler() {
            @Override
            public Type getPayloadType(StompHeaders headers) {
                return Message.class;
            }

            @Override
            public void handleFrame(StompHeaders headers, Object payload) {
                Message message = (Message) payload;
                System.out.println("Receive Msg: " + message.toString());
            }
        });
        try {
            for (Message message : arrayBlockingQueue) {
                message.setOld(true);
                session.send("/app/send", message);
            }
        } catch (Throwable t) {
            System.out.println("Error!" + t.getMessage());
        }
    }

    @Override
    public void handleException(StompSession session, StompCommand command, StompHeaders headers, byte[] payload, Throwable exception) {
        super.handleException(session, command, headers, payload, exception);
    }

    @Override
    public void handleTransportError(StompSession session, Throwable exception) {
        super.handleTransportError(session, exception);
    }
}
