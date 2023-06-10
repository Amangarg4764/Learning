const client=require('./Config/influx')

//  --------------------------------------------------      CRUD operation-----------

//influx fetch data ==> read data
const fetchdata=async function(){
    try{
        const data=await client.query(`SELECT * FROM cpu1`);
        console.log(data);
    }catch(err){
        console.log(err);
    }
}

//influx for create data
module.exports.insertdata=async function(id,element){
    try{
        await client.writePoints([{
            measurement:'cpu1',
            tags:{id},
            fields:{value:element},
        },]);
        
    }catch(err){
        console.log(err)
    }
}

fetchdata();