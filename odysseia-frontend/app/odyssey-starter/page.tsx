export default function OdysseyStarter() {
  return (
    <section className="flex flex-col gap-8">
      <h1 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2 drop-shadow">Odyssey Starter</h1>
      <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 rounded-2xl shadow-xl p-6 mb-6">
        <h2 className="text-lg font-bold text-indigo-300 mb-2">Begin Your Journey</h2>
        <p className="text-gray-400 mb-4">Answer a few questions to personalize your odyssey. Our AI will guide you every step of the way.</p>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">What is your main goal?</label>
            <input type="text" className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-900 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 transition shadow-inner" placeholder="e.g. Learn a new skill" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Preferred pace</label>
            <select className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-900 text-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-400 transition shadow-inner">
              <option>Steady</option>
              <option>Intensive</option>
              <option>Flexible</option>
            </select>
          </div>
          <button type="submit" className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white py-2 rounded-xl font-bold shadow-lg hover:scale-105 hover:shadow-2xl transition">Start Odyssey</button>
        </form>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-6 flex flex-col">
          <h3 className="text-base font-bold text-indigo-300 mb-2">How it works</h3>
          <ul className="list-disc list-inside text-gray-300 space-y-1">
            <li>Answer a few questions</li>
            <li>Get a personalized plan</li>
            <li>Track your progress</li>
            <li>Chat with your AI guide</li>
          </ul>
        </div>
        <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 rounded-2xl shadow-xl p-6 flex flex-col">
          <h3 className="text-base font-bold text-pink-300 mb-2">Sample Odyssey</h3>
          <p className="text-gray-400 mb-2">"Learn to play the guitar in 30 days"</p>
          <div className="text-xs text-gray-500">Personalized for you by OΔYSSEIA</div>
        </div>
      </div>
    </section>
  );
}
