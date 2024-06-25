import { FaGithub, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/Logos/logo.png";

// Constants
const SOCIAL_MEDIA = {
  twitter: "https://twitter.com/ubaiishh",
  instagram: "https://instagram.com/ubaiish",
  linkedin: "https://www.linkedin.com/in/mohd-ubaish/",
  github: "https://linkedin.com/ubaish01",
};

const CREATOR_NAME = "Ubaish Malik";

export const Footer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const show = !(
    location.pathname?.includes("/auth") ||
    location.pathname?.includes("/user/onboard")
  );
  return (
    show && (
      <footer className="bg-[#0a161f] py-8">
        <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between px-4 lg:px-8 text-center text-white">
          <div
            className="items-center cursor-pointer gap-2 flex"
            onClick={() => navigate("/")}
          >
            <img src={logo} className="w-14" alt="logo" />
            <div className="font-bold text-2xl">
              Go<span className="text-purple-500">Bankrupt</span>
            </div>
          </div>
          <div className="text-sm lg:text-base text-left">
            <p className="mb-4">
              Welcome to goBankrupt - where the fun of losing is our specialty!
            </p>
            <p className="mb-4">
              Explore our variety of toy casino games and experience the thrill
              without the bills.
            </p>
            <p className="mb-4">Follow us on :</p>
            <div className="flex justify-center lg:justify-start space-x-4 mb-4">
              <a
                href={SOCIAL_MEDIA.twitter}
                className="text-white hover:text-gray-300"
              >
                <FaTwitter className="h-6 w-6" />
              </a>
              <a
                href={SOCIAL_MEDIA.instagram}
                className="text-white hover:text-gray-300"
              >
                <FaInstagram className="h-6 w-6" />
              </a>
              <a
                href={SOCIAL_MEDIA.linkedin}
                className="text-white hover:text-gray-300"
              >
                <FaLinkedin className="h-6 w-6" />
              </a>
              <a
                href={SOCIAL_MEDIA.linkedin}
                className="text-white hover:text-gray-300"
              >
                <FaGithub className="h-6 w-6" />
              </a>
            </div>
          </div>
          <p>
            <div className="mt-4 lg:mt-0 text-xs lg:text-sm ">
              Made with ❤️ by
              <Link
                target="_blank"
                to={SOCIAL_MEDIA.twitter}
                className="font-bold hover:underline ml-2"
              >
                {CREATOR_NAME}
              </Link>
            </div>
          </p>
        </div>
      </footer>
    )
  );
};
