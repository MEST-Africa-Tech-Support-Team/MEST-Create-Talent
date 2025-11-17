import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram, FaYoutube, FaPhoneAlt, FaEnvelope,} from "react-icons/fa";
// import logo from "../assets/images/logo.png";

export default function Footer() {
  return (
    <footer className="bg-[#333] text-gray-300 py-10 px-4 sm:px-6 md:px-16 w-full">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">

       
        <div className="flex flex-col items-center md:items-start">
          <div className="flex items-center mb-4">
            {/*<img src={logo} alt="mest logo" className="h-6" />*/}
          </div>
          {/*<p className="text-sm text-gray-300 leading-relaxed max-w-xs md:max-w-none">*/}
          {/*  Empowering the next generation of African entrepreneurs and*/}
          {/*  technologists through world-class education and innovation.*/}
          {/*</p>*/}
            <p className="text-sm text-gray-300 leading-relaxed max-w-xs md:max-w-none">
                Connect with skilled professionals ready to transform your projects and
                drive innovation forward.
          </p>
        </div>

        
        <div className="flex flex-col items-center md:items-start">
      <h3 className="font-semibold text-white mb-4 text-center md:text-left">
        Contact Information
      </h3>

      
      <div className="flex items-center mb-4">
        <div className="bg-[rgba(40,187,187,0.20)] p-2 rounded-lg flex justify-center items-center mr-2">
          <FaEnvelope className="text-teal-500" />
        </div>
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
          <span className="text-xs text-gray-400">Email</span>
          <p className="text-sm break-all">recruitment.skills@meltwater.org</p>
        </div>
      </div>

      
      <div className="flex items-center">
        <div className="bg-[rgba(40,187,187,0.20)] p-2 rounded-lg flex justify-center items-center mr-2">
          <FaPhoneAlt className="text-teal-500" />
        </div>
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
          <span className="text-xs text-gray-400">Phone</span>
          <p className="text-sm break-all">+233 5351 87637</p>
        </div>
      </div>
    </div>


        <div className="flex flex-col items-center md:items-start">
          <h3 className="font-semibold text-white mb-4">Follow Us</h3>
          <div className="flex flex-wrap gap-3 justify-center md:justify-start mb-4">
            {[
              {
                icon: <FaFacebookF className="text-teal-500" />,
                href: "https://www.facebook.com/MESTAfrica",
              },
              {
                icon: <FaTwitter className="text-teal-500" />,
                href: "https://x.com/mestafrica?s=11&t=qynb_6x_ZzNoLO4kcIJxlw",
              },
              {
                icon: <FaLinkedinIn className="text-teal-500" />,
                href: "https://gh.linkedin.com/school/mestafrica/",
              },
              {
                icon: <FaInstagram className="text-teal-500" />,
                href: "https://www.instagram.com/mestafrica?igsh=dHZqdm9seGZyYm85",
              },
              {
                icon: <FaYoutube className="text-teal-500" />,
                href: "https://www.youtube.com/@MESTghana",
              },
            ].map(({ icon, href }, idx) => (
              <a
                key={idx}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg w-12 h-12 flex justify-center items-center bg-[rgba(40,187,187,0.20)]"
              >
                {icon}
              </a>
            ))}
          </div>
          <p className="text-sm text-gray-300 leading-relaxed max-w-xs md:max-w-none">
            Stay connected with our community and get the latest updates on our
            programs, events, and success stories.
          </p>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-10 pt-6 text-center">
        <p className="text-xs sm:text-sm text-gray-400">
          © MEST Africa 2025. All rights reserved.
        </p>
      </div>
    </footer>
  );
}