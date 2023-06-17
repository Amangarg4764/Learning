const findConsumption=require('./ConsuptionRate').findConsumption;
const express=require('express');
const port=8000;
const app=express();
const path=require('path');
const moment=require('moment');
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'sitepages'));
app.use(express.urlencoded({extended:true}));

app.post('/api',async function(req,res){
    //req body
   // console.log(req.body)
   //If start date is greater than end date
    if(moment(req.body.end).valueOf()<=moment(req.body.start).valueOf()){
        return res.status(400).json({data:"start date is greater than end date",message:"Error in Consuption caluation"})
    }
    //formula
    const val =await findConsumption(req.body.start,req.body.end,req.body.measurement,req.body.sensor);
    //answer send in json format
    //console.log(val)
    //if(req.xhr){
        return res.status(200).json({data:val,message:"Consuption caluated done"})
    //}
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