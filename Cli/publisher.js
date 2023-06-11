const mqtt = require('mqtt');

// MQTT broker information
const broker = mqtt.connect("mqtt://127.0.0.1:1883");

var arr=["VOLTS1","VOLTS2","VOLTS3","CUR1","CUR2","CUR3",
"W1","W2","W3","PF1","PF2","PF3","PFAVG","FREQ","REACTIVE","ACTIVE", "MDKW","MD","RSSI"];

broker.on("connect",function(){
  setInterval(function(){
    // get random tags to the publisher
    var r=arr[Math.floor(Math.random()*arr.length)];
    // get random float number betweent 1 to 500
    var random=Math.random()*500;
    var obj={
      tag:r,val:random
    }
    console.log(obj.tag)
    broker.publish("consumption",`${obj.tag} ${obj.val}`);
  },3000)
})

 