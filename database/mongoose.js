/**
 * Created by;
 * User: Francis Mogbana
 * Date: 23/03/2024
 */

import  {connect, set} from'mongoose';
set('strictQuery', true);

export const connectDb = (dbURI = process.env.MONGODB_URL)=>{
            connect(dbURI,{useNewUrlParser:true, useUnifiedTopology:true}).then((result)=>console.log("connected to db " +  result.connections[0].name)
        ).catch((err)=>console.log(err));
}

export default connectDb;