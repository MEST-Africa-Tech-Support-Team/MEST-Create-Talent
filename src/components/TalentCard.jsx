export default function TalentCard({ name, role, image, onViewProfile, skills = [] }) {
  return (
    <div className="bg-white shadow-md rounded-2xl p-4 flex flex-col items-center text-center">
      <img
        src={image}
        alt={name}
        className="w-24 h-24 rounded-full mb-3" // Added mb-3 for spacing
      />
      <h2 className="text-lg font-semibold text-gray-800">{name}</h2>
      <p className="text-sm text-gray-500 mb-2">{role}</p> {/* Added mb-2 for spacing */}

      {/* Availability Status with Green Dot */}
      <div className="flex items-center text-sm text-gray-600 mb-3"> {/* Added mb-3 for spacing */}
        <span className="w-2 h-2 bg-[#00CA9B] rounded-full mr-1"></span>
        <span>Available - Full-time</span>
      </div>

      {/* Dynamic Skills/Tech Tags */}
      <div className="flex flex-wrap justify-center gap-2 mb-2"> {/* Added mb-4 for spacing */}
        {skills.map((skill, index) => (
          <span key={index} className="bg-blue-100 text-blue-800 rounded-full px-2 py-0.5 text-xs font-medium">
            {skill}
          </span>
        ))}
      </div>
      
      <button
        onClick={onViewProfile}
        className="mt-auto px-12 py-2 bg-[#28BBBB]  text-white rounded-xl hover:bg-teal -700 transition-colors text-sm font-medium cursor-pointer" 
      >
        Edit Profile
      </button>
    </div>
  );
}