const client=require('./Config/influx')
const ExcelJS=require('exceljs');
const moment=require('moment');
const addConsuptionToExcelsheet=async function(database){
    try{
        
        const data=await client.query(`SELECT * FROM ${database}`);
        //code of excel workbook=file
        const Workbook=new ExcelJS.Workbook();
        //worksheet
        const WorkSheet=Workbook.addWorksheet('Summary');
        WorkSheet.columns=[
            {header:'Time',key:'time',width:'30',style:{numFmt:'yyyy-mm-dd hh:mm:ss'}},
            {header:'Device',key:'device',width:'20'},
            {header:'Sensor',key:'sensor',width:'10'},
            {header:'First DP',key:'start',width:'25'},
            {header:'Last DP',key:'end',width:'25'},
            {header:'Consumption',key:'value',width:'10'}
        ]
        //add data to excel
        data.map(val=>{
            WorkSheet.addRow(val);
        });
        WorkSheet.getRow(1).eachCell(cell=>{
            cell.font={bold:true}
        })
        //add workbook
        await Workbook.xlsx.writeFile('ConsumptionRecord.xlsx');
    }catch(err){
        console.log(err);
    }
}

module.exports.insertConsumption=async function(obj,topic){
    try{
        obj=JSON.parse(obj);
      //console.log(obj)
            for (let index = 0; index < obj.length; index++) {
                
                const element = obj[index];
                
                await client.writePoints([{
                measurement:topic,
                tags:{sensor:element.sensor ,start:element.start,end:element.end,device:element.measurement},
                fields:{value:element.consumptionRate}
                
            },]);
        }
        console.log("Message save to database");
        addConsuptionToExcelsheet(topic);
    }catch(err){
        console.log(err)
    }
}
