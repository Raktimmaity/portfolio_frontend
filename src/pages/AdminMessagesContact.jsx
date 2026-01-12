import React, { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import { FaReply, FaTrash } from "react-icons/fa";
import AdminSidebar from "../components/AdminSidebar";

const AdminMessagesContact = () => {
  const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";
  const [messages, setMessages] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [replySubject, setReplySubject] = useState("");
  const [replyMessage, setReplyMessage] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/api/admin/contact-messages`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("admin_token")}` },
    })
      .then((res) => res.json())
      .then((data) => setMessages(Array.isArray(data) ? data : []))
      .catch(() => toast.error("Failed to fetch contact messages"));
  }, []);

  const filtered = messages.filter((m) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (m.name || "").toLowerCase().includes(q) ||
      (m.email || "").toLowerCase().includes(q) ||
      (m.subject || "").toLowerCase().includes(q) ||
      (m.message || "").toLowerCase().includes(q)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleDelete = async (id) => {
    const ok = window.confirm("Delete this message?");
    if (!ok) return;
    try {
      const res = await fetch(`${API_BASE}/api/admin/contact-messages/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("admin_token")}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error deleting message");
      toast.success("Message deleted");
      setMessages((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      toast.error(err.message || "Server error");
    }
  };

  const openReply = (msg) => {
    setReplyTo(msg);
    setReplySubject(msg.subject || "");
    setReplyMessage(msg.message || "");
    setReplyOpen(true);
  };

  const closeReply = () => {
    setReplyOpen(false);
    setReplyTo(null);
    setReplySubject("");
    setReplyMessage("");
  };

  const handleReply = (e) => {
    e.preventDefault();
    if (!replyTo?.email) return;
    const subject = encodeURIComponent(replySubject || "");
    const body = encodeURIComponent(replyMessage || "");
    window.open(`mailto:${replyTo.email}?subject=${subject}&body=${body}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#0b1222] text-white flex">
      <Toaster position="top-right" theme="dark" richColors />
      <AdminSidebar />

      <main className="flex-1 md:ml-64 mt-16 md:mt-0 p-6 md:p-10 transition-all duration-300">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold text-emerald-200">Contact</h1>
            <p className="text-sm text-emerald-100/70 mt-1">
              See who can Message you through contact section. You can view or remove the data.
            </p>
          </div>
          <div className="text-sm text-emerald-200/70">
            <span className="text-emerald-300">Dashboard</span> <span className="mx-2">/</span>{" "}
            Messages <span className="mx-2">/</span> Contact
          </div>
        </div>

        <section className="mt-8 bg-[#0f172a] border border-emerald-400/20 rounded-2xl p-6 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-lg bg-emerald-500/20 border border-emerald-400/30 text-emerald-100">
            <span className="text-sm">Total Messages</span>
            <span className="h-6 w-6 rounded-full bg-emerald-500/60 flex items-center justify-center text-xs text-white">
              {messages.length}
            </span>
          </div>
        </section>

        <section className="mt-6 bg-[#0f172a] border border-emerald-400/20 rounded-2xl p-6 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
          <h2 className="text-lg font-semibold text-emerald-100">Contact Data</h2>
          <div className="mt-4 flex items-center justify-between text-sm text-emerald-100/70">
            <div className="flex items-center gap-2">
              Show
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                className="bg-[#0b1220] border border-emerald-400/20 rounded-md px-2 py-1 text-emerald-100"
              >
                {[5, 10, 20].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              entries
            </div>
            <div className="flex items-center gap-2">
              Search:
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="bg-[#0b1220] border border-emerald-400/20 rounded-md px-2 py-1 text-emerald-100"
              />
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="text-emerald-100/80 border-b border-emerald-400/20">
                <tr>
                  <th className="py-3 px-2 w-16">ID</th>
                  <th className="py-3 px-2">Name</th>
                  <th className="py-3 px-2">Subject</th>
                  <th className="py-3 px-2">Email</th>
                  <th className="py-3 px-2">Message</th>
                  <th className="py-3 px-2 w-24">Action</th>
                </tr>
              </thead>
              <tbody className="text-emerald-100/90">
                {paged.map((msg, i) => (
                  <tr key={msg._id} className="border-b border-emerald-400/10">
                    <td className="py-3 px-2">{(currentPage - 1) * pageSize + i + 1}</td>
                    <td className="py-3 px-2">{msg.name}</td>
                    <td className="py-3 px-2">{msg.subject || "—"}</td>
                    <td className="py-3 px-2">{msg.email}</td>
                    <td className="py-3 px-2">{msg.message}</td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openReply(msg)}
                          className="h-9 w-9 rounded-md bg-cyan-500/80 text-white flex items-center justify-center"
                        >
                          <FaReply />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(msg._id)}
                          className="h-9 w-9 rounded-md bg-red-500/90 text-white flex items-center justify-center"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {paged.length === 0 && (
                  <tr>
                    <td colSpan="6" className="py-6 text-center text-emerald-100/60">
                      No messages found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-emerald-100/60">
            <span>
              Showing {(currentPage - 1) * pageSize + 1} to{" "}
              {Math.min(currentPage * pageSize, filtered.length)} of {filtered.length} entries
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-md bg-emerald-500/20 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-3 py-1 rounded-md bg-[#0b1220] border border-emerald-400/20">
                {currentPage}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="px-3 py-1 rounded-md bg-emerald-500/20 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </section>
      </main>

      {replyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-2xl rounded-2xl border border-emerald-400/20 bg-[#0f172a] shadow-[0_0_35px_rgba(15,23,42,0.8)]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-emerald-400/15">
              <h3 className="text-lg font-semibold text-emerald-100">Reply</h3>
              <button
                type="button"
                onClick={closeReply}
                className="h-8 w-8 rounded-full text-emerald-100/80 hover:text-white"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleReply} className="px-6 py-5 space-y-4">
              <div className="text-sm text-emerald-100/70">
                To: <span className="text-emerald-100">{replyTo?.email || "—"}</span>
              </div>
              <div>
                <label className="block text-sm text-emerald-100/90 mb-1">Subject</label>
                <input
                  type="text"
                  value={replySubject}
                  onChange={(e) => setReplySubject(e.target.value)}
                  className="w-full bg-[#0b1220] border border-emerald-400/20 rounded-md px-4 py-2 text-emerald-100 focus:border-emerald-300 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-emerald-100/90 mb-1">Message</label>
                <textarea
                  rows="6"
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  className="w-full bg-[#0b1220] border border-emerald-400/20 rounded-md px-4 py-3 text-emerald-100 focus:border-emerald-300 outline-none"
                />
              </div>
              <div className="flex items-center justify-end gap-3 border-t border-emerald-400/10 pt-4">
                <button
                  type="button"
                  onClick={closeReply}
                  className="px-5 py-2 rounded-md bg-slate-500/70 text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-md bg-gradient-to-r from-emerald-500 to-green-500 text-white"
                >
                  Send Reply
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMessagesContact;
