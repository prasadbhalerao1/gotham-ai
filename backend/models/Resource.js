import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Resource title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Resource description is required'],
    },
    content: {
      type: String,
    },
    type: {
      type: String,
      enum: ['article', 'tutorial', 'video', 'book', 'course', 'dataset', 'tool', 'paper', 'other'],
      required: true,
    },
    category: {
      type: String,
      enum: ['AI', 'Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision', 'Robotics', 'Data Science', 'Other'],
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner',
    },
    image: {
      type: String,
    },
    url: {
      type: String,
    },
    author: {
      type: String,
    },
    tags: [{
      type: String,
    }],
    featured: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    published: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries (slug index is auto-created by unique: true)
resourceSchema.index({ type: 1, category: 1 });
resourceSchema.index({ published: 1, featured: -1 });
resourceSchema.index({ tags: 1 });

const Resource = mongoose.model('Resource', resourceSchema);

export default Resource;
