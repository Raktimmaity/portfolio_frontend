import React, { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import { FaEdit, FaTrash } from "react-icons/fa";
import AdminSidebar from "../components/AdminSidebar";

const API_BASE = import.meta.env.VITE_API_BASE || import.meta.env.REACT_APP_API_BASE || "http://localhost:5000";

const paginate = (items, pageSize, page) =>
  items.slice((page - 1) * pageSize, page * pageSize);

const AdminActivitiesView = () => {
  const [activities, setActivities] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", platform: "", date: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/api/admin/activities`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("admin_token")}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        list.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
        setActivities(list);
        setPage(1);
      })
      .catch(() => toast.error("Failed to fetch activities"));
  }, []);

  const filterItems = (items, query) => {
    if (!query) return items;
    const q = query.toLowerCase();
    return items.filter(
      (a) =>
        (a.title || "").toLowerCase().includes(q) ||
        (a.platform || "").toLowerCase().includes(q) ||
        (a.date || "").toLowerCase().includes(q)
    );
  };

  const filtered = filterItems(activities, search);
  const paged = paginate(filtered, pageSize, page);

  const openEdit = (activity) => {
    setEditing(activity);
    setEditForm({
      title: activity.title || "",
      platform: activity.platform || "",
      date: activity.date || "",
    });
    setIsEditOpen(true);
  };

  const closeEdit = () => {
    setIsEditOpen(false);
    setEditing(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editing?._id) return;
    if (!editForm.title.trim()) {
      toast.error("Title is required");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/activities/${editing._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error updating activity");
      setActivities((prev) => prev.map((a) => (a._id === data._id ? data : a)));
      toast.success("Activity updated");
      closeEdit();
    } catch (err) {
      toast.error(err.message || "Server error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Delete this activity?");
    if (!ok) return;
    try {
      const res = await fetch(`${API_BASE}/api/admin/activities/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("admin_token")}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error deleting activity");
      toast.success("Activity deleted");
      setActivities((prev) => prev.filter((a) => a._id !== id));
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
            <h1 className="text-3xl md:text-4xl font-semibold text-emerald-200">
              Activities
            </h1>
            <p className="text-sm text-emerald-100/70 mt-1">
              Edit your activity section like you can view, edit and delete the data.
            </p>
          </div>
          <div className="text-sm text-emerald-200/70">
            <span className="text-emerald-300">Dashboard</span> <span className="mx-2">/</span>{" "}
            Activities <span className="mx-2">/</span> Activities{" "}
            <span className="mx-2">/</span> View data
          </div>
        </div>

        <section className="mt-8 bg-[#0f172a] border border-emerald-400/20 rounded-2xl p-6 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
          <h2 className="text-lg font-semibold text-emerald-100">Activity Details</h2>
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
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="text-emerald-100/80 border-b border-emerald-400/20">
                <tr>
                  <th className="py-3 px-2 w-16">ID</th>
                  <th className="py-3 px-2">Title</th>
                  <th className="py-3 px-2 w-28">Year</th>
                  <th className="py-3 px-2">Platform</th>
                  <th className="py-3 px-2 w-28">Action</th>
                </tr>
              </thead>
              <tbody className="text-emerald-100/90">
                {paged.map((item, i) => (
                  <tr key={item._id} className="border-b border-emerald-400/10">
                    <td className="py-3 px-2">{(page - 1) * pageSize + i + 1}</td>
                    <td className="py-3 px-2">{item.title}</td>
                    <td className="py-3 px-2">{item.date || "—"}</td>
                    <td className="py-3 px-2">{item.platform || "—"}</td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(item)}
                          className="h-9 w-9 rounded-full bg-blue-500/80 text-white flex items-center justify-center"
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
                    <td colSpan="5" className="py-6 text-center text-emerald-100/60">
                      No activities found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-emerald-100/60">
            <span>
              Showing {(page - 1) * pageSize + 1} to{" "}
              {Math.min(page * pageSize, filtered.length)} of {filtered.length} entries
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 rounded-md bg-emerald-500/20 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-3 py-1 rounded-md bg-[#0b1220] border border-emerald-400/20">
                {page}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(Math.ceil(filtered.length / pageSize), p + 1))}
                disabled={page >= Math.ceil(filtered.length / pageSize)}
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
          <div className="w-full max-w-xl rounded-2xl border border-emerald-400/20 bg-[#0f172a] shadow-[0_0_35px_rgba(15,23,42,0.8)]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-emerald-400/15">
              <h3 className="text-lg font-semibold text-emerald-100">Edit Activity</h3>
              <button
                type="button"
                onClick={closeEdit}
                className="h-8 w-8 rounded-full text-emerald-100/80 hover:text-white"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleUpdate} className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm text-emerald-100/90 mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={editForm.title}
                  onChange={handleEditChange}
                  className="w-full bg-[#0b1220] border border-emerald-400/20 rounded-md px-4 py-2 text-emerald-100 focus:border-emerald-300 outline-none"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-emerald-100/90 mb-1">Platform</label>
                  <input
                    type="text"
                    name="platform"
                    value={editForm.platform}
                    onChange={handleEditChange}
                    className="w-full bg-[#0b1220] border border-emerald-400/20 rounded-md px-4 py-2 text-emerald-100 focus:border-emerald-300 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-emerald-100/90 mb-1">Date</label>
                  <input
                    type="text"
                    name="date"
                    value={editForm.date}
                    onChange={handleEditChange}
                    className="w-full bg-[#0b1220] border border-emerald-400/20 rounded-md px-4 py-2 text-emerald-100 focus:border-emerald-300 outline-none"
                  />
                </div>
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
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-md bg-gradient-to-r from-emerald-500 to-green-500 text-white disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminActivitiesView;
