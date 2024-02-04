import React from "react";
import Proptypes from "prop-types";

const IconCategory = ({ size = "small" }) => {
  return (
    <>
      {size === "small" ? (
        <svg
          width={16}
          height={12}
          viewBox="0 0 16 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5.8775 1.5L7.3775 3H14V10.5H2V1.5H5.8775ZM6.5 0H2C1.175 0 0.5075 0.675 0.5075 1.5L0.5 10.5C0.5 11.325 1.175 12 2 12H14C14.825 12 15.5 11.325 15.5 10.5V3C15.5 2.175 14.825 1.5 14 1.5H8L6.5 0Z"
            fill="currentColor"
          />
        </svg>
      ) : (
        <svg
          width={20}
          height={16}
          viewBox="0 0 20 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.17 2L9.17 4H18V14H2V2H7.17ZM8 0H2C0.9 0 0.00999999 0.9 0.00999999 2L0 14C0 15.1 0.9 16 2 16H18C19.1 16 20 15.1 20 14V4C20 2.9 19.1 2 18 2H10L8 0Z"
            fill="currentcolor"
          />
        </svg>
      )}
    </>
  );
};

IconCategory.propTypes = {
  size: Proptypes.oneOf(["small", "big"]),
};

export default IconCategory;
