const e = require("express");
const express = require("express");
const math=require("mathjs");
const app = express();
const port = 3000;

const { initializeApp , cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
var serviceAccount = require("./KEY.json");
initializeApp({
	credential: cert(serviceAccount),
});

const db = getFirestore();
app.set("view engine","ejs");

app.get("/",(req,res)=>{
	res.send("WELCOME TO OUR NOVELSTORE");
});
app.get("/login1",(req,res)=>{
	res.render("login1");
});
app.get("/lgnsubmit",(req,res)=>{
	const email=req.query.email;
	const pwd=req.query.pwd;
	db.collection("ecestudents")
	.where("Email","==",email)
	.where("Password","==",pwd)
	.get()
	.then((docs) => {
		if(docs.size > 0){
			res.render("home1");
		}
		else{
			res.render("signup1");
		}
	});
});

app.get("/signup1",(req,res)=>{
	res.render("signup1");
});
app.get("/homesubmit",(req,res)=>{
	const name=req.query.name;
	const email=req.query.email;
	const pwd=req.query.pwd;
	db.collection("ecestudents").add({
		Name : name,
		Email : email,
		Password: pwd,
	}).then(()=>{
		res.render("login1");
	});
});

app.get("/home1",(req,res)=>{
	res.render("home1");
});
const arr=[];
const costs=[];
var amount=0;
app.get("/addedToCart",(req,res)=>{
	const val=req.query.item;
	var c=req.query.cost;
	costs.push(c);
	c=math.evaluate(c.slice(0,c.length-2));
	amount=amount+c;
	arr.push(val);
	res.render("home1");
});

app.get("/cart1",(req,res)=>{
	if(typeof(arr) != "undefined"){
		db.collection("cartstore").add({
			Cart : arr,
			Costs : costs,
			TotalCost : amount,
		}).then(()=>{
			res.render("cart1",{booksData : arr, amount : amount, costs : costs});
		});
	}
});
app.listen(port,()=>{
	console.log(`You are in port number ${port}`);
});