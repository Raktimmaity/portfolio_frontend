import React from "react";
import { Toaster } from "sonner";
import AdminSidebar from "../components/AdminSidebar";

const AdminMessagesFeedback = () => {
  return (
    <div className="min-h-screen bg-[#0b1222] text-white flex">
      <Toaster position="top-right" theme="dark" richColors />
      <AdminSidebar />

      <main className="flex-1 md:ml-64 mt-16 md:mt-0 p-6 md:p-10 transition-all duration-300">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold text-emerald-200">Feedback</h1>
            <p className="text-sm text-emerald-100/70 mt-1">View feedback messages.</p>
          </div>
          <div className="text-sm text-emerald-200/70">
            <span className="text-emerald-300">Dashboard</span> <span className="mx-2">/</span>{" "}
            Messages <span className="mx-2">/</span> Feedback
          </div>
        </div>

        <section className="mt-8 bg-[#0f172a] border border-emerald-400/20 rounded-2xl p-6 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
          <div className="text-emerald-100/70">Feedback table will go here.</div>
        </section>
      </main>
    </div>
  );
};

export default AdminMessagesFeedback;
