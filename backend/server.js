const express = require("express");
const dotenv = require("dotenv")
const mongoose = require("mongoose")
const http = require("http");
const userRouter = require("./routes/userRoutes");
const socketio = require("socket.io");
const socketIo = require("./socket");
const cors = require('cors');
const groupRouter = require("./routes/groupRoutes");
const messageRouter = require("./routes/messageRoutes");
dotenv.config()

const app = express()
const server = http.createServer(app)
const io = socketio(server, {
  cors: {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true
  }
})

//Middlewares
app.use(cors())
app.use(express.json())

//connect to DB
mongoose
.connect(process.env.MONGO_URL)
.then(()=>{
  console.log("Connected to Database")
})
.catch((error)=>{
  console.log("MongoDb connection failed", error)
})

//Initialize the socket instance
socketIo(io)

//Routes
app.use("/api/users", userRouter)
app.use("/api/groups", groupRouter)
app.use("/api/messages", messageRouter)


//Start the server 
const PORT = process.env.PORT || 3001

server.listen(PORT, ()=>{
  console.log("Server is up and running")
})