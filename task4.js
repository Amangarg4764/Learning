const ExcelJS=require('exceljs');
const client=require('./Config/influx')

module.exports.addConsuptionToExcelsheet=async function(data){
    try{
        
        data=JSON.parse(data);
        //code of excel workbook=file
        const Workbook=new ExcelJS.Workbook();
        //worksheet
        const WorkSheet=Workbook.addWorksheet('Summary');
        WorkSheet.columns=[
            {header:'Device',key:'measurement',width:'20'},
            {header:'Sensor',key:'sensor',width:'10'},
            {header:'First DP',key:'start',width:'25',style:{numFmt:'yyyy-mm-dd hh:mm:ss'}},
            {header:'Last DP',key:'end',width:'25',style:{numFmt:'yyyy-mm-dd hh:mm:ss'}},
            {header:'Consumption',key:'consumptionRate',width:'20'}
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

const detailsfile=async function(){
    //code of excel workbook=file
    const Workbook=new ExcelJS.Workbook();
    const nMeasurement=await client.query("SHOW MEASUREMENTS");
    for(var measurement of nMeasurement){
        measurement=measurement.name;
        //worksheet
        const WorkSheet=Workbook.addWorksheet(measurement);
        var ncolume=[];
        const nSensor=await client.query(`SELECT COUNT(*) FROM ${measurement} GROUP BY sensor`);
        for(var i=0;i<nSensor.length;i++){
            ncolume[i]={header:nSensor[i].sensor,key:nSensor[i].sensor,width:'10'};
        }
        WorkSheet.columns=[
            {header:'Time',key:'time',width:'25',style:{numFmt:'yyyy-mm-dd hh:mm:ss'}},
            ...ncolume
        ]
        
        //add data to excel
        for(var i=0;i<nSensor.length;i++){
            var sensor=nSensor[i].sensor;
            const data=await client.query(`SELECT * FROM ${measurement} WHERE sensor = '${sensor}'`);
            data.map((val,index)=>{
                const cell1 = WorkSheet.getCell(`'A${2+index}'`);
                cell1.value = val.time;
                const cell2 = WorkSheet.getCell(`'${String.fromCharCode(66+i)}${2+index}'`);
                cell2.value = val.value;
            });
            
        }
        WorkSheet.getRow(1).eachCell(cell=>{
            cell.font={bold:true}
        })
    }
    //add workbook
    await Workbook.xlsx.writeFile('details.xlsx');
}
detailsfile();