const mongoose = require("mongoose");

const postType = ['Thoughts','Questions', 'Interviews', 'Research', 'Campaign','Videos','Links'];
const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required:true
    },
    title: {
      type: String,
      required:true
    },
    content: {
      type: String,
      required:true
    },
    type:{
      type:String,
      required:true
    },
    comments: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
    }],
    shares: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post'
    }],
    tags: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tag'
    }],
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Like'
    }],
    likesCount: {
      type: Number,
      default:0
    },
    type: {
      type: String,
      enum: postType,
      default: 'thought',
  },
  },
  {
    timestamps: true
  }
);

postSchema.method({
  transform(){
    const transformed = {};
    const fields = ["userId","title","content","type","likes"];
    fields.forEach(field => {
      transformed[field] = this[field];
    });
    return transformed;
  }
})

postSchema.static({
  async get(id){
    try{
     let post;
     if(mongoose.Types.ObjectId.isValid(id)){
       post = await this.findById(id).exec();
     } 
     if(post){
       return post;
     }
     throw new APIError({
       message:'post does not exists',
       status :httpStatus.NOT_FOUND
     })
    }catch(error){
      throw(error)
    }
  },
})


/**
 * @typedef Post
 */
module.exports = mongoose.model('Post', postSchema);
