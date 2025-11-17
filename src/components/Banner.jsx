import { Link } from "react-router";

export default function Banner() {
  return (
    <section className="bg-[#28BBBB] text-white px-4 sm:px-6 md:px-10 py-8 text-center min-h-[50vh] flex flex-col justify-center">
      <Link
        to="/"
        className="inline-block mb-6 bg-white hover:bg-gray-200 py-1 px-2 rounded shadow-gray-900 shadow-2xl text-blue-600 hover:text-blue-800 font-semibold transition self-start"
      >
        ← Back to Home
      </Link>
      <h1 className="text-3xl sm:text-4xl md:text-5xl mb-4 font-bold mt-6 leading-snug">
        Discover Africa's Brightest <br className="hidden sm:block" /> Tech
        Talents <span className="font-light">- Edit Talent Profile</span>
      </h1>

      <p className="mt-2 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
        Connect with skilled professionals ready to transform your projects and{" "}
        <br className="hidden sm:block" /> drive innovation forward
      </p>
    </section>
  );
}