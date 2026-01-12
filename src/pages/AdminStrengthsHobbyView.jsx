import React, { useEffect, useMemo, useState } from "react";
import { Toaster, toast } from "sonner";
import { FaEdit, FaTrash } from "react-icons/fa";
import AdminSidebar from "../components/AdminSidebar";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";
const paginate = (items, pageSize, page) =>
  items.slice((page - 1) * pageSize, page * pageSize);

const AdminStrengthsHobbyView = () => {
  const [items, setItems] = useState([]);
  const [searchStrength, setSearchStrength] = useState("");
  const [searchInterest, setSearchInterest] = useState("");
  const [pageStrength, setPageStrength] = useState(1);
  const [pageInterest, setPageInterest] = useState(1);
  const [pageSizeStrength, setPageSizeStrength] = useState(5);
  const [pageSizeInterest, setPageSizeInterest] = useState(5);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({ category: "", name: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/api/admin/strengths-interests`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("admin_token")}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        list.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
        setItems(list);
        setPageStrength(1);
        setPageInterest(1);
      })
      .catch(() => toast.error("Failed to fetch strengths and interests"));
  }, []);

  const strengths = useMemo(
    () => items.filter((i) => i.category === "Strengths"),
    [items]
  );
  const interests = useMemo(
    () => items.filter((i) => i.category === "Interests"),
    [items]
  );

  const filterItems = (list, query) => {
    if (!query) return list;
    const q = query.toLowerCase();
    return list.filter((i) => (i.name || "").toLowerCase().includes(q));
  };

  const strengthFiltered = filterItems(strengths, searchStrength);
  const interestFiltered = filterItems(interests, searchInterest);

  const strengthPaged = paginate(strengthFiltered, pageSizeStrength, pageStrength);
  const interestPaged = paginate(interestFiltered, pageSizeInterest, pageInterest);

  const openEdit = (item) => {
    setEditing(item);
    setEditForm({ category: item.category || "", name: item.name || "" });
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
    if (!editForm.category || !editForm.name.trim()) {
      toast.error("Category and name are required");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/strengths-interests/${editing._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error updating item");
      setItems((prev) => prev.map((i) => (i._id === data._id ? data : i)));
      toast.success("Item updated");
      closeEdit();
    } catch (err) {
      toast.error(err.message || "Server error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Delete this item?");
    if (!ok) return;
    try {
      const res = await fetch(`${API_BASE}/api/admin/strengths-interests/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("admin_token")}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error deleting item");
      toast.success("Item deleted");
      setItems((prev) => prev.filter((i) => i._id !== id));
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
              Strength and Hobby Section
            </h1>
            <p className="text-sm text-emerald-100/70 mt-1">
              Here you can see your strengths and hobbies and you can edit and delete your strengths and hobbies.
            </p>
          </div>
          <div className="text-sm text-emerald-200/70">
            <span className="text-emerald-300">Dashboard</span> <span className="mx-2">/</span>{" "}
            Strengths & Hobby <span className="mx-2">/</span> View Data
          </div>
        </div>

        <section className="mt-8 bg-[#0f172a] border border-emerald-400/20 rounded-2xl p-6 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
          <h2 className="text-lg font-semibold text-emerald-100">Strength Data</h2>
          <div className="mt-4 flex items-center justify-between text-sm text-emerald-100/70">
            <div className="flex items-center gap-2">
              Show
              <select
                value={pageSizeStrength}
                onChange={(e) => {
                  setPageSizeStrength(Number(e.target.value));
                  setPageStrength(1);
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
                value={searchStrength}
                onChange={(e) => {
                  setSearchStrength(e.target.value);
                  setPageStrength(1);
                }}
                className="bg-[#0b1220] border border-emerald-400/20 rounded-md px-2 py-1 text-emerald-100"
              />
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="text-emerald-100/80 border-b border-emerald-400/20">
                <tr>
                  <th className="py-3 px-2 w-16">ID</th>
                  <th className="py-3 px-2">Name</th>
                  <th className="py-3 px-2 w-28">Action</th>
                </tr>
              </thead>
              <tbody className="text-emerald-100/90">
                {strengthPaged.map((item, i) => (
                  <tr key={item._id} className="border-b border-emerald-400/10">
                    <td className="py-3 px-2">{(pageStrength - 1) * pageSizeStrength + i + 1}</td>
                    <td className="py-3 px-2">{item.name}</td>
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
                {strengthPaged.length === 0 && (
                  <tr>
                    <td colSpan="3" className="py-6 text-center text-emerald-100/60">
                      No strength entries found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-emerald-100/60">
            <span>
              Showing {(pageStrength - 1) * pageSizeStrength + 1} to{" "}
              {Math.min(pageStrength * pageSizeStrength, strengthFiltered.length)} of{" "}
              {strengthFiltered.length} entries
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPageStrength((p) => Math.max(1, p - 1))}
                disabled={pageStrength === 1}
                className="px-3 py-1 rounded-md bg-emerald-500/20 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-3 py-1 rounded-md bg-[#0b1220] border border-emerald-400/20">
                {pageStrength}
              </span>
              <button
                type="button"
                onClick={() =>
                  setPageStrength((p) =>
                    Math.min(Math.ceil(strengthFiltered.length / pageSizeStrength), p + 1)
                  )
                }
                disabled={pageStrength >= Math.ceil(strengthFiltered.length / pageSizeStrength)}
                className="px-3 py-1 rounded-md bg-emerald-500/20 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </section>

        <section className="mt-8 bg-[#0f172a] border border-emerald-400/20 rounded-2xl p-6 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
          <h2 className="text-lg font-semibold text-emerald-100">Interests Data</h2>
          <div className="mt-4 flex items-center justify-between text-sm text-emerald-100/70">
            <div className="flex items-center gap-2">
              Show
              <select
                value={pageSizeInterest}
                onChange={(e) => {
                  setPageSizeInterest(Number(e.target.value));
                  setPageInterest(1);
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
                value={searchInterest}
                onChange={(e) => {
                  setSearchInterest(e.target.value);
                  setPageInterest(1);
                }}
                className="bg-[#0b1220] border border-emerald-400/20 rounded-md px-2 py-1 text-emerald-100"
              />
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="text-emerald-100/80 border-b border-emerald-400/20">
                <tr>
                  <th className="py-3 px-2 w-16">ID</th>
                  <th className="py-3 px-2">Name</th>
                  <th className="py-3 px-2 w-28">Action</th>
                </tr>
              </thead>
              <tbody className="text-emerald-100/90">
                {interestPaged.map((item, i) => (
                  <tr key={item._id} className="border-b border-emerald-400/10">
                    <td className="py-3 px-2">{(pageInterest - 1) * pageSizeInterest + i + 1}</td>
                    <td className="py-3 px-2">{item.name}</td>
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
                {interestPaged.length === 0 && (
                  <tr>
                    <td colSpan="3" className="py-6 text-center text-emerald-100/60">
                      No interest entries found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-emerald-100/60">
            <span>
              Showing {(pageInterest - 1) * pageSizeInterest + 1} to{" "}
              {Math.min(pageInterest * pageSizeInterest, interestFiltered.length)} of{" "}
              {interestFiltered.length} entries
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPageInterest((p) => Math.max(1, p - 1))}
                disabled={pageInterest === 1}
                className="px-3 py-1 rounded-md bg-emerald-500/20 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-3 py-1 rounded-md bg-[#0b1220] border border-emerald-400/20">
                {pageInterest}
              </span>
              <button
                type="button"
                onClick={() =>
                  setPageInterest((p) =>
                    Math.min(Math.ceil(interestFiltered.length / pageSizeInterest), p + 1)
                  )
                }
                disabled={pageInterest >= Math.ceil(interestFiltered.length / pageSizeInterest)}
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
              <h3 className="text-lg font-semibold text-emerald-100">Edit Item</h3>
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
                <label className="block text-sm text-emerald-100/90 mb-1">Category</label>
                <select
                  name="category"
                  value={editForm.category}
                  onChange={handleEditChange}
                  className="w-full bg-[#0b1220] border border-emerald-400/20 rounded-md px-4 py-2 text-emerald-100 focus:border-emerald-300 outline-none"
                >
                  <option value="Strengths">Strengths</option>
                  <option value="Interests">Interests</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-emerald-100/90 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditChange}
                  className="w-full bg-[#0b1220] border border-emerald-400/20 rounded-md px-4 py-2 text-emerald-100 focus:border-emerald-300 outline-none"
                />
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

export default AdminStrengthsHobbyView;
