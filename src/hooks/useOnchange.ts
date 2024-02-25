import { useState } from "react";

export default function useOnchange() {
  const [value, setValue] = useState("");
  const handleSetValue = (e: any) => {
    setValue(e.target.value);
  };
  return [value, handleSetValue];
}
