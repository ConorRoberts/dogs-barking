import * as SelectPrimitive from "@radix-ui/react-select";
import { FC } from "react";

interface OptionProps extends SelectPrimitive.SelectItemProps {
  value: string;
  label: string;
}

const Option: FC<OptionProps> = ({ value, label, disabled, ...props }) => {
  return (
    <SelectPrimitive.Item
      value={value}
      className={`cursor-pointer hover:bg-indigo-50 transition duration-75 outline-none px-4 py-1 select-none capitalize ${
        disabled ? "opacity-50" : ""
      }`}
      {...props}
    >
      <SelectPrimitive.ItemText>{label}</SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator />
    </SelectPrimitive.Item>
  );
};

export default Option;
