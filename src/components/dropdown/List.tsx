import { FC, ReactNode } from "react";
import { useDropdown } from "./dropdown-context";
import classNames from "../../utils/classNames";

interface ListProps {
  children: ReactNode;
}

const List: FC<ListProps> = ({ children }) => {
  const { show } = useDropdown();
  return (
    <>
      {show && (
        <div
          className={classNames(
            "absolute left-0 z-20 w-full bg-white rounded-lg shadow-lg border border-strock top-full max-h-[220px] xl:max-h-[250px] overflow-y-auto scroll-hidden"
          )}
        >
          {children}
        </div>
      )}
    </>
  );
};

export default List;
