const findConsumption=require('./ConsuptionRate').findConsumption;
const express=require('express');
const port=7000;
const app=express();
const path=require('path');
const moment=require('moment');

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'sitepages'));
app.use(express.urlencoded({extended:true}));
app.use(express.json())

app.post('/api',async function(req,res){
    //req body
    //console.log(req.body)
    const {measurement,sensor,start,end}=req.body;
    //If start date is greater than end date
    if(moment(end).valueOf()<=moment(start).valueOf()){
        return res.status(400).json({data:"start date is greater than end date",message:"Error in Consuption caluation"});
    }
    //formula
    var ans=[];
    var c=0;
    for(var i=0;i<measurement.length;i++){
        for(var j=0;j<sensor.length;j++){
            var val =await findConsumption(start,end,measurement[i],sensor[j]);
            var obj={
                measurement:measurement[i],
                sensor:sensor[j],
                start:start,
                end:end,
                consumptionRate:val
            }
            ans[c]=obj;
            c++;
       }
    }
    return res.status(200).json({data:ans,message:`Consuption caluated done between range of ${req.body.start} to ${req.body.end}`});
    
    //return res.redirect('back');
});

app.get('/',async function(req,res){
    return res.render("consuption");
});

app.listen(port,function(err){
    if(err){
        console.log("Error in the port");
        return;
    }
    console.log("Sever is running at port : ",port);
})