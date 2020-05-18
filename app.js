const express = require("express");
const app = express();
const port = process.env.PORT;
var bodyParser = require("body-parser");

//db connection
require("./src/config/mongoose");

//routers
//const indexRouter = require("./src/routers/index"); we will get everything in here.
const userRouter = require("./src/routers/user");
const categoryRouter = require("./src/routers/category");
const blogRouter = require("./src/routers/blog");

app.use(bodyParser.json());


//routers are using here
//app.use(indexRouter); we will get everything in here.
app.use(userRouter);
app.use(categoryRouter);
app.use(blogRouter);

app.listen(port, () => {
    console.log(`App started on ${port}`);
});