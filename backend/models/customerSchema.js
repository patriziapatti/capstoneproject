import {model, Schema} from 'mongoose'

const customerSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        surname: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        phone: {
            type: Number,
            required: true,
        },
        dateOfBirth: {
            type: Date,
            required: true,
        },
        bookings: [{
            type: Schema.Types.ObjectId,
            ref: 'Booking',
        }],
    },
    {collection: "customers", timestamps: true}
)
export default model("Customer", customerSchema)