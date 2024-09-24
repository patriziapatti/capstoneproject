import {model, Schema} from 'mongoose'

const roomSchema = new Schema(
    {
        roomNumber: {
            type: Number,
            unique: true,
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            required: true,
            enum: ['available', 'occupied'],
            default: 'available'
        },
        maxPax:{
            type: Number,
            required: true
        }
    },
    {collection: "rooms", timestamps: true}
)
export default model("Room", roomSchema)