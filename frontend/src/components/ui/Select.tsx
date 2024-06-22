import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";

const Select = ({
  value,
  setValue,
  options,
  label,
}: {
  value: any;
  setValue: any;
  options: any;
  label: string;
}) => {
  const [open, setOpen] = useState(false);
  const optionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: any) => {
      if (optionRef && !optionRef?.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  return (
    <div className="w-full relative">
      <div className="text-sm absolute top-[-1.2rem] left-0 pl-1 text-gray-400">
        {label}
      </div>
      <div
        onClick={() => {
          setOpen((prev) => !prev);
        }}
        ref={optionRef}
        className={clsx(
          open ? "rounded-t-md" : "rounded-md",
          "flex items-end justify-between capitalize cursor-pointer bg-[#121212]  px-4 py-3   w-full gap-"
        )}
      >
        {value?.label || label}{" "}
        <IoIosArrowDown className={open ? "-rotate-180" : ""} size={18} />{" "}
      </div>
      <div
        className={clsx(
          open ? "flex" : "hidden",
          "flex-col items-start capitalize cursor-pointer  overflow-hidden rounded-b-md w-full "
        )}
      >
        {options?.map((item: any) => (
          <div
            className={clsx(
              item.value === value.value ? "bg-[#1a1919]" : "",
              "w-full bg-[#121212] hover:bg-[#1a1919] py-3 px-4"
            )}
            onClick={() => {
              setValue(item);
            }}
          >
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Select;
