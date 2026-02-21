import mongoose from "mongoose";

const apiKeySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    prefix: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    keyHash: {
      type: String,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    rateLimitPerMinute: {
      type: Number,
      default: 60,
    },

    lastUsedAt: {
      type: Date,
    },

    expiresAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

export default mongoose.model("ApiKey", apiKeySchema);
