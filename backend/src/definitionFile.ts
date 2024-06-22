import { Request } from "express";
export interface ModifiedRequest extends Request {
  user: {
    _id: string;
    name: string;
  }; // or any other type
}
