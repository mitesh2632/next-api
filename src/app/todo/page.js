"use client";
import React from "react";
import { useLocalObservable, observer } from "mobx-react-lite";
import authAdminCheck from "../authAdminCheck/authAdminCheck";
import { useDispatch, useSelector } from "react-redux";

const Todo = ({ title }) => {
  // const todo = useLocalObservable(() => ({
  //   id: Math.random(),
  //   title,
  //   finished: false,
  //   toggle() {
  //     this.finished = !this.finished;
  //   },
  // }));
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <div>
      {/* <h2>{todo.title}</h2>
      <p>Status: {todo.finished ? "Finished" : "Not Finished"}</p>
      <button onClick={todo.toggle}>Toggle</button> */}
      <div>
        <div>
          <button
            aria-label="Increment value"
            onClick={() => dispatch(increment())}
          >
            Increment
          </button>
          <span>{count}</span>
          <button
            aria-label="Decrement value"
            onClick={() => dispatch(decrement())}
          >
            Decrement
          </button>
        </div>
      </div>
    </div>
  );
};

export default authAdminCheck(observer(Todo));
