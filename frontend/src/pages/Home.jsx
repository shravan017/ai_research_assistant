import { Link } from "react-router-dom";

export default function Home() {

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center">
      <h1 className="text-6xl font-bold mb-4">
        AI Research Assistant
      </h1>
      <p className="text-xl text-gray-400 mb-8 text-center">
        Upload research papers, chat with documents,
        generate summaries and discover insights.
      </p>

      <div className="flex gap-4">
        <Link
          to="/register"
          className="bg-green-600 px-6 py-3 rounded-lg"
        >
          Get Started
        </Link>

        <Link
          to="/login"
          className="bg-blue-600 px-6 py-3 rounded-lg"
        >
          Login
        </Link>
      </div>
    </div>
  );
}