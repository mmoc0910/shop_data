import { ReactNode, useRef, useState } from "react";
import { DropdownProvider } from "./dropdown-context";
import useOnClickOutside from "../../hooks/useOnClickOutside";
// Define type for props passed to Dropdown component
export interface DropdownProps {
  children: ReactNode;
  // You can add other props if needed
}
const Dropdown: React.FC<DropdownProps> = ({ children, ...props }) => {
  const ref = useRef<HTMLDivElement>(null); // Ref now has a specific type of HTMLDivElement
  const [show, setShow] = useState<boolean>(false);
  useOnClickOutside(ref, () => setShow(false));
  const toggle = () => {
    setShow(!show);
  };

  return (
    <DropdownProvider {...props} show={show} setShow={setShow} toggle={toggle}>
      <div className="relative inline-block w-full" ref={ref}>
        {children}
      </div>
    </DropdownProvider>
  );
};

export default Dropdown;
