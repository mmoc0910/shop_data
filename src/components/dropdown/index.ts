import Dropdown, { DropdownProps } from "./Dropdown";
import Option from "./Option";
import Search from "./Search";
import Select from "./Select";
import List from "./List";
import React from "react";

interface DropdownWithComponents extends React.FC<DropdownProps> {
  Option: typeof Option;
  Search: typeof Search;
  Select: typeof Select;
  List: typeof List;
}

const DropdownWithComponents: DropdownWithComponents = Dropdown as DropdownWithComponents;
DropdownWithComponents.Option = Option;
DropdownWithComponents.Search = Search;
DropdownWithComponents.Select = Select;
DropdownWithComponents.List = List;

export { DropdownWithComponents };
