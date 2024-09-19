import {model, Schema} from 'mongoose'

const userSchema = new Schema(
    {
        username: {
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
        password: {
            type: String,
            select: false, // fa in modo che non venga mai selezionata la password        

        },
        verifiedAt: Date,
        verificationCode: String,
    },
    {collection: "users", timestamps: true}
)
export default model("User", userSchema)