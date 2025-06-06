export default function Dashboard() {
  return (
    <section className="flex flex-col gap-8">
      <h1 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2 drop-shadow">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 rounded-2xl shadow-xl p-6 flex flex-col">
          <h2 className="text-lg font-bold text-indigo-300 mb-2">Your Progress</h2>
          <p className="text-gray-400 mb-4">Visualize your journey milestones and achievements.</p>
          <div className="h-24 bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 rounded-xl flex items-center justify-center text-indigo-300 text-sm">[Progress Chart Placeholder]</div>
        </div>
        <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 rounded-2xl shadow-xl p-6 flex flex-col">
          <h2 className="text-lg font-bold text-purple-300 mb-2">Goals</h2>
          <p className="text-gray-400 mb-4">Set, track, and update your personal goals.</p>
          <ul className="list-disc list-inside text-gray-300 space-y-1">
            <li>Complete Odyssey Starter</li>
            <li>Reach Milestone 1</li>
            <li>Connect with AI Guide</li>
          </ul>
        </div>
      </div>
      <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 rounded-2xl shadow-xl p-6 mt-2">
        <h2 className="text-lg font-bold text-pink-300 mb-2">Recent Activity</h2>
        <ul className="divide-y divide-gray-700">
          <li className="py-2 flex items-start gap-2">
            <span className="material-icons text-indigo-400">auto_awesome</span>
            <span>Started new odyssey: <span className="font-medium text-indigo-200">Personal Growth</span></span>
          </li>
          <li className="py-2 flex items-start gap-2">
            <span className="material-icons text-purple-400">check_circle</span>
            <span>Completed onboarding</span>
          </li>
          <li className="py-2 flex items-start gap-2">
            <span className="material-icons text-pink-400">flag</span>
            <span>Set first goal</span>
          </li>
        </ul>
      </div>
    </section>
  );
}
