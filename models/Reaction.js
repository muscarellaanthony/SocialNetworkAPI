const { Schema, Types } = require("mongoose");
const newDate = require("../utils/dateFormat");

const reactionSchema = new Schema({
    reactionId: {
        type: Schema.Types.ObjectId,
        default: () => new Types.ObjectId()
    },
    reactionBody: {
        type: String,
        required: true,
        max: [280]
    },
    userName: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: timestamp => newDate(timestamp)
    },
});

module.exports = reactionSchema;
