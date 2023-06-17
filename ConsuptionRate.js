const client = require("./Config/influx");
const moment = require("moment");
//function for caluclate Consumption rate between end and start date
const findConsumption = async function (start, end, measurement, sensor) {
  try {
    //start value
    start=moment(start).valueOf();
    end=moment(end).format();
    const squery = `SELECT * FROM ${measurement} WHERE "sensor"='${sensor}' AND time >= ${start} limit 1`;
    var svalue = await client.query(squery);
    svalue = parseInt(svalue[0].value);
    //end value
    const equery = `SELECT * FROM ${measurement} WHERE "sensor" = '${sensor}' AND time <= '${end}' ORDER BY DESC LIMIT 1`;
    var evalue = await client.query(equery);
    evalue = parseInt(evalue[0].value);
    //output
    //console.log(evalue - svalue);
    return evalue-svalue;
  } catch (err) {
    console.log("error");
  }
};
//Input
//var start = moment("2023-06-16 00:00:00").valueOf();
//var end = moment("2023-06-17 00:00:00").format();
//findConsumption(start, end, "Consumption", "RSSI");

module.exports.findConsumption=findConsumption;