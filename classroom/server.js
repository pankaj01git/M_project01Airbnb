const express = require("express");
const app = express();
const users = require("./routes/user.js");
const posts = require("./routes/post.js");
const session = require("express-session");

const sessionOptions = {
    secret: "mysecretstring",
    resave: false,
    saveUninitialized: true
};

app.use(session(sessionOptions));

app.get("/reqcount", (req, res) => {
    if(req.session.count){
        req.session.count++;
        
    }else{
        req.session.count = 1;
    }

    res.send(`you send a request ${req.session.count} times`);
    
});

app.get("/getcookies", (req, res) => {
    res.cookie("greet", "hello", {signed: true});
    res.send("send you some cookies");
});

app.get("/verify", (req, res) => {
    console.log(req.signedCookies);
    res.send("verify");
});

app.get("/", (req, res) => {
    console.dir(req.cookies);
    res.send("Hi, I am root!");
});

app.use("/users", users);
app.use("/posts", posts);

app.listen("3000", () => {
    console.log("server is listening");
});