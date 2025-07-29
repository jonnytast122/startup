"use client";
import FacebookOutlinedIcon from "@mui/icons-material/FacebookOutlined";
import InstagramIcon from "@mui/icons-material/Instagram";
import TelegramIcon from "@mui/icons-material/Telegram";

const ComingSoonFooter = () => {
  return (
    <footer className="inset-x-0 bottom-0 font-Tw_Cen_Mt z-50 max-w-screen-xl mx-auto px-4 text-gray-600 md:px-8">
      <div className=" mt-10 flex flex-col lg:flex-row md:flex-row justify-between items-center text-gray-600 py-10 border-t">
        <div className="flex justify-center space-x-4 ">
          <p className="font-bold text-united_nation_blue">Follow us:</p>
          <div>
            <a
              href="https://www.facebook.com/profile.php?id=61562347383962"
              className="hover:text-united_nation_blue mx-1 md:mx-2 lg:mx-2"
            >
              <FacebookOutlinedIcon />
            </a>{" "}
            <a
              href="https://www.instagram.com/ananapp_co/?hl=en"
              className="hover:text-united_nation_blue  mx-1 md:mx-2 lg:mx-2"
            >
              <InstagramIcon />
            </a>{" "}
            <a
              href="https://t.me/ananapp_co"
              className="hover:text-united_nation_blue  mx-1 md:mx-2 lg:mx-2"
            >
              <TelegramIcon />
            </a>
          </div>
        </div>

        <p className="p-4 md:p-0 lg:p-0">
          {" "}
          <span className="text-united_nation_blue ">
            © 2024 ananapp.co.
          </span>{" "}
          All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default ComingSoonFooter;
