const express=require('express')
const mongoose=require('mongoose')
const http=require('http')
const {Server}=require('socket.io')
const cors=require('cors')
const bodyParser=require('body-parser')
const authRoutes = require("./routes/authRoutes");



mongoose.connect('mongodb+srv://maheshgumma18:asdfghjkl143@cluster0.nhrxp.mongodb.net/myDatabase?retryWrites=true&w=majority/Chatapp').then(()=>{console.log("database connected succesfully")})
.catch((err)=>{console.log(err)})

const app = express();
app.use(cors())
app.use(express.json());
app.use(bodyParser.json());  
app.use(bodyParser.urlencoded({ extended: true }));



app.use("/api/auth", authRoutes);




const server = http.createServer(app);


users={}
const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST","PUT","DELETE"],
  },
});


const onlineUsers = new Map(); // Map<userId, socketId>

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  // Register user
  socket.on("register", ({ userId }) => {
    onlineUsers.set(userId, socket.id);

    const onlineUsersArray = Array.from(onlineUsers.keys());
    io.emit("onlineusers", onlineUsersArray);
    console.log("Online users:", onlineUsersArray);
  });

  // Listen for messages
  socket.on("sendMessage", (data) => {
    const { receiverId } = data;
    const receiverSocket = onlineUsers.get(receiverId);

    if (receiverSocket) {
      io.to(receiverSocket).emit("receiveMessage", data);
    }
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    for (const [userId, sockId] of onlineUsers.entries()) {
      if (sockId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }

    const onlineUsersArray = Array.from(onlineUsers.keys());
    console.log("Online users after disconnect:", onlineUsersArray);
    io.emit("onlineusers", onlineUsersArray);
  });
});

server.listen(5000,()=>{
    console.log("server is running on port 5000")
})
