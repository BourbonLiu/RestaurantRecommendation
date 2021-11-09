package com.group3.login.controller;

import com.group3.login.service.Livy;

import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;


@RestController
@Slf4j
public class LivyController {
    @Autowired
    Livy livy;
    @Autowired
    private KafkaConsumer<String, String> kafkaConsumer;

    @PostMapping("/livy")
    public List<String> receive(@RequestParam(name = "location") String location,
                                @RequestParam(name = "user_id") String user_id) {

        JSONObject latlng = new JSONObject(location);
        livy.postData(latlng.getDouble("lat"), latlng.getDouble("lng"), 0.5f, user_id);

        List<String> messageList = new ArrayList<>();
        while (true){
            ConsumerRecords<String, String> records = kafkaConsumer.poll(Duration.ofSeconds(120));
            for (ConsumerRecord<String, String> record : records) {
                String message = record.value();
                messageList.add(message);
            }
            if (records.isEmpty()){
                break;
            }
        };
        System.out.println(messageList);
        return messageList;
    }

}
