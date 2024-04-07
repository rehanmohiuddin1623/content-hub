// server.js
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");

// Define User schema
const User = mongoose.model("User", {
  username: String,
  password: String,
  role: Number, // 'admin' or 'viewer'
});

// Define Blog schema
const Blog = mongoose.model("Blog", {
  title: String,
  content: [Object],
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const app = express();

const corsOptions = {
  origin: process.env.UI_URL, //"http://127.0.0.1:5500", //(https://your-client-app.com)
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(cors(corsOptions));

// Middleware
app.use(express.json());
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60 * 24 * 365,
    },
  })
);

console.log("MONGO URI : ", process.env.MONGO_DB_URI,process.env.UI_URL);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: process.env.DB_NAME,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Authentication middleware
const isAuthenticated = (req, res, next) => {
  console.log("isAuthenticated", req.session.user);
  if (req.session.user) {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};

const isAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.role === 0) {
    next();
  } else {
    res.status(403).json({ message: "Forbidden" });
  }
};

// Routes
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username }).lean().exec();

  if (!user) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  //   req.session.user = user;
  req.session.user = user;
  req.session.save();
  res.json({ message: { ...user } });
});

app.post("/register", async (req, res) => {
  try {
    const { username, password, confirm_password, role = 1 } = req.body;
    if (!username || !password || !confirm_password) {
      res.status(400).json({ message: "Please fill all the fields" });
    }
    if (password !== confirm_password) {
      return res.status(401).json({ message: "Passwords do not match" });
    }
    const user = await User.findOne({ username: username });
    if (user) {
      res.status(500).json({ message: "User Already Exists" });
      return;
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await User.create({ username, password: hashedPassword, role });
    res.status(200).send({ message: "success" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

app.post("/logout", (req, res) => {
  req.session.destroy();
  res.json({ message: "Logout successful" });
});

app.get("/blogs", async (req, res) => {
  const blogs = await Blog.find({}).lean();
  res.json({
    message: blogs,
  });
});

app.post("/blogs", isAuthenticated, isAdmin, async (req, res) => {
  const { title, content } = req.body;
  const blog = new Blog({ title, content, author: req.session.user._id });
  await blog.save();
  res.json(blog);
});

app.get("/blog/:id", async (req, res) => {
  const { id } = req.params;
  const blog = await Blog.findById(id).lean();
  res.json({
    message: blog,
  });
});

// Delete a blog post
app.delete("/blogs/:id", isAuthenticated, isAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await Blog.findByIdAndDelete(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog post not found" });
    }
    res.json({ message: "Blog post deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.put("/blog", isAuthenticated, isAdmin, async (req, res) => {
  const { id, title, content } = req.body;
  try {
    const blog = await Blog.findByIdAndUpdate(id, {
      title,
      content,
    });
    if (!blog) {
      return res.status(404).json({ message: "Blog post not found" });
    }
    res.json({ message: "Blog post updated successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
