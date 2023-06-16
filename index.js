const client=require('./Config/influx')
const ExcelJS=require('exceljs');
const moment=require('moment');
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
            //{header:'s.no',key:'s.no',width:'10'},
            {header:'Time',key:'time',width:'30',style:{numFmt:'yyyy-mm-dd hh:mm:ss'}},
            {header:'Device',key:'device',width:'20'},
            {header:'Sensor',key:'sensor',width:'10'},
            {header:'Value',key:'value',width:'10'}
        ]
        //add data to excel
        data.map(val=>{
            WorkSheet.addRow(val);
        });
        WorkSheet.getRow(1).eachCell(cell=>{
            cell.font={bold:true}
        })
        //add workbook
        await Workbook.xlsx.writeFile('Consumption.xlsx');
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