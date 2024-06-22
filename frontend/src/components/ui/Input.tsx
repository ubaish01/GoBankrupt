import clsx from "clsx";

export const Input = ({
  onChange,
  className,
  placeholder,
  type = "text",
  disabled = false,
  value,
}: {
  onChange: (e: any) => void;
  className?: string;
  placeholder: string;
  type?: string;
  disabled?: boolean;
  value?: any;
}) => {
  return (
    <input
      disabled={disabled}
      type={type}
      value={value}
      onChange={onChange}
      className={clsx(className, " px-4 py-3 rounded-md w-full ")}
      placeholder={placeholder}
    />
  );
};
