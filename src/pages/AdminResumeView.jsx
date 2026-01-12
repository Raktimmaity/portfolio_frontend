import React, { useEffect, useMemo, useState } from "react";
import { Toaster, toast } from "sonner";
import { FaEdit, FaTrash } from "react-icons/fa";
import AdminSidebar from "../components/AdminSidebar";

const API_BASE = import.meta.env.VITE_API_BASE || import.meta.env.REACT_APP_API_BASE || "http://localhost:5000";

const paginate = (items, pageSize, page) =>
  items.slice((page - 1) * pageSize, page * pageSize);

const AdminResumeView = () => {
  const [entries, setEntries] = useState([]);
  const [searchEdu, setSearchEdu] = useState("");
  const [searchPro, setSearchPro] = useState("");
  const [pageEdu, setPageEdu] = useState(1);
  const [pagePro, setPagePro] = useState(1);
  const [pageSizeEdu, setPageSizeEdu] = useState(5);
  const [pageSizePro, setPageSizePro] = useState(5);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editEntry, setEditEntry] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    duration: "",
    organization: "",
    description: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/api/admin/resume`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("admin_token")}` },
    })
      .then((res) => res.json())
      .then((data) => setEntries(Array.isArray(data) ? data : []))
      .catch(() => toast.error("Failed to fetch resume data"));
  }, []);

  const education = useMemo(
    () => entries.filter((e) => e.category === "Education"),
    [entries]
  );
  const professional = useMemo(
    () => entries.filter((e) => e.category === "Professional Experience"),
    [entries]
  );

  const filterItems = (items, query) => {
    if (!query) return items;
    const q = query.toLowerCase();
    return items.filter(
      (e) =>
        (e.duration || "").toLowerCase().includes(q) ||
        (e.title || "").toLowerCase().includes(q) ||
        (e.organization || "").toLowerCase().includes(q) ||
        (e.description || "").toLowerCase().includes(q)
    );
  };

  const eduFiltered = filterItems(education, searchEdu);
  const proFiltered = filterItems(professional, searchPro);

  const eduPaged = paginate(eduFiltered, pageSizeEdu, pageEdu);
  const proPaged = paginate(proFiltered, pageSizePro, pagePro);

  const handleDelete = async (id) => {
    const ok = window.confirm("Delete this entry?");
    if (!ok) return;
    try {
      const res = await fetch(`${API_BASE}/api/admin/resume/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("admin_token")}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error deleting entry");
      toast.success("Entry deleted");
      setEntries((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      toast.error(err.message || "Server error");
    }
  };

  const openEdit = (entry) => {
    setEditEntry(entry);
    setEditForm({
      title: entry.title || "",
      duration: entry.duration || "",
      organization: entry.organization || "",
      description: entry.description || "",
    });
    setIsEditOpen(true);
  };

  const closeEdit = () => {
    setIsEditOpen(false);
    setEditEntry(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editEntry?._id) return;
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/resume/${editEntry._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
        body: JSON.stringify({
          category: editEntry.category,
          ...editForm,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error updating entry");
      setEntries((prev) =>
        prev.map((item) => (item._id === data._id ? data : item))
      );
      toast.success("Entry updated");
      closeEdit();
    } catch (err) {
      toast.error(err.message || "Server error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1222] text-white flex">
      <Toaster position="top-right" theme="dark" richColors />
      <AdminSidebar />

      <main className="flex-1 md:ml-64 mt-16 md:mt-0 p-6 md:p-10 transition-all duration-300">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-semibold bg-gradient-to-r from-cyan-300 to-green-300 bg-clip-text text-transparent">
              Resume Section
            </h1>
            <p className="text-sm text-cyan-100/70 mt-1">
              Edit your resume section like add the school data, college data also you can add your professional data from which company complete the internship
            </p>
          </div>
          <div className="text-sm text-cyan-200/70">
            <span className="text-cyan-300">Dashboard</span> <span className="mx-2">/</span> Resume{" "}
            <span className="mx-2">/</span> Show Resume
          </div>
        </div>

        <section className="mt-8 bg-[#0f172a] border border-cyan-400/15 rounded-2xl p-6 shadow-[0_0_30px_rgba(34,211,238,0.12)]">
          <h2 className="text-lg font-semibold text-cyan-100">Education Details</h2>
          <div className="mt-4 flex items-center justify-between text-sm text-cyan-100/70">
            <div className="flex items-center gap-2">
              Show
              <select
                value={pageSizeEdu}
                onChange={(e) => {
                  setPageSizeEdu(Number(e.target.value));
                  setPageEdu(1);
                }}
                className="bg-[#0b1220] border border-cyan-400/15 rounded-md px-2 py-1 text-cyan-100"
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
                value={searchEdu}
                onChange={(e) => {
                  setSearchEdu(e.target.value);
                  setPageEdu(1);
                }}
                className="bg-[#0b1220] border border-cyan-400/15 rounded-md px-2 py-1 text-cyan-100"
              />
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="text-cyan-100/80 border-b border-cyan-400/20">
                <tr>
                  <th className="py-3 px-2 w-16">ID</th>
                  <th className="py-3 px-2">Course</th>
                  <th className="py-3 px-2 w-40">Duration</th>
                  <th className="py-3 px-2">Institute</th>
                  <th className="py-3 px-2 w-28">Action</th>
                </tr>
              </thead>
              <tbody className="text-cyan-100/90">
                {eduPaged.map((item, i) => (
                  <tr key={item._id} className="border-b border-cyan-400/10">
                    <td className="py-3 px-2">{(pageEdu - 1) * pageSizeEdu + i + 1}</td>
                    <td className="py-3 px-2">{item.title || "—"}</td>
                    <td className="py-3 px-2">{item.duration}</td>
                    <td className="py-3 px-2">{item.organization}</td>
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
                {eduPaged.length === 0 && (
                  <tr>
                    <td colSpan="5" className="py-6 text-center text-cyan-100/60">
                      No education entries found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-cyan-100/60">
            <span>
              Showing {(pageEdu - 1) * pageSizeEdu + 1} to{" "}
              {Math.min(pageEdu * pageSizeEdu, eduFiltered.length)} of {eduFiltered.length} entries
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPageEdu((p) => Math.max(1, p - 1))}
                disabled={pageEdu === 1}
                className="px-3 py-1 rounded-md bg-emerald-500/20 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-3 py-1 rounded-md bg-[#0b1220] border border-cyan-400/15">{pageEdu}</span>
              <button
                type="button"
                onClick={() => setPageEdu((p) => Math.min(Math.ceil(eduFiltered.length / pageSizeEdu), p + 1))}
                disabled={pageEdu >= Math.ceil(eduFiltered.length / pageSizeEdu)}
                className="px-3 py-1 rounded-md bg-emerald-500/20 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </section>

        <section className="mt-8 bg-[#0f172a] border border-emerald-400/15 rounded-2xl p-6 shadow-[0_0_30px_rgba(16,185,129,0.12)]">
          <h2 className="text-lg font-semibold text-emerald-100">Professional Details</h2>
          <div className="mt-4 flex items-center justify-between text-sm text-emerald-100/70">
            <div className="flex items-center gap-2">
              Show
              <select
                value={pageSizePro}
                onChange={(e) => {
                  setPageSizePro(Number(e.target.value));
                  setPagePro(1);
                }}
                className="bg-[#0b1220] border border-emerald-400/15 rounded-md px-2 py-1 text-emerald-100"
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
                value={searchPro}
                onChange={(e) => {
                  setSearchPro(e.target.value);
                  setPagePro(1);
                }}
                className="bg-[#0b1220] border border-emerald-400/15 rounded-md px-2 py-1 text-emerald-100"
              />
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="text-emerald-100/80 border-b border-emerald-400/20">
                <tr>
                  <th className="py-3 px-2 w-16">ID</th>
                  <th className="py-3 px-2">Course</th>
                  <th className="py-3 px-2 w-40">Duration</th>
                  <th className="py-3 px-2">Institute</th>
                  <th className="py-3 px-2 w-28">Action</th>
                </tr>
              </thead>
              <tbody className="text-emerald-100/90">
                {proPaged.map((item, i) => (
                  <tr key={item._id} className="border-b border-emerald-400/10">
                    <td className="py-3 px-2">{(pagePro - 1) * pageSizePro + i + 1}</td>
                    <td className="py-3 px-2">{item.title || "—"}</td>
                    <td className="py-3 px-2">{item.duration}</td>
                    <td className="py-3 px-2">{item.organization}</td>
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
                {proPaged.length === 0 && (
                  <tr>
                    <td colSpan="5" className="py-6 text-center text-emerald-100/60">
                      No professional entries found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-emerald-100/60">
            <span>
              Showing {(pagePro - 1) * pageSizePro + 1} to{" "}
              {Math.min(pagePro * pageSizePro, proFiltered.length)} of {proFiltered.length} entries
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPagePro((p) => Math.max(1, p - 1))}
                disabled={pagePro === 1}
                className="px-3 py-1 rounded-md bg-emerald-500/20 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-3 py-1 rounded-md bg-[#0b1220] border border-emerald-400/15">{pagePro}</span>
              <button
                type="button"
                onClick={() => setPagePro((p) => Math.min(Math.ceil(proFiltered.length / pageSizePro), p + 1))}
                disabled={pagePro >= Math.ceil(proFiltered.length / pageSizePro)}
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
          <div className="w-full max-w-2xl rounded-2xl border border-cyan-400/20 bg-[#0f172a] shadow-[0_0_35px_rgba(15,23,42,0.8)]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-cyan-400/15">
              <h3 className="text-lg font-semibold text-cyan-100">Edit</h3>
              <button
                type="button"
                onClick={closeEdit}
                className="h-8 w-8 rounded-full text-cyan-100/80 hover:text-white"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleUpdate} className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-cyan-100/80 mb-1">Course Name</label>
                  <input
                    type="text"
                    name="title"
                    value={editForm.title}
                    onChange={handleEditChange}
                    className="w-full bg-[#0b1220] border border-cyan-400/15 rounded-md px-4 py-2 text-cyan-100 focus:border-cyan-300 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-cyan-100/80 mb-1">Duration</label>
                  <input
                    type="text"
                    name="duration"
                    value={editForm.duration}
                    onChange={handleEditChange}
                    className="w-full bg-[#0b1220] border border-cyan-400/15 rounded-md px-4 py-2 text-cyan-100 focus:border-cyan-300 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-cyan-100/80 mb-1">Institute Name</label>
                <input
                  type="text"
                  name="organization"
                  value={editForm.organization}
                  onChange={handleEditChange}
                  className="w-full bg-[#0b1220] border border-cyan-400/15 rounded-md px-4 py-2 text-cyan-100 focus:border-cyan-300 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-cyan-200/70 mb-2">
                  Description (leave it blank if you don't want to)
                </label>
                <textarea
                  rows="4"
                  name="description"
                  value={editForm.description}
                  onChange={handleEditChange}
                  className="w-full bg-[#0b1220] border border-cyan-400/15 rounded-md px-4 py-3 text-cyan-100 focus:border-cyan-300 outline-none"
                />
              </div>
              <div className="flex items-center justify-end gap-3 border-t border-cyan-400/10 pt-4">
                <button
                  type="button"
                  onClick={closeEdit}
                  className="px-5 py-2 rounded-md bg-slate-500/70 text-white"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-md bg-gradient-to-r from-cyan-500 to-blue-500 text-white disabled:opacity-60"
                >
                  {saving ? "Updating..." : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminResumeView;
