const mqtt = require('mqtt');
const { getLastDataPacketTime,setLastDataPacketTime,setConnectionTimeout} =require('./redis');
const { clearInterval } = require('timers');
//time out for 10 second
const timeOut=10;
const client = mqtt.connect('mqtt://localhost:1883', {
  clientId: 'device_activity',
});
client.on('connect', () => {
    console.log("connected to broker")
    client.subscribe('Consumption');
  })
client.on('reconnect',()=>{
  console.log("reconnected to broker")
  client.subscribe('Consumption');

})
client.on('message', (topic, message) => {
        const Obj = JSON.parse(message);
      //console.log(Obj.time)
        setLastDataPacketTime(Obj.time)

});  
checkTimeout= async () => {
    try {
      const lastDataPacketTime = await getLastDataPacketTime();
      //console.log(lastDataPacketTime)
      const timeDiff=(Date.now()-lastDataPacketTime)/1000;
      // console.log(timeDiff)
      if(timeDiff>timeOut){
        setConnectionTimeout(Date.now());
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
        clearInterval(interval);
        console.log("clear Interval")
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
//check every 10sec for timeout
const interval=setInterval(checkTimeout, 10 * 1000);
client.on('error', (err) => {
  console.log(err);
});