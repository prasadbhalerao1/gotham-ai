import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    shortDescription: {
      type: String,
      required: true,
      trim: true,
    },
    overview: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["In Progress", "Documentation Phase", "Completed", "On Hold"],
      default: "In Progress",
    },
    industryPartner: {
      type: String,
      required: true,
      trim: true,
    },
    source: {
      type: String,
      required: true,
    },
    sourceLink: {
      type: String,
    },
    keyCapabilities: [
      {
        type: String,
        trim: true,
      },
    ],
    projectTeam: [
      {
        name: { type: String, required: true, trim: true },
        role: { type: String, required: true, trim: true },
      },
    ],
    gallery: [
      {
        type: String,
      },
    ],
    disableDetail: {
      type: Boolean,
      default: false,
    },
    heroImage: {
      type: String,
      default: "/img/about.webp",
    },
    featured: {
      type: Boolean,
      default: true,
    },
    published: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

projectSchema.index({ featured: 1 });
projectSchema.index({ published: 1 });

const Project = mongoose.model("Project", projectSchema);

export default Project;
