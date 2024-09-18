const express = require('express');
const cors = require('cors');
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const authRoute = require("./router/auth");
const userRoute = require("./router/user");
const postRoute = require("./router/post");
const imageRoute = require("./router/media")
const shortRoute = require("./router/short")
const cmtRoute = require("./router/cmt")
const musicRoute = require("./router/music")
dotenv.config();
mongoose.set('strictQuery', true);
const mongoURI = process.env.MONGODB_URI;
const app = express();

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch(error => console.error("Error connecting to MongoDB:", error));

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

app.use(cors());
app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/v1/auth", authRoute);
app.use("/v1/user", userRoute);
app.use("/v1/post", postRoute);
app.use("/v1/short", shortRoute);
app.use("/v1/image",imageRoute);
app.use("/v1/cmt", cmtRoute);
app.use("/v1/music", musicRoute);


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
});
app.use(cors({
    origin: '*', // Hoặc chỉ định cụ thể origin của bạn
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
