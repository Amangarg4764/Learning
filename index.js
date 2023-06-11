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
module.exports.insertdata=async function(t1,v1){
    try{
        await client.writePoints([{
            measurement:'Consumption',
            tags:{device:t1},
            fields:{value:v1},
        },]);
      
        
    }catch(err){
        console.log(err)
    }
}

fetchdata();