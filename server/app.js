const express = require("express");
const auth = require("./routes/auth");
const areaRoutes = require("./routes/areaRoutes");
const agentRoutes = require("./routes/agentRoutes");
const agentSectorRoutes = require("./routes/agentSectorRoutes");
const calendarRoutes = require("./routes/calendarRoutes");
const app = express();


app.use(express.json());

// Necessário para receber form-data / x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(auth);
app.use(areaRoutes);
app.use(agentRoutes);
app.use(agentSectorRoutes);
app.use(calendarRoutes);

app.listen(3000,()=>{
    console.log("app running on localhost:3000");
});

