const client=require('./Config/influx')
const ExcelJS=require('exceljs');
//  --------------------------------------------------      CRUD operation-----------

//influx fetch data ==> read data
const fetchdata=async function(){
    try{
      
        const data=await client.query(`SELECT * FROM Consumption`);
        //code of excel workbook=file
        const Workbook=new ExcelJS.Workbook();
        //worksheet
        const WorkSheet=Workbook.addWorksheet('Consumption');
        WorkSheet.columns=[
          //  {header:'s.no',key:'s.no',width:'10'},
            {header:'time',key:'time',width:'30'},
            {header:'device',key:'device',width:'20'},
            {header:'sensor',key:'sensor',width:'10'},
            {header:'value',key:'value',width:'10'}
        ]
        //add data to excel
        data.map(val=>{
            WorkSheet.addRow(val);
        });
        const r=await Workbook.xlsx.writeFile('Consumption.xlsx');
        console.log('done')
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
                tags:{device:obj.device,sensor:element.tag},
                fields:{value:element.value}
                
            },]);
        }
        console.log("Message save to database");
    }catch(err){
        console.log(err)
    }
}

fetchdata();