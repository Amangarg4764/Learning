const mqtt = require('mqtt');
const moment=require('moment');
// MQTT broker information
const broker = mqtt.connect("mqtt://127.0.0.1:1883");

broker.on("connect",function(){
//publish data every 10 second
for(var j=1;j<4;j++){
    const topic="Consumption"
    const max=10;
    const min=0;
    var random=0;
    var random1=0;
    var random2=0;
    var time=1;
    for(var i=0;i<720;i++){
 //get random number from math.random between from 1 to 1000
 random = (Math.random() * (max - min)) + min+random;
 random2 = (Math.random() * (max - min)) + min+random1;
 random3 = (Math.random() * (max - min)) + min+random2;
 const package={
 "device": "INEM_DEMO"+j,
 "time":moment().valueOf()+time*5000,
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
//console.log(moment())
time++;
console.log("Publish topic : ",topic," data :",JSON.stringify(package));
broker.publish(topic,JSON.stringify(package));   
}}
})