import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Event title is required"],
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
      required: [true, "Event description is required"],
    },
    content: {
      type: String,
      required: [true, "Event content is required"],
    },
    date: {
      type: Date,
    },
    dateDisplay: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    gallery: [
      {
        type: String,
      },
    ],
    attendees: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      enum: [
        "Technology",
        "Gaming",
        "Networking",
        "Workshop",
        "Seminar",
        "Security",
        "Other",
      ],
    },
    speakers: [
      {
        name: String,
        title: String,
        bio: String,
        image: String,
      },
    ],
    registrationLink: {
      type: String,
    },
    published: {
      type: Boolean,
      default: true,
    },
    galleryOnly: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// Index for faster queries (slug index is auto-created by unique: true)
eventSchema.index({ date: -1 });
eventSchema.index({ published: 1 });

const Event = mongoose.model("Event", eventSchema);

export default Event;
