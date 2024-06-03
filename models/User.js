const { Schema, model } = require("mongoose");

const userSchema = new Schema({
    userName: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        match: [/.+@.+..+/, 'Must match an email address!']
    },
    thoughts: {
        type: Schema.Types.ObjectId,
        ref: 'thought',
    },
    friends: {
        type: Schema.Types.ObjectId,
        ref: 'user',
    }
},
    {
        toJSON: {
            virtual: true,
        },
        id: false,
    }
);

userSchema.virtual('friendCount').get(function() {
    return this.friends.length
})

const User = model('user', userSchema)


module.exports = User;
