const mqtt = require('mqtt');
const insert=require('../index').insertdata;
// MQTT broker information
const broker = "mqtt://127.0.0.1:1883";
const options = {
  clientId: 'Subscriber', // Unique client ID
};

// Connect to the MQTT broker
const client = mqtt.connect(broker, options);
const topic="Consumption";

client.on('connect',function(){
  client.subscribe(topic);
  console.log('client is subscribe the topic');
})

// Callback function when a message is received
client.on('message', (topic, message) => {
  console.log("Message Received : ",JSON.parse(message));
  insert(message,topic);
  
});