const mqtt = require('mqtt');
const { getLastDataPacketTime,setLastDataPacketTime,setConnectionTimeout} =require('./redis');
const { clearInterval } = require('timers');

//time out for 10 second
const timeOut=8;
const client = mqtt.connect('mqtt://localhost:1883', {
  clientId: 'device_activity',
});

client.on('connect', () => {
    console.log("connected to broker ")
    client.subscribe('Consumption');
  })

client.on('message', (topic, message) => {
      const Obj = JSON.parse(message);
     // console.log(Obj.time,"message recived")
     setLastDataPacketTime(Obj.time);
});

function interval(){
//check every 10sec for timeout
  const interval=setInterval(async () => {
      try {
        const lastDataPacketTime = await getLastDataPacketTime();
        //console.log(lastDataPacketTime)
        const timeDiff=(Date.now()-lastDataPacketTime)/1000;
        // console.log(timeDiff)
        if(timeDiff>timeOut){
          await setConnectionTimeout(Date.now());
          const payloadObj={
              device:"INEM_DEMO",
              time:Date.now(),
              data:[{
                tag:'RSSI',
                value:-1
              }]
          }
          const payload=JSON.stringify(payloadObj);
          client.publish('Consumption', payload);
  //        console.log("clear Interval");
          clearInterval(interval);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  },10*1000);
}
// for the first time
interval();
client.on('error', (err) => {
  console.log(err);
});