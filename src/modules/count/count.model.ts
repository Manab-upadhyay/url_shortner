import mongoose from "mongoose";
export interface ICount extends mongoose.Document {
  linkId: mongoose.Types.ObjectId;
  ip: string;
  location?: {
    regionName: String;
    countryName: string;
  };
  userAgent?: string;
}
const countSchema = new mongoose.Schema<ICount>(
  {
    linkId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Link",
      required: true,
      index: true,
    },
    ip: {
      type: String,
      required: true,
    },
    location: {
      regionName: { type: String },
      countryName: { type: String },
      city: { type: String },
    },
    userAgent: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);
export default mongoose.model<ICount>("Count", countSchema);
