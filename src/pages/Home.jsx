import { Link } from "react-router";
import MestLogo from "../assets/images/logoteal.png"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-gray-800 px-4 text-center">
      {/* Logo */}
      <img
        src={MestLogo}
        alt="MEST Logo"
        className="w-32 sm:w-40 md:w-52 lg:w-64 object-contain mb-6"
      />

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#B627A1] mb-4">
        Welcome to MEST Talent Connect
      </h1>

      {/* Subtitle */}
      <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-md mb-8">
        Discover, showcase, and connect with amazing talents across Africa.
      </p>

      {/* Button */}
      <div className="flex gap-4 mb-6">
        <Link
          to="/create-talent"
          className="bg-[#28BBBB] hover:bg-[#42a0a0] text-white font-semibold py-3 px-4 rounded-xl shadow-md transition duration-300 ease-in-out"
        >
          <span className="font-bold pr-2">+</span>Add New Talent
        </Link>
        <Link
          to="/update-details"
          className="bg-[#28BBBB] hover:bg-[#42a0a0] text-white font-semibold py-3 px-4 rounded-xl shadow-md transition duration-300 ease-in-out"
        >
          Edit Talent Details
        </Link>
      </div>

      <Link
          to="/create-project"
          className="bg-[#28BBBB] hover:bg-[#42a0a0] text-white font-semibold py-3 px-4 rounded-xl shadow-md transition duration-300 ease-in-out"
        >
          <span className="font-bold pr-2">+</span>Add Project
        </Link>
    </div>
  );
}