import clsx from "clsx";
import loader from "../../assets/loaders/spinner.svg";

export const Button = ({
  onClick,
  children,
  className,
  loading = false,
  disabled = false,
}: {
  onClick: any;
  children: React.ReactNode;
  className?: string;
  loading?: boolean;
  disabled?: boolean;
}) => {
  return (
    <button
      type="submit"
      onClick={onClick}
      className={` h-10  ${disabled ? "cursor-not-allowed" : "cursor-pointer"}
          } transition-all text-white font-semibold rounded-md relative overflow-hidden  ${className}`}
    >
      <div
        className={clsx(
          loading ? "flex" : "hidden",
          "absolute w-full  bg-black  items-center justify-center opacity-60 left-0  top-0 h-full"
        )}
      >
        <img src={loader} className="w-6" />
      </div>
      {children}
    </button>
  );
};
