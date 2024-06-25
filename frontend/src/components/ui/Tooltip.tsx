import clsx from "clsx";
import React, { useRef } from "react";

export const Tooltip = ({
  children,
  tooltipText,
  orientation,
  customClass = "bg-gray-200 text-black",
}: {
  children: React.ReactNode;
  tooltipText: string[];
  orientation: string;
  customClass?: string;
}) => {
  const tipRef = useRef<HTMLDivElement>(null);
  const orientations = {
    right: "right",
    top: "top",
    left: "left",
    bottom: "bottom",
  };

  function handleMouseEnter() {
    if (tipRef?.current) tipRef.current.style.opacity = "1";
  }

  function handleMouseLeave(e: any) {
    e.stopPropagation();
    if (tipRef?.current) tipRef.current.style.opacity = "0";
  }

  const setContainerPosition = (orientation: string) => {
    let classnames;

    switch (orientation) {
      case orientations.right:
        classnames = "top-0 left-full ml-4";
        break;
      case orientations.left:
        classnames = "top-0 right-full mr-4";
        break;
      case orientations.top:
        classnames = "bottom-full left-[50%] translate-x-[-50%] -translate-y-2";
        break;
      case orientations.bottom:
        classnames = "top-full left-[50%] translate-x-[-50%] translate-y-2";
        break;

      default:
        break;
    }

    return classnames;
  };

  const setPointerPosition = (orientation: string) => {
    let classnames;

    switch (orientation) {
      case orientations.right:
        classnames = "left-[-6px]";
        break;
      case orientations.left:
        classnames = "right-[-6px]";
        break;
      case orientations.top:
        classnames = "top-full left-[50%] translate-x-[-50%] -translate-y-2";
        break;
      case orientations.bottom:
        classnames = "bottom-full left-[50%] translate-x-[-50%] translate-y-2";
        break;

      default:
        break;
    }

    return classnames;
  };

  const classContainer = ` w-max absolute z-10 ${setContainerPosition(
    orientation
  )} ${customClass} px-4 py-2 rounded flex items-center flex-col transition-all duration-150 pointer-events-none`;

  const pointerClasses = `${customClass} h-3 w-3 absolute z-10 ${setPointerPosition(
    orientation
  )} rotate-45 pointer-events-none`;

  return (
    <div
      className="relative flex items-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={classContainer} style={{ opacity: 0 }} ref={tipRef}>
        <div className={clsx(pointerClasses)} />
        {tooltipText?.map((item: string) => (
          <div>{item}</div>
        ))}
      </div>
      {children}
    </div>
  );
};
