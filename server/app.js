const express = require("express");
const auth = require("./routes/auth");
const areaRoutes = require("./routes/areaRoutes");
const agentRoutes = require("./routes/agentRoutes");
const agentSectorRoutes = require("./routes/agentSectorRoutes");
const calendarRoutes = require("./routes/calendarRoutes");
const dayScheduleRoutes = require("./routes/dayScheduleRoutes");
const sectorRoutes = require("./routes/sectorRoutes");
const app = express();


app.use(express.json());

// Necessário para receber form-data / x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use('/auth',auth);
app.use('/areas',areaRoutes);
app.use('/agents',agentRoutes);
app.use('/agentSectors',agentSectorRoutes);
app.use('/calendar',calendarRoutes);
app.use('/daySchedules',dayScheduleRoutes);
app.use('/sectors',sectorRoutes);

app.listen(3000,()=>{
    console.log("app running on localhost:3000");
});

