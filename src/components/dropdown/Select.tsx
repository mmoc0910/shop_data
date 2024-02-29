import { ReactNode } from "react";
import { useDropdown } from "./dropdown-context";

const Select = ({
  placeholder = "",
  className = "",
}: {
  placeholder: ReactNode;
  className?: string;
}) => {
  const { toggle, show } = useDropdown();
  return (
    <div
      className={`flex items-center justify-between py-[15px] px-[25px] bg-inherit border border-strock rounded-lg cursor-pointer text-sm font-medium ${className}`}
      onClick={toggle}
    >
      <div className="capitalize line-clamp-1">{placeholder}</div>
      <span className="text-icon-color">
        {show ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 15l7-7 7 7"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        )}
      </span>
    </div>
  );
};

export default Select;
