const mqtt = require('mqtt');

// MQTT broker information
const broker = "mqtt://127.0.0.1:1883";
const options = {
  clientId: 'Subscriber1_g1', // Unique client ID
};

// Connect to the MQTT broker
const client = mqtt.connect(broker, options);

client.on('connect',function(){
  client.subscribe('$share/g1/consumption');
  console.log('client is subscribe the topic');
})

// Callback function when a message is received
client.on('message', (topic, message) => {
  console.log('Received message:', message.toString());
});