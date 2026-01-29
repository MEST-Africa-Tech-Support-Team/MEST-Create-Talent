export default function ProjectCard({ project, onEdit, onDelete }) {
  const truncateWords = (text, limit = 18) => {
    if (!text) return "";
    const words = text.split(" ");
    return words.length > limit
      ? words.slice(0, limit).join(" ") + "..."
      : text;
  };

  return (
    <div className="relative bg-white border border-gray-300 rounded-2xl p-4 hover:shadow-md transition">
      
      <span className="absolute top-3 right-3 text-xs px-3 py-1 rounded-full bg-[#28BBBB]/80 text-white font-medium">
        {project.projectType}
      </span>

      {project.images?.[0] && (
        <img
          src={project.images[0]}
          alt={project.title}
          className="w-full h-40 object-cover rounded-xl mb-3"
        />
      )}

      <h3 className="font-bold text-lg">{project.title}</h3>

      <p className="text-sm text-gray-600 mt-2">
        {truncateWords(project.description)}
      </p>

      <div className="flex gap-2 mt-4">
        <button
          onClick={() => onEdit(project)}
          className="px-3 py-1 bg-blue-600 text-white rounded"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(project)}
          className="px-3 py-1 bg-red-600 text-white rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
