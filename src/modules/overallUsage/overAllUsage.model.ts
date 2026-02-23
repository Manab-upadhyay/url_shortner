import mongoose from "mongoose";

const usageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    month: {
      type: Number, // 0-11
      required: true,
    },

    year: {
      type: Number,
      required: true,
    },

    apiRequests: {
      type: Number,
      default: 0,
    },

    linksCreated: {
      type: Number,
      default: 0,
    },

    totalClicks: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

usageSchema.index({ userId: 1, month: 1, year: 1 }, { unique: true });

export default mongoose.model("Usage", usageSchema);
