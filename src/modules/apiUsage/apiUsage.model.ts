import mongoose from "mongoose";

const apiRouteUsageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    apiKeyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ApiKey",
      required: true,
      index: true,
    },

    date: {
      type: String, // "2026-02-21"
      required: true,
      index: true,
    },

    hour: {
      type: Number, // 0-23
      required: true,
    },

    totalRequests: {
      type: Number,
      default: 0,
    },

    errorCount: {
      type: Number,
      default: 0,
    },

    endpointBreakdown: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  { timestamps: true },
);

apiRouteUsageSchema.index({ userId: 1, date: 1, hour: 1 });

export default mongoose.model("ApiRouteUsage", apiRouteUsageSchema);
