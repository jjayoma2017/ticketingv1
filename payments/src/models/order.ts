import mongoose from "mongoose";
import { OrderStatus } from "@jtjticketing/common";

interface OrderAttrs {
  id: string;
  version: number;
  userId: string;
  price: number;
  status: OrderStatus;
}

interface OrderDoc extends mongoose.Document {
  version: number;
  userId: string;
  price: number;
  status: OrderStatus;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true;
    },
    price:{
        type: number,
        required: true
    },
    status:{
        type: string,
        required: true
    }
},{
    toJSON:{
        transform(doc, ret){
            ret.id = ret._id;
            delete ret._id;
        }
    }
})

orderSchema.statics.build = (attrs: OrderAttrs) =>{
    return new Order({
        _id: attrs.id,
        version: attrs.version,
        price: attrs.price,
        userId: attrs.userId,
        status: attrs.status,
    })
}

const Order = mongoose.model<OrderDoc, OrderModel>('Order',orderSchema);
export {Order};