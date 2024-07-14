"use client";
import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./app/todo/counterSlice";

export default configureStore({
  reducer: {
    counter: counterReducer,
  },
});
