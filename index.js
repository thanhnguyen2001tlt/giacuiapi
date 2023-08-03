const express = require("express");
const mongoose = require("mongoose");
const app = express();
app.use(express.json());
const db = require("./config/key").mogoURI;
mongoose.set('strictQuery', false);
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log("MongoDB Connected....")).catch((err) => console.log(err));

// Thiết lập tiêu đề CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE"); // Thêm "PUT" vào danh sách phương thức cho phép
  next();
});


app.use("/api/", require("./router/customerRouter"));
app.use("/api/", require("./router/employeeRouter"));
app.use("/api/", require("./router/ingredientRouter"));
app.use("/api/", require("./router/serviceRouter"));
app.use("/api/", require("./router/orderRouter"));
app.use("/api/", require("./router/orderDetailRouter"));

const PORT = process.env.PORT || 8080;
app.listen(PORT);
