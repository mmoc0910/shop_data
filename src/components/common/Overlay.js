import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFocus } from "store/search/search-slice";
import classNames from "utils/classNames";

const Overlay = () => {
  const dispatch = useDispatch();
  const { isFocus } = useSelector((state) => state.search);
  return (
    <div
      className={classNames(
        "fixed inset-0 z-10 w-screen h-screen bg-text1 bg-opacity-60 dark:bg-darkbg dark:bg-opacity-80",
        isFocus ? "" : "hidden"
      )}
      onClick={() => dispatch(setFocus(false))}
    ></div>
  );
};

export default Overlay;
