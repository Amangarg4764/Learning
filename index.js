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
      
            for (let index = 0; index < obj.data.length; index++) {
                
                const element = obj.data[index];
                await client.writePoints([{
                measurement:"Consumption",
                time:obj.time,
                tags:{device:obj.device,tag:element.tag},
                fields:{value:element.value}
                
            },]);
        }
        console.log("Message save to database");
    }catch(err){
        console.log(err)
    }
}

fetchdata();