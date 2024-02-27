import { ReactNode, createContext, useContext } from "react";

type DropdownContextValue = {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  toggle: () => void;
};
const DropdownContext = createContext<DropdownContextValue | undefined>(
  undefined
);

interface DropdownProviderProps {
  children: ReactNode;
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  toggle: () => void;
}

function DropdownProvider({ children, ...props }: DropdownProviderProps) {
  return (
    <DropdownContext.Provider value={props}>
      {children}
    </DropdownContext.Provider>
  );
}
function useDropdown() {
  const context = useContext(DropdownContext);
  if (typeof context === "undefined")
    throw new Error("useDropdown must be used within DropdownProvider");
  return context;
}
// eslint-disable-next-line react-refresh/only-export-components
export { useDropdown, DropdownProvider };
