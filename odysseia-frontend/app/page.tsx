export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center text-center py-16 md:py-24">
      <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4 drop-shadow-lg">OΔYSSEIA</h1>
      <p className="text-lg md:text-2xl text-gray-300 mb-8 max-w-xl font-medium">Your journey, your story. Empowering you to chart your own odyssey with AI-driven guidance and tools.</p>
      <a href="/odyssey-starter" className="inline-block bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white px-10 py-4 rounded-2xl shadow-xl hover:scale-105 hover:shadow-2xl transition font-bold text-lg mb-8">Start Your Odyssey</a>
      <div className="w-full flex flex-col gap-6 md:flex-row md:gap-8 items-center justify-center mt-4">
        <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 rounded-2xl shadow-xl p-6 w-full max-w-xs flex flex-col items-center">
          <h2 className="text-lg font-bold text-indigo-300 mb-2">Personal Dashboard</h2>
          <p className="text-gray-400 text-sm">Track your progress, set goals, and visualize your journey.</p>
        </div>
        <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 rounded-2xl shadow-xl p-6 w-full max-w-xs flex flex-col items-center">
          <h2 className="text-lg font-bold text-purple-300 mb-2">Odyssey Starter</h2>
          <p className="text-gray-400 text-sm">Begin your adventure with tailored prompts and AI support.</p>
        </div>
        <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 rounded-2xl shadow-xl p-6 w-full max-w-xs flex flex-col items-center">
          <h2 className="text-lg font-bold text-pink-300 mb-2">Secure Login</h2>
          <p className="text-gray-400 text-sm">Access your odyssey securely and privately.</p>
        </div>
      </div>
    </section>
  );
}
