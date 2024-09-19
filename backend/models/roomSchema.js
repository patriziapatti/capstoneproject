import {model, Schema} from 'mongoose'

const roomSchema = new Schema(
    {
        roomNumber: {
            type: Number,
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
    },
    {collection: "rooms", timestamps: true}
)
export default model("Room", roomSchema)