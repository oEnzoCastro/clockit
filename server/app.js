const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser"); // <-- ADICIONAR

const authRoutes = require("./routes/authRoutes");
const areaRoutes = require("./routes/areaRoutes");
const agentRoutes = require("./routes/agentRoutes");
const agentSectorRoutes = require("./routes/agentSectorRoutes");
const calendarRoutes = require("./routes/calendarRoutes");
const dayScheduleRoutes = require("./routes/dayScheduleRoutes");
const sectorRoutes = require("./routes/sectorRoutes");

const app = express();

// 🔥 CORS CORRIGIDO
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true // <-- ESSENCIAL PARA COOKIES
}));

app.use(cookieParser()); // <-- ESSENCIAL PARA req.cookies

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', authRoutes);
app.use('/areas', areaRoutes);
app.use('/agents', agentRoutes);
app.use('/agentSectors', agentSectorRoutes);
app.use('/calendar', calendarRoutes);
app.use('/daySchedules', dayScheduleRoutes);
app.use('/sectors', sectorRoutes);

app.listen(5000, () => {
    console.log("SERVER STARTED ON http://localhost:5000");
});