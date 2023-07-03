require('dotenv').config();

const influx=require('influx');

//influx configuration
const client=new influx.InfluxDB({
    database:process.env.DATABASE ||'learningInfluxDB',
    host:process.env.HOST || 'localhost',
    port:process.env.PORT || 8086,
});

module.exports=client;