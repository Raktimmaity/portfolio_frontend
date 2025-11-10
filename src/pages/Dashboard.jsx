import React from "react";
import { FaEye, FaProjectDiagram, FaTasks, FaUser } from "react-icons/fa";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Mon", visits: 12 },
  { name: "Tue", visits: 18 },
  { name: "Wed", visits: 8 },
  { name: "Thu", visits: 15 },
  { name: "Fri", visits: 20 },
  { name: "Sat", visits: 10 },
  { name: "Sun", visits: 25 },
];

const Dashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-black/70 border-r border-green-500/30 p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-8 bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
            Portfolio
          </h1>
          <nav className="space-y-3">
            {["Dashboard", "About", "Resume", "Portfolio", "Activities", "Strengths & Hobby", "Messages", "Contact", "Feedback"].map((item, i) => (
              <button
                key={i}
                className="w-full text-left px-3 py-2 rounded-md hover:bg-green-500/20 hover:text-green-300 transition"
              >
                {item}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3 mt-6">
          <img
            src="https://randomuser.me/api/portraits/men/32.jpg"
            alt="Admin"
            className="w-10 h-10 rounded-full border-2 border-green-400"
          />
          <div>
            <p className="text-sm font-semibold">Raktim Maity</p>
            <p className="text-xs text-green-400">Admin</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-black/60 p-5 rounded-xl border border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.4)]">
            <FaEye className="text-green-400 text-2xl mb-2" />
            <p className="text-gray-400 text-sm">Profile Views</p>
            <h3 className="text-xl font-bold">416</h3>
          </div>
          <div className="bg-black/60 p-5 rounded-xl border border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.4)]">
            <FaProjectDiagram className="text-green-400 text-2xl mb-2" />
            <p className="text-gray-400 text-sm">Projects</p>
            <h3 className="text-xl font-bold">37</h3>
          </div>
          <div className="bg-black/60 p-5 rounded-xl border border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.4)]">
            <FaTasks className="text-green-400 text-2xl mb-2" />
            <p className="text-gray-400 text-sm">Skills</p>
            <h3 className="text-xl font-bold">13</h3>
          </div>
          <div className="bg-black/60 p-5 rounded-xl border border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.4)]">
            <FaUser className="text-green-400 text-2xl mb-2" />
            <p className="text-gray-400 text-sm">Activities</p>
            <h3 className="text-xl font-bold">5</h3>
          </div>
        </div>

        {/* Graph + Messages */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart */}
          <div className="col-span-2 bg-black/60 p-6 rounded-xl border border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.4)]">
            <h3 className="text-lg font-semibold mb-4">Profile Visit</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip />
                <Line type="monotone" dataKey="visits" stroke="#22c55e" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Messages */}
          <div className="bg-black/60 p-6 rounded-xl border border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.4)]">
            <h3 className="text-lg font-semibold mb-4">Recent Messages</h3>
            <ul className="space-y-3">
              {["SATYAJIT SAHA", "Risav", "Aritri Podder"].map((name, i) => (
                <li key={i} className="flex items-center gap-3">
                  <img
                    src={`https://i.pravatar.cc/40?img=${i + 5}`}
                    alt={name}
                    className="w-10 h-10 rounded-full border-2 border-green-400"
                  />
                  <span className="text-sm">{name}</span>
                </li>
              ))}
            </ul>
            <button className="mt-4 w-full bg-gradient-to-r from-green-400 to-cyan-400 text-black font-semibold py-2 rounded-lg hover:shadow-[0_0_20px_rgba(34,197,94,0.6)] transition">
              View All
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
