import mongoose from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends mongoose.Document {
  email: string;
  password?: string;
  name: string;
  tokenversion: number;
  plan: "free" | "pro";
  createdAt: Date;
  updatedAt: Date;
  bio : string ; 
  avatar: string;
  avatarPublicId: string;
  provider: "local" | "google";
  googleId?: string;
  preferences : {
    emailNotification : boolean ; 
    marketingEmailNotification : boolean 
  }
}

const userSchema = new mongoose.Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, index: true },
    password: { 
      type: String, 
      required: function (this: IUser) {
        return this.provider === "local";
      },
      minlength: 6 
    },
    name: { type: String, required: true, trim: true },
    tokenversion: { type: Number, default: 0 },
    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local"
    },
    googleId: {
      type: String,
      sparse: true,
      unique: true
    },
    plan: {
      type: String,
      enum: ["free", "pro"],
      default: "free",
    },
    bio : {
      type : String , 
      default : ""
    } , 
    avatar: {
      type: String,
      default: "",
    },
    avatarPublicId: {
      type: String,
      default: "",
    },
    preferences : {
      emailNotification : {
        type : Boolean , 
        default : true
      } , 
      marketingEmailNotification : {
        type : Boolean , 
        default : false
      }
    }
    
  },
  {
    timestamps: true,
  },
);
userSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) return;

  this.password = await bcrypt.hash(this.password, 10);
});

export default mongoose.model<IUser>("User", userSchema);
