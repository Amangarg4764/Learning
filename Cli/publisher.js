const mqtt = require('mqtt');

// MQTT broker information
const broker = mqtt.connect("mqtt://127.0.0.1:1883");

const package={
  "device": "INEM_DEMO",
  "data":[
    {
      "tag": "VOLTS1",
      "value": 228.07602856051832
    },
    {
      "tag": "VOLTS2",
      "value": 228.3990800794001
    },
        {
            "tag": "VOLTS3",
            "value": 227.9216194144245
        },
        {
            "tag": "CUR1",
            "value": 1.676028560518326
        },
        {
            "tag": "CUR2",
            "value": 2.776028560518326
        },
        {
            "tag": "CUR3",
            "value": 2.376028560518326
        },
        {
            "tag": "W1",
            "value": 0.4260285605183258
        },
        {
            "tag": "W2",
            "value": 0.6460285605183258
        },
        {
            "tag": "W3",
            "value": 0.5960285605183259
        },
        {
            "tag": "PF1",
            "value": 0.8376028560518325
        },
        {
            "tag": "PF2",
            "value": 0.8076028560518327
        },
        {
            "tag": "PF3",
            "value": 0.8276028560518325
        },
        {
            "tag": "PFAVG",
            "value": 0.8276028560518325
        },
        {
            "tag": "FREQ",
            "value": 50.076028560518324
        },
        {
            "tag": "REACTIVE",
            "value": 1.306028560518326
        },
        {
            "tag": "ACTIVE",
            "value": 1.326028560518326
        },
        {
            "tag": "MDKW",
            "value": 2.15
        },
        {
            "tag": "MD",
            "value": 1.9
        },
        {
            "tag": "RSSI",
            "value": 16.076028560518324
        }
    ]
  }

broker.on("connect",function(){
  setInterval(function(){
    // get random tags to the publisher
    var r=package.data[Math.floor(Math.random()*package.data.length)];
    var now=new Date();
    var obj={
      "device":package.device,
      ...r,
      sendtime:now.toLocaleString()
    }
    obj=JSON.stringify(obj);
    console.log(obj)
    broker.publish(package.device,obj);
  },3000)
})

 