const express = require("express");
const http = require("http");
const mongo = require("mongoose");
const cors = require("cors");
const ReservationRouter = require("./routes/ReservationR");
const SpRouter = require("./routes/SponsorsR");
const tkRouter = require("./routes/TicketR");
const paymentRoutes = require('./routes/payment');
const config = require("./config/dbconnection.json");
const bodyParser = require("body-parser");

//-------------------Routes-------------------
const tournamentRouter = require("./routes/tournament");
const teamRouter = require("./routes/team");

const matchRouter = require("./routes/match");

const userRouter = require("./routes/user");
const path = require("path");

mongo
  .connect(config.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database Connected"))
  .catch(() => console.log("Not Connected"));

var app = express();
app.use(
  cors({
    origin: "*", // Replace with your React app's origin
    credentials: true, // If your requests include credentials like cookies
  })
);
app.use(bodyParser.json());
app.use("/public/images", express.static(__dirname + "/public/images/"));

app.use("/tournament", tournamentRouter);
app.use("/reservation", ReservationRouter);
app.use("/sponsors", SpRouter);
app.use("/ticket", tkRouter);
app.use('/payment', paymentRoutes);
app.use("/team", teamRouter);
app.use("/match", matchRouter);
app.use("/user", userRouter);
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:5173", // Adjust this based on your React app's origin
    methods: ["GET", "POST", "PUT"],
  },
});
io.on("connection", (socket) => {
  console.log("User connected");

  // Handle score update event
  socket.on("updateScore", (updatedMatch) => {
    // Broadcast the updated match to all connected clients
    io.emit("updateScore", updatedMatch);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(3000, console.log("server run"));
module.exports = app;
