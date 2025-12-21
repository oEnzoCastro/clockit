const express = require("express");
const auth = require("./routes/auth");
const app = express();


app.use(express.json());

// Necessário para receber form-data / x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(auth);

app.listen(3000,()=>{
    console.log("app running on localhost:3000");
});

