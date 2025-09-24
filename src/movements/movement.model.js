import { Schema, model } from 'mongoose';

const MovementSchema = Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, 'You must add at least 1 product.']
    },
    employee: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reason: {
        type: String
    },
    destiny: {
        type: String
    },
    date:{
        type: Date,
        default: Date.now
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

export default model('Movement', MovementSchema)