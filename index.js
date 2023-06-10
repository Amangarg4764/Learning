const client=require('./Config/influx')

//  --------------------------------------------------      CRUD operation-----------

//influx fetch data ==> read data
const fetchdata=async function(){
    try{
        const data=await client.query(`SELECT * FROM Consumption`);
        console.log(data);
    }catch(err){
        console.log(err);
    }
}

//influx for create data
module.exports.insertdata=async function(t1,v1){
    try{
        await client.writePoints([{
            measurement:'Consumption',
            tags:{tag:t1},
            fields:{value:v1},
        },]);
        
    }catch(err){
        console.log(err)
    }
}

fetchdata();