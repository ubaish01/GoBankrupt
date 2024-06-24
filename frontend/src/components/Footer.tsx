import { useLocation } from "react-router-dom";

export const Footer = () => {
  const location = useLocation();
  const show = !(
    location.pathname?.includes("/auth") ||
    location.pathname?.includes("/user/onboard")
  );
  return (
    show && <footer className="border-t bg-[#0F212E] py-12 text-white"></footer>
  );
};
