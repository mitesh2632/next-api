import { NextResponse } from "next/server";
import { addPost, getPosts } from "../../../../lib/data";
import { mongoURL } from "../../../../lib/db";
import mongoose from "mongoose";
import { Blog } from "../../../../lib/model/blogs";
import { AuthUser } from "@/app/helper";

export const GET = async (req) => {
  let result = [];
  let userInfo;
  try {
    userInfo = await AuthUser();
    await mongoose.connect(mongoURL);

    result = await Blog.find().sort({ created_at: -1 });

    return NextResponse.json({ message: "OK", result }, { status: 200 });
  } catch (error) {
    result = error;
    if (userInfo) {
      return NextResponse.json({ message: "Error", error }, { status: 500 });
    } else {
      return NextResponse.json(
        { message: "Unauthorized", error },
        { status: 401 }
      );
    }
  }
};

export const POST = async (req) => {
  let result = [];
  let userInfo;

  const { title, desc } = await req.json();
  try {
    userInfo = await AuthUser();
    await mongoose.connect(mongoURL);

    const existingdata = await Blog.findOne({ title, desc });

    if (existingdata) {
      return NextResponse.json(
        { message: "This blog is already Exist" },
        { status: 400 }
      );
    }

    const blogs = await Blog.create({ title: title, desc: desc });
    result = await blogs.save();
    return NextResponse.json({ message: "CREATED", result }, { status: 201 });
  } catch (error) {
    if (userInfo) {
      return NextResponse.json({ message: "Error", error }, { status: 500 });
    } else {
      return NextResponse.json(
        { message: "Unauthorized", error },
        { status: 401 }
      );
    }
  }
};
