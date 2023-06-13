const mqtt = require('mqtt');

// MQTT broker information
const broker = mqtt.connect("mqtt://127.0.0.1:1883");
const topic="Consumption"
const max=1000;
const min=1;

broker.on("connect",function(){
//publish data every 10 second
setInterval(function(){
    //get random number from math.random between from 1 to 1000
    const random = (Math.random() * (max - min)) + min;
    const random2 = (Math.random() * (max - min)) + min;
    const random3 = (Math.random() * (max - min)) + min;
    const package={
    "device": "INEM_DEMO",
    "time":Date.now(),
    "data":[
        {
        "tag": "VOLTS1",
        "value": random
        },
        {
        "tag": "VOLTS2",
        "value": random2
        },
        {
            "tag": "VOLTS3",
            "value": random3
        },
        {
            "tag": "CUR1",
            "value": random 
        },
        {
            "tag": "CUR2",
            "value": random2
            },
            {
                "tag": "CUR3",
                "value": random3
            },
            {
                "tag": "W1",
                "value": random
            },
            {
                "tag": "W2",
                "value": random2
            },
            {
                "tag": "W3",
                "value": random3
            },
            {
                "tag": "PF1",
                "value": random
            },
            {
                "tag": "PF2",
                "value": random2
            },
            {
                "tag": "PF3",
                "value": random3
            },
            {
                "tag": "PFAVG",
                "value": random
            },
            {
                "tag": "FREQ",
                "value": random2
            },
            {
                "tag": "REACTIVE",
                "value": random3
            },
            {
                "tag": "ACTIVE",
                "value": random
            },
            {
                "tag": "MDKW",
                "value": random2
            },
            {
                "tag": "MD",
                "value": random3
            },
            {
                "tag": "RSSI",
                "value": random
            }
        ]
    }
    //console.log("Publish topic : ",topic," data :",JSON.stringify(package));
    broker.publish(topic,JSON.stringify(package));
},5000)    
})

 