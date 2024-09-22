import {model, Schema} from 'mongoose'

const bookingSchema = new Schema(
    {
        customer: {
            type: Schema.Types.ObjectId,
            ref: 'Customer',
        },
        room: {
            type: Schema.Types.ObjectId,
            ref: 'Room',
        },
        checkInDate: {
            type: Date,
            required: true,
        },
        checkOutDate: {
            type: Date,
            required: true,
        },
        pax: {
            adults: {
                type: Number,
                required: true,  
            },
            children: {
                type: Number,
                required: true
            },
        },

        status: {
            type: String,
            required: true,
            enum: ['reserved', 'checkedIn','checkedOut'],
            default: 'reserved'
        },
        totalPrice: {
            type: Number
        }

    },
    {collection: "bookings", timestamps: true}
)
export default model("Booking", bookingSchema)