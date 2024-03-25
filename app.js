/**
 * Created by;
 * User: Francis Mogbana
 * Date: 23/03/2024
 */

import "dotenv/config";
import express from "express";
import { connectDb } from './database/mongoose.js';
import notFound from './middlewares/not_found.js';
import authRouter from'./routes/auth.js';
import orderRouter from './routes/order.js';
import productRouter from './routes/product.js';
import reviewRouter from './routes/review.js';
import userRouter from './routes/user.js';
import categoryRouter from './routes/category.js';
import cartRouter from './routes/cart.js';
import cors from 'cors';
import xss from 'xss-clean';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import fieUpload from 'express-fileupload';
import rateLimiter from 'express-rate-limit';
import { authMiddleware } from './middlewares/auth.js';
import mongoSanitize from 'express-mongo-sanitize';


// initliaze express app
export const app = express();


// middlewares 

app.set('trust proxy', 1);

// limiting the number of requests to our api
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
);

// security
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(mongoSanitize());

// serving static files
app.use(express.static('./views'));

// parsing json data
app.use(express.json());


// parsing form data
app.use(express.urlencoded({extended:true}));

// cookie parser
app.use(cookieParser(process.env.JWT_SECRET));

// file upload middleware to upload images
app.use(fieUpload());


// routes
app.get("/",(req,res)=>{
    return res.render("index.html");
});

// routes 
app.use("/api/v1/auth",authRouter);
app.use("/api/v1/orders",orderRouter);
app.use("/api/v1/products",productRouter);
app.use("/api/v1/category",categoryRouter);
app.use("/api/v1/reviews",reviewRouter);
app.use("/api/v1/carts",cartRouter);
app.use("/api/v1/users",authMiddleware,userRouter);


// not found middleware
app.use(notFound);  

const port = process.env.PORT || 6000;


// starting point of the server
let main = async ()=>{  
  try {
    await connectDb(process.env.MONGODB_URL);
    app.listen(port, () => {
        console.log('Server is running on http://localhost:' + port);
    });
  } catch (error) {
      console.log(error);    
  }
}

main();

export default app;