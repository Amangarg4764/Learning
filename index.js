const client=require('./Config/influx')
//  --------------------------------------------------      CRUD operation-----------

//influx fetch data ==> read data
const fetchdata=async function(){
    try{
        const data=await client.query(`SELECT * FROM Consumption limit 10`);
        data.map(val=>{
            console.log(val.value);
        });
    }catch(err){
        console.log(err);
    }
}

//influx for create data
module.exports.insertdata=async function(obj){
    
    try{
        obj=JSON.parse(obj);
        await client.writePoints([{
            measurement:obj.device,
            tags:{measurement:obj.device,device:obj.tag},
            fields:{value:obj.value,pubTime:obj.sendtime},
        },]);
            console.log("Message save to database");
    }catch(err){
        console.log(err)
    }
}

fetchdata();