const mqtt = require('mqtt');
const insert=require('../index').insertdata;
// MQTT broker information
const broker = mqtt.connect("mqtt://127.0.0.1:1883");


broker.on("connect",function(){
  var count=1;
  setInterval(function(){
    var random=Math.random()*50;
    insert(count,random);
    count++;
  broker.publish("consumption","Publishing the content "+random);
  },5000)
})
