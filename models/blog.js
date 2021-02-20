const mongoose = require('mongoose');
const { Schema } = mongoose;

const blogSchema = new Schema({
    title: String,
    body: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    mood: String
})

blogSchema.virtual('description').get(function() {
    return this.body.substring(0, 500);
})

const Blog = mongoose.model('Blog', blogSchema);
module.exports = Blog;