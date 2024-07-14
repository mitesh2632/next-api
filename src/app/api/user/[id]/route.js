import { AuthUser, uploadBase64Img } from "@/app/helper";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { mongoURL } from "../../../../../lib/db";
import { User } from "../../../../../lib/model/users";

export const GET = async (req) => {
  let result = [];
  let userInfo;
  try {
    const id = req.url.split("user/")[1];
    userInfo = await AuthUser();
    await mongoose.connect(mongoURL);

    result = await User.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
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
    // result = await User.findById(id).populate({
    //   path: "blog",
    //   model: "blogs",
    // });

    if (!result) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    if (userInfo) {
      return NextResponse.json({ message: error }, { status: 400 });
    } else {
      return NextResponse.json({ messgae: "Unauthorized" }, { status: 401 });
    }
  }
};

export const DELETE = async (req) => {
  let result = [];
  let userInfo;
  try {
    const id = req.url.split("user/")[1];
    userInfo = await AuthUser();
    await mongoose.connect(mongoURL);

    result = await User.findByIdAndDelete(id);

    if (!result) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User deleted" }, { status: 200 });
  } catch (error) {
    if (userInfo) {
      return NextResponse.json({ message: error }, { status: 400 });
    } else {
      return NextResponse.json({ messgae: "Unauthorized" }, { status: 401 });
    }
  }
};

export const PUT = async (req) => {
  let result = [];
  let userInfo;

  let formFields = await req.formData();
  let { email, name, image } = Object.fromEntries(formFields.entries());
  try {
    const id = req.url.split("user/")[1];
    userInfo = await AuthUser();
    await mongoose.connect(mongoURL);

    const existing = await User.findById(id);

    if (!existing) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    let uploadedImage = "";
    if (image) {
      try {
        let uploadLink = await uploadBase64Img(image);
        uploadedImage = uploadLink;
        existing.image = uploadedImage;
      } catch (e) {
        return NextResponse.json({ e, success: "img upload error found" });
      }
    }

    existing.email = email;
    existing.name = name;

    await existing.save();

    return NextResponse.json(
      { message: "Data Updated", existing },
      { status: 200 }
    );
  } catch (error) {
    if (userInfo) {
      return NextResponse.json({ message: error }, { status: 400 });
    } else {
      return NextResponse.json({ messgae: "Unauthorized" }, { status: 401 });
    }
  }
};
