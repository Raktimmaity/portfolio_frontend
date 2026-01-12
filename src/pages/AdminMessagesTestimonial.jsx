import React, { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import { FaEdit, FaTrash } from "react-icons/fa";
import AdminSidebar from "../components/AdminSidebar";

const AdminMessagesTestimonial = () => {
  const API_BASE = import.meta.env.VITE_API_BASE || import.meta.env.REACT_APP_API_BASE || "http://localhost:5000";
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/api/admin/testimonials`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("admin_token")}` },
    })
      .then((res) => res.json())
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch(() => toast.error("Failed to fetch testimonials"));
  }, []);

  const filtered = items.filter((t) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (t.name || "").toLowerCase().includes(q) ||
      (t.role || "").toLowerCase().includes(q) ||
      (t.text || "").toLowerCase().includes(q)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const openEdit = (item) => {
    setEditing(item);
    setIsEditOpen(true);
  };

  const closeEdit = () => {
    setIsEditOpen(false);
    setEditing(null);
  };

  const handleSetStatus = async (status) => {
    if (!editing?._id) return;
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/testimonials/${editing._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error updating testimonial");
      setItems((prev) => prev.map((t) => (t._id === data._id ? data : t)));
      toast.success(status === 1 ? "Testimonial approved" : "Testimonial unapproved");
      closeEdit();
    } catch (err) {
      toast.error(err.message || "Server error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Delete this testimonial?");
    if (!ok) return;
    try {
      const res = await fetch(`${API_BASE}/api/admin/testimonials/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("admin_token")}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error deleting testimonial");
      toast.success("Testimonial deleted");
      setItems((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      toast.error(err.message || "Server error");
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1222] text-white flex">
      <Toaster position="top-right" theme="dark" richColors />
      <AdminSidebar />

      <main className="flex-1 md:ml-64 mt-16 md:mt-0 p-6 md:p-10 transition-all duration-300">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold text-emerald-200">Testimonial</h1>
            <p className="text-sm text-emerald-100/70 mt-1">
              See all testimonial. You can view or remove the data also you can approve to change
              the display status.
            </p>
          </div>
          <div className="text-sm text-emerald-200/70">
            <span className="text-emerald-300">Dashboard</span> <span className="mx-2">/</span>{" "}
            Messages <span className="mx-2">/</span> Testimonial
          </div>
        </div>

        <section className="mt-8 bg-[#0f172a] border border-emerald-400/20 rounded-2xl p-6 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-lg bg-emerald-500/20 border border-emerald-400/30 text-emerald-100">
            <span className="text-sm">Total Testimonial Messages</span>
            <span className="h-6 w-6 rounded-full bg-emerald-500/60 flex items-center justify-center text-xs text-white">
              {items.length}
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
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead className="text-emerald-100/80 border-b border-emerald-400/20">
                <tr>
                  <th className="py-3 px-2 w-16">ID</th>
                  <th className="py-3 px-2">Name</th>
                  <th className="py-3 px-2">Designation</th>
                  <th className="py-3 px-2 w-24">Rating</th>
                  <th className="py-3 px-2">Message</th>
                  <th className="py-3 px-2 w-40">Approval Status</th>
                  <th className="py-3 px-2 w-28">Action</th>
                </tr>
              </thead>
              <tbody className="text-emerald-100/90">
                {paged.map((item, i) => (
                  <tr key={item._id} className="border-b border-emerald-400/10">
                    <td className="py-3 px-2">{(currentPage - 1) * pageSize + i + 1}</td>
                    <td className="py-3 px-2">{item.name}</td>
                    <td className="py-3 px-2">{item.role || "—"}</td>
                    <td className="py-3 px-2">{item.rating || 0}/5</td>
                    <td className="py-3 px-2">
                      <div className="max-h-20 overflow-auto rounded-md bg-[#0b1220] border border-emerald-400/10 px-3 py-2 text-sm text-emerald-100/90">
                        {item.text}
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      {item.status === 1 ? (
                        <span className="px-3 py-1 rounded-md bg-emerald-500/80 text-white text-xs">
                          Approved
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-md bg-red-500/80 text-white text-xs">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(item)}
                          className="h-9 w-9 rounded-md bg-blue-500/80 text-white flex items-center justify-center"
                        >
                          <FaEdit />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item._id)}
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
                    <td colSpan="7" className="py-6 text-center text-emerald-100/60">
                      No testimonials found.
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

      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-lg rounded-2xl border border-emerald-400/20 bg-[#0f172a] shadow-[0_0_35px_rgba(15,23,42,0.8)]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-emerald-400/15">
              <h3 className="text-lg font-semibold text-emerald-100">Update Status</h3>
              <button
                type="button"
                onClick={closeEdit}
                className="h-8 w-8 rounded-full text-emerald-100/80 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="text-sm text-emerald-100/80">
                <div>Name: <span className="text-emerald-100">{editing?.name}</span></div>
                <div>Designation: <span className="text-emerald-100">{editing?.role || "—"}</span></div>
              </div>
              <div className="rounded-md bg-[#0b1220] border border-emerald-400/10 px-4 py-3 text-sm text-emerald-100/90">
                {editing?.text}
              </div>
              <div className="text-sm text-emerald-100/80">
                Rating: <span className="text-emerald-100">{editing?.rating || 0}/5</span>
              </div>
              <div className="flex items-center justify-end gap-3 border-t border-emerald-400/10 pt-4">
                <button
                  type="button"
                  onClick={closeEdit}
                  className="px-5 py-2 rounded-md bg-slate-500/70 text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleSetStatus(editing?.status === 1 ? 0 : 1)}
                  disabled={saving}
                  className="px-5 py-2 rounded-md bg-gradient-to-r from-emerald-500 to-green-500 text-white disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editing?.status === 1
                    ? "Unapprove"
                    : "Approve"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMessagesTestimonial;
