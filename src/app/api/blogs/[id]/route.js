import { NextResponse } from "next/server";
import { deletePost, getPostById, updatePost } from "../../../../../lib/data";
import mongoose from "mongoose";
import { mongoURL } from "../../../../../lib/db";
import { Blog } from "../../../../../lib/model/blogs";
import { AuthUser } from "@/app/helper";

export const GET = async (req) => {
  let result = [];
  let userInfo;
  try {
    userInfo = await AuthUser();
    const id = req.url.split("blogs/")[1];
    await mongoose.connect(mongoURL);

    result = await Blog.findById(id);

    if (result == "" || result == null) {
      return NextResponse.json({ message: "NOT FOUND" }, { status: 404 });
    }
    return NextResponse.json(
      { message: "Data Getted", result },
      { status: 200 }
    );
  } catch (error) {
    result = error;
    if (userInfo) {
      return NextResponse.json({ message: result, error }, { status: 500 });
    } else {
      return NextResponse.json(
        { message: "Unauthorized", error },
        { status: 401 }
      );
    }
  }
};

export const DELETE = async (req) => {
  let result = [];
  let userInfo;
  try {
    userInfo = await AuthUser();
    const id = req.url.split("blogs/")[1];
    await mongoose.connect(mongoURL);

    result = await Blog.findByIdAndDelete(id);

    if (result == "" || result == null) {
      return NextResponse.json({ message: "NOT FOUND" }, { status: 404 });
    }

    return NextResponse.json({ message: "Data Deleted" }, { status: 200 });
  } catch (error) {
    if (userInfo) {
      return NextResponse.json({ message: result, error }, { status: 500 });
    } else {
      return NextResponse.json(
        { message: "Unauthorized", error },
        { status: 401 }
      );
    }
  }
};

export const PUT = async (req) => {
  const { title, desc } = await req.json();
  let userInfo;
  try {
    userInfo = await AuthUser();
    const id = req.url.split("blogs/")[1];
    await mongoose.connect(mongoURL);

    const existingdata = await Blog.findById(id);
    console.log();
    if (!existingdata) {
      return NextResponse.json({ message: "NOT FOUND" }, { status: 404 });
    }
    existingdata.title = title;
    existingdata.desc = desc;

    await existingdata.save();

    return NextResponse.json(
      { message: "Data Updated", existingdata },
      { status: 200 }
    );
  } catch (error) {
    if (userInfo) {
      return NextResponse.json({ message: result, error }, { status: 500 });
    } else {
      return NextResponse.json(
        { message: "Unauthorized", error },
        { status: 401 }
      );
    }
  }
};
