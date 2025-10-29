const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, // basic email pattern
        unique: true // Each user should have a unique email
    },
    password: { // You should store a hashed password, not plain text
        type: String,
        required: true
    }
});

const userModel = mongoose.model("expese-tracker-users", userSchema);
module.exports = userModel;
