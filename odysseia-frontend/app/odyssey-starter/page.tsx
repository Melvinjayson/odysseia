export default function OdysseyStarter() {
  return (
    <section>
      <h1 className="text-3xl font-bold text-blue-700 mb-6">Odyssey Starter</h1>
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-2">Begin Your Journey</h2>
        <p className="text-gray-600 mb-4">Answer a few questions to personalize your odyssey. Our AI will guide you every step of the way.</p>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">What is your main goal?</label>
            <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Learn a new skill" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Preferred pace</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Steady</option>
              <option>Intensive</option>
              <option>Flexible</option>
            </select>
          </div>
          <button type="submit" className="bg-blue-700 text-white px-6 py-2 rounded font-semibold hover:bg-blue-800 transition">Start Odyssey</button>
        </form>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-bold text-blue-700 mb-2">How it works</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Answer a few questions</li>
            <li>Get a personalized plan</li>
            <li>Track your progress</li>
            <li>Chat with your AI guide</li>
          </ul>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-blue-700 mb-2">Sample Odyssey</h3>
          <p className="text-gray-600 mb-2">"Learn to play the guitar in 30 days"</p>
          <div className="text-xs text-gray-400">Personalized for you by OΔYSSEIA</div>
        </div>
      </div>
    </section>
  );
}
