const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Messages=require('../models/Message')

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
   console.log(req.body)
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // Create JWT
    const token = jwt.sign({ id: newUser._id }, 'mahesh18', {
      expiresIn: "10d",
    });

    console.log(newUser)

    res.status(200).json({
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User does not exist" });

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    // JWT token
    const token = jwt.sign({ id: user._id }, 'mahesh18', {
      expiresIn: "10d",
    });

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};


const searchUser = async (req, res) => {
  try {
    const { username } = req.query;
    console.log(username)
    if (!username || username.trim() === "") {
      return res.status(400).json({ message: "Username query is required" });
    }

    // Case-insensitive & partial match
    const users = await User.find({
      name: { $regex: username, $options: "i" }
    }).select("name email _id");
    console.log(users)
    

    res.json(users);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const addfrnd= async(req,res)=>{
    try{
       const {userid}=req.body
       const user1=await User.findById(req.user.id)
       if(userid===req.user.id){
        return res.status(400).json({ message: "User cannot add himself" });
       }
       if (user1.friends.includes(userid)) {
    return res.status(400).json({ message: "User already added as friend" });
  }
       user1.friends.push(userid)
       await user1.save()
       console.log(user1)

       const user2=await User.findById(userid)
       if (user2.friends.includes(req.user.id)) {
    return res.status(400).json({ message: "User already added as friend" });
  }
       user2.friends.push(req.user.id)
       await user2.save()
       console.log(user2)

       return res.status(200).json({msg:"user added succesfully"})
    }
    catch(err){
        console.log(err)
        res.status(500).json({ message: "Server error" });
    }
}

const getFrnds = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("friends", "name _id"); 
    
   
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (user.friends.length > 0) {
      return res.status(200).json({ friends: user.friends });
    } else {
      return res.status(200).json({ friends: [], msg: "No friends added yet" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


const sendMsg=async (req,res)=>{
   try {
     
    const {userid,msg}=req.body
   console.log(req.body)
    const message=new Messages({
        message:msg,
        senderId:req.user.id,
        receiverId:userid
    })
    

    await message.save()

    

   } catch (error) {
       console.error(err);
    res.status(500).json({ message: "Server error" });
   }  
}

const getallmsg = async (req, res) => {
  try {
    const { userid } = req.body; 
    

    const messages = await Messages.find({
      $or: [
        { senderId: req.user.id, receiverId: userid },
        { senderId: userid, receiverId: req.user.id } // 👈 include reverse
      ]
    }).sort({ createdAt: 1 }); // sort oldest → newest

    
    if (!messages.length) {
      return res.status(404).json({ message: "No messages found" });
    }

    res.status(200).json(messages );
  } catch (error) {
    console.error("Error fetching messages:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};



module.exports = { registerUser, loginUser,searchUser,addfrnd ,getFrnds,sendMsg  ,getallmsg };
