import { NextResponse } from "next/server";
import { mongoURL } from "../../../../lib/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../../../../lib/model/users";
import mongoose from "mongoose";

export const POST = async (request) => {
  try {
    let formFields = await request.formData();
    let { email, password } = Object.fromEntries(formFields.entries());
    if (!email || !password) {
      return NextResponse.json(
        { msg: "invalid fields", success: false },
        { status: 400 }
      );
    }
    await mongoose.connect(mongoURL);
    const srcky = process.env.JWT_SECRET;
    const user = await User.findOne({ email: email });

    if (user) {
      let id = user.id;

      let is_user = await bcrypt.compare(password, user.password);
      if (is_user) {
        let token = jwt.sign({ email, id }, srcky, { expiresIn: "1h" });
        return NextResponse.json(
          { user, success: true, token: token },
          { status: 200 }
        );
      }
    }
  } catch (error) {
    return NextResponse.json(error);
  }

  return NextResponse.json(
    { msg: "Email or Password is incorrect", success: false },
    { status: 401 }
  );
};
