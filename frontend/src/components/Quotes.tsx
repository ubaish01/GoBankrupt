import { useNavigate } from "react-router-dom";
import { Button } from "./ui/Button";

export const Quotes = ({
  heading,
  description,
  action,
}: {
  heading: string;
  description: string;
  action: {
    path: string;
    text: string;
  };
}) => {
  const navigate = useNavigate();
  return (
    <div className="flex  w-full flex-col justify-center items-center  pb-10">
      <h1 className="text-6xl font-bold">{heading}</h1>
      <h3 className="mt-4 text-xl mb-4">{description}</h3>
      <Button
        className="bg-purple-500 w-80 hover:bg-purple-600"
        onClick={() => navigate(action.path)}
      >
        {action.text}
      </Button>
    </div>
  );
};
