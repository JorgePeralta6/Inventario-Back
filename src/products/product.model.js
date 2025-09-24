import { Schema, Types, model } from "mongoose";
import mongoose from "mongoose";

const ProductSchema = Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    sales: { 
        type: Number,
        default: 0 
    },
    category:{
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    entryDate: {
        type: Date,
        required: true
    },
    expirationDate: {
        type: Date
    },
    image:{
        type: String,
    },
    status: {
        type: Boolean,
        default: true
    }
},
{
    timestamps: true,
    versionKey: false
}
)

export default model ("Product", ProductSchema)