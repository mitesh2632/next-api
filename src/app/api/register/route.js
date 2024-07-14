import { NextResponse } from "next/server";
import validator from "validator";
import bcrypt from "bcrypt";
import { mongoURL } from "../../../../lib/db";
import { uploadBase64Img } from "@/app/helper";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { User } from "../../../../lib/model/users";

export const POST = async (request) => {
  var result = [];
  try {
    let formFields = await request.formData();
    const {
      name,
      email,
      password,
      facebook_token,
      google_token,
      apple_token,
      image,
    } = Object.fromEntries(formFields.entries());

    if (facebook_token == null && google_token == null && apple_token == null) {
      if (!name || !email) {
        return NextResponse.json(
          { msg: "invalid fields", success: false },
          { status: 400 }
        );
      }
    }

    if (facebook_token == null && google_token == null && apple_token == null) {
      if (!validator.isEmail(email)) {
        return new NextResponse(
          JSON.stringify({ msg: "Invalid email address", success: false }),
          { status: 400 }
        );
      }
    }

    await mongoose.connect(mongoURL);

    let uploadedImage = "";
    if (image) {
      try {
        let uploadLink = await uploadBase64Img(image);
        uploadedImage = uploadLink;
      } catch (e) {
        return NextResponse.json({ e, success: "img upload error found" });
      }
    }
    console.log("uploadedImage", uploadedImage);

    if (facebook_token == null && google_token == null && apple_token == null) {
      const record = { email: email };

      const is_user = await User.findOne(record);
      if (is_user) {
        return NextResponse.json(
          { msg: "user is already exists", success: false },
          { status: 409 }
        );
      } else {
        const hasshPassword = await bcrypt.hash(password, 10);
        let storedData = {
          name,
          email,
          password: hasshPassword,
          image: uploadedImage,
        };

        let user = new User(storedData);
        let userInfo = await user.save();
        let user_id = userInfo._id;

        const scrkey = process.env.JWT_SECRET;
        result = jwt.sign({ name, email, user_id }, scrkey);

        return NextResponse.json(
          { user: userInfo, token: result, success: true },
          { status: 200 }
        );
      }
    } else {
      if (facebook_token) {
        const recordForFacebook = { facebook_token: facebook_token };
        const findFacebookUser = await User.findOne(recordForFacebook);

        if (findFacebookUser) {
          const name = findFacebookUser.name;
          const email = findFacebookUser.email;
          const id = findFacebookUser.id;
          const srcky = process.env.JWT_SECRET;

          let token = jwt.sign({ name, email, facebook_token, id }, srcky);

          return NextResponse.json(
            {
              user: findFacebookUser,
              token: token,
              success: true,
            },
            { status: 200 }
          );
        } else {
          let storeData = {
            facebook_token: facebook_token,
            name: name,
            email: email,
          };
          let user = new User(storeData);
          let userinfo = await user.save();
          let id = userinfo._id;
          const srcky = process.env.JWT_SECRET;
          result = jwt.sign({ name, email, facebook_token, id }, srcky);

          return NextResponse.json(
            { user: userinfo, token: result },
            { status: 200 }
          );
        }
      }
      if (google_token) {
        const recordForGoogle = { google_token: google_token };
        const findGoogleUser = await User.findOne(recordForGoogle);

        //already register by this token
        if (findGoogleUser) {
          const name = findGoogleUser.name;
          const email = findGoogleUser.email;
          const id = findGoogleUser.id;
          const srcky = process.env.JWT_SECRET;

          let token = jwt.sign({ name, email, google_token, id }, srcky);

          return NextResponse.json(
            {
              user: findGoogleUser,
              token: token,
              success: true,
            },
            { status: 200 }
          );
        } else {
          let storeData = {
            google_token: google_token,
            name: name,
            email: email,
          };
          let user = new User(storeData);
          let userinfo = await user.save();
          let id = userinfo._id;
          const srcky = process.env.JWT_SECRET;
          result = jwt.sign({ name, email, google_token, id }, srcky);
          return NextResponse.json(
            {
              user: userinfo,
              token: result,
              success: true,
            },
            { status: 200 }
          );
        }
      }
      if (apple_token) {
        const recordForApple = { apple_token: apple_token };
        const findAppleUser = await User.findOne(recordForApple);

        //already register by this token
        if (findAppleUser) {
          const name = findAppleUser.name;
          const email = findAppleUser.email;
          const id = findAppleUser.id;
          const srcky = process.env.JWT_SECRET;

          let token = jwt.sign({ name, email, apple_token, id }, srcky);
          return NextResponse.json(
            { user: findAppleUser, token: token, success: true },
            { status: 200 }
          );
        } else {
          let storeData = {
            apple_token: apple_token,
            name: name,
            email: email,
          };
          let user = new User(storeData);
          let userinfo = await user.save();
          let id = userinfo._id;
          const srcky = process.env.JWT_SECRET;
          result = jwt.sign({ name, email, apple_token, id }, srcky);
          return NextResponse.json(
            {
              user: userinfo,
              token: result,
              success: true,
            },
            { status: 200 }
          );
        }
      }
    }
  } catch (error) {
    return NextResponse.json(error);
  }
  console.log("result", result);
  return NextResponse.json(result);
};
