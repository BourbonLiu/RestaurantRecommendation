package com.group3.login.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;


@Service
public class Livy {

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public void postData(Double lat, Double lng, Float radius, String user_id) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        ObjectNode conf = objectMapper.createObjectNode();
        conf.put("spark.master", "yarn");
        conf.put("spark.jars.packages", "org.apache.spark:spark-sql-kafka-0-10_2.12:3.1.2");
        ObjectNode data = objectMapper.createObjectNode();
        data.put("conf", conf);
        data.put("file", "hdfs://bdse49:8020/jar/SedonaTest_0.4.3.jar");
        data.put("className", "com.ApacheSedona.sedonaFilter");
        data.put("name", "yelp-around-" + LocalDateTime.now().toString());
        data.put("numExecutors", 5);
        data.put("executorCores", 2);
        data.put("executorMemory", "1024m");
        data.put("driverCores", 1);
        data.put("driverMemory", "512m");
        data.put("queue", "default");
        String myArgs = "[" + lat.toString() + "," + lng.toString() + "," + radius.toString() + "," + "\"" + user_id + "\"" + "]";
        String data_string = data.toString();
        int stringLen = data_string.length();
        data_string = data_string.substring(0, stringLen - 1) + ",\"args\":" + myArgs + "}";
        System.out.println(data_string);
        HttpEntity<String> request = new HttpEntity<String>(data_string, headers);
        String response = restTemplate.postForObject("http://10.120.30.175:8998/batches", request, String.class);
        System.out.println(response + "\n");

    }
}
