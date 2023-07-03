const ExcelJS=require('exceljs');
const client=require('./Config/influx');
const moment = require('moment');


const getDeviceData =async(measurement,sensor,start,end) =>{
    try{
      const result= await client.query(`SELECT * FROM ${measurement} WHERE "sensor"=~ ${sensor} AND time >= ${start} AND 
      time <= ${end}`);
      return result;
    }
    catch(err){
      console.log(err);
    }
  }
const divideArray = (array, n) => {
    const chunkSize = array.length / n;
    const result = [];
  
    for (let i = 0; i < array.length; i += chunkSize) {
      const chunk = array.slice(i, i + chunkSize);
      result.push(chunk);
    }
  
    return result;
}
const  numberToLetter = (number) => {
    let result = '';
    while (number > 0) {
      const remainder = (number - 1) % 26;
      result = String.fromCharCode(65 + remainder) + result;
      number = Math.floor((number - 1) / 26);
    }
    return result;
  }
  
const convertTimeZone = (time) =>{
    const timestamp = moment(time);
    // Adding 5 hours and 30 minutes to the timestamp
    const updatedTimestamp = timestamp.format('YYYY-MM-DD HH:mm:ss');

    return updatedTimestamp;
}

  
module.exports.createDetailsExcel = async (data,predata) =>{
    const workbook= new ExcelJS.Workbook();
    await addConsuptionToExcelsheet(data,predata,workbook);
    //await detailsfile(predata,workbook);
    predata=JSON.parse(predata);
    await createDeviceDataExcel(predata.measurement,predata.sensor,predata.start,predata.end,workbook);
    const excel= await workbook.xlsx.writeFile(`Details.xlsx`);
}

addConsuptionToExcelsheet=async function(data,predata,Workbook){
    try{
        predata=JSON.parse(predata);
        data=JSON.parse(data);
        //worksheet
        const WorkSheet=Workbook.addWorksheet('Summary');
        WorkSheet.columns=[
            {header:'Device',key:'measurement',width:'20'},
            {header:'Sensor',key:'sensor',width:'10'},
            {header:'First DP',key:'start',width:'25',style:{numFmt:'yyyy-mm-dd hh:mm:ss'}},
            {header:'Last DP',key:'end',width:'25',style:{numFmt:'yyyy-mm-dd hh:mm:ss'}},
            {header:'Consumption',key:'consumptionRate',width:'20'}
        ]
        //merge cell code
        let mergecountcell=predata.sensor.length;
        let s=2;
        let e=s+mergecountcell-1;
        for(var i=0;i<predata.measurement.length;i++){
            WorkSheet.mergeCells(`A${s+(i*mergecountcell)}:A${e+(i*mergecountcell)}`);
            const mergedCell = WorkSheet.getCell(`A${s+(i*mergecountcell)}`);
            mergedCell.value = predata.measurement[i];
            mergedCell.alignment = {
                vertical: 'middle',
                horizontal: 'center'
              };
        }
        //add data to excel of left column
        for (var i=0;i<data.length;i++) {
            const cell1=WorkSheet.getCell(`B${i+2}`);
            cell1.value=data[i].sensor;
            const cell2=WorkSheet.getCell(`C${i+2}`);
            cell2.value=data[i].start;
            const cell3=WorkSheet.getCell(`D${i+2}`);
            cell3.value=data[i].end;
            const cell4=WorkSheet.getCell(`E${i+2}`);
            cell4.value=data[i].consumptionRate;
        }
        WorkSheet.eachRow((row) =>{
            row.eachCell((cell)=> {
                // console.log(cell.address); // <- to see I actullay go into the cells
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
            });
        });
        WorkSheet.eachRow((row)=>{
                      
            row.eachCell((cell)=>{
                cell.alignment = {
                    vertical: 'middle',
                    horizontal: 'center'
                  };
                
            })
        })
        const row = WorkSheet.getRow(1);
        row.height = 42.5;
        WorkSheet.getRow(1).eachCell(cell=>{
            cell.font={bold:true}
            cell.alignment = {
                vertical: 'middle',
                horizontal: 'center'
              };
        })
    }catch(err){
        console.log(err);
    }
}
/*
detailsfile=async function(obj,Workbook){
    obj=JSON.parse(obj);
    for(var measurement of obj.measurement){
        //worksheet
        const WorkSheet=Workbook.addWorksheet(measurement);
        var ncolume=[];
        for(var i=0;i<obj.sensor.length;i++){
            ncolume[i]={header:obj.sensor[i],key:obj.sensor[i],width:'20'};
        }
        WorkSheet.columns=[
            {header:'Time',key:'time',width:'25',style:{numFmt:'yyyy-mm-dd hh:mm:ss'}},
            ...ncolume
        ]
        //add data to excel
        for(var i=0;i<obj.sensor.length;i++){
            var sensor=obj.sensor[i];
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
}*/

const createDeviceDataExcel = async (devIDs,sensorIDs,startTime,endTime,workbook) =>{
    try{
        const noOfSensor = sensorIDs.length ;
        const noOfDevice = devIDs.length ;
        //creating regex for all sensors
        const regexString = new RegExp(`${sensorIDs.join('|')}`);
        //creating a join string for all devices
        const measurementString = devIDs.join(',');
        //getting tiimestamp from ISO date time
        const startTimestamp = (moment(startTime).valueOf())*10**6;
        const endTimestamp = (moment(endTime).valueOf())*10**6;
        //getting all datapoints for all devices and all sensors with one query
        const AllDatapoints = await getDeviceData(measurementString,regexString,startTimestamp,endTimestamp);
        //dividing datapoints to array for each of device
        const dividedDatapoints = divideArray(AllDatapoints,noOfDevice);

        const worksheet= workbook.addWorksheet("Device Data");

        //setting start column every time 
        let startColumnIndex = 1;

        for(let i=0;i<noOfDevice;i++){
            //getting the start column name
            const startColumn = numberToLetter(startColumnIndex);
            //Calculating endColumn char 
            const endColumnIndex = startColumnIndex + sensorIDs.length;
            const endColumn = numberToLetter(endColumnIndex);
            //merging ,setting value and aligning the merged cell 
            worksheet.mergeCells(`${startColumn}1:${endColumn}1`);
            const mergedCell = worksheet.getCell(`${startColumn}1`);
            mergedCell.value = devIDs[i];
            mergedCell.alignment = {
                vertical: 'middle',
                horizontal: 'center'
              };
            
            const headings = ['TIME', ...sensorIDs];
            for(let l=0;l<headings.length;l++){
                const currentColumnIndex = startColumnIndex+l;
                const currentColum = numberToLetter(currentColumnIndex);
                let cell = worksheet.getCell(`${currentColum}2`)
                cell.value = headings[l];
            }

            const columnA = worksheet.getColumn(`${startColumn}`);
            columnA.width = 20;
            columnA.numFmt = 'yyyy-mm-dd hh:mm:ss';
            
            const currentDatapoint = dividedDatapoints[i]
            const lengthOfCurrentDeviceDP = currentDatapoint.length;

            let currentRow=3;
            for(let j=0;j<lengthOfCurrentDeviceDP;j+=noOfSensor){
                let cell = worksheet.getCell(`${startColumn}${currentRow}`);
                const convertedTime = convertTimeZone(currentDatapoint[j].time);
                cell.value = convertedTime;

                for(let k=0;k<noOfSensor;k++){
                    const currentColumnIndex = startColumnIndex+k+1;
                    const currentColum = numberToLetter(currentColumnIndex);
                    cell = worksheet.getCell(`${currentColum}${currentRow}`)
                    cell.value = currentDatapoint[k+j].value;
                }
                currentRow++;
            }

            //setting start column to end column + 2 for next table
            startColumnIndex = endColumnIndex + 2;

            }
            worksheet.getRow(1).eachCell((cell)=>{
                cell.font= {bold:true};
            });
            worksheet.getRow(2).eachCell((cell)=>{
                cell.font= {bold:true};
            });
            worksheet.eachRow((row) =>{
                row.eachCell((cell)=> {
                   
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                });
            });
            worksheet.eachRow((row)=>{
                row.height = 40;
                
                row.eachCell((cell)=>{
                    cell.alignment = {
                        vertical: 'middle',
                        horizontal: 'center'
                      };
                    
                })
            })
            
            console.log('Device data has been exported as excel')
        }
        catch(err){
            console.log(err);
        }
    }
