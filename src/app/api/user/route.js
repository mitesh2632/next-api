import { AuthUser, uploadBase64Img } from "@/app/helper";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { mongoURL } from "../../../../lib/db";
import { User } from "../../../../lib/model/users";

export const GET = async () => {
  let result = [];
  let userInfo;
  try {
    userInfo = await AuthUser();
    await mongoose.connect(mongoURL);

    // result = await User.find().sort({ created_at: -1 });

    result = await User.aggregate([
      {
        $addFields: { blogId: { $toObjectId: "$blog" } },
      },
      {
        $lookup: {
          from: "blogs",
          localField: "blogId",
          foreignField: "_id",
          as: "blogData",
        },
      },
      {
        $unwind: "$blogData",
      },
      {
        $project: {
          name: 1,
          email: 1,
          image: 1,
          password: 1,
          blogData: 1,
        },
      },
    ]);

    return NextResponse.json({ messgae: "Users", result }, { status: 200 });
  } catch (error) {
    if (userInfo) {
      return NextResponse.json({ messgae: error }, { status: 500 });
    } else {
      return NextResponse.json({ messgae: "Unauthorized" }, { status: 401 });
    }
  }
};

export const POST = async (req) => {
  let result = [];
  let userInfo;

  let formFields = await req.formData();
  let { email, name, image, blog } = Object.fromEntries(formFields.entries());
  console.log("req", blog);
  try {
    userInfo = await AuthUser();
    await mongoose.connect(mongoURL);

    const existingdata = await User.findOne({ email });

    if (existingdata) {
      return NextResponse.json(
        { message: "This user is already Exist" },
        { status: 400 }
      );
    }

    let uploadedImage = "";
    if (image) {
      try {
        let uploadLink = await uploadBase64Img(image);
        uploadedImage = uploadLink;
      } catch (e) {
        return NextResponse.json({ e, success: "img upload error found" });
      }
    }

    const newUser = await User.create({
      blog: blog,
      name: name,
      email: email,
      image: uploadedImage,
    });

    result = await newUser.save();
    return NextResponse.json({ message: "CREATED", result }, { status: 201 });
  } catch (error) {
    if (userInfo) {
      return NextResponse.json({ messgae: error }, { status: 500 });
    } else {
      return NextResponse.json({ messgae: "Unauthorized" }, { status: 401 });
    }
  }
};
