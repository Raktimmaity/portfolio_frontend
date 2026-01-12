import React, { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import AdminSidebar from "../components/AdminSidebar";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

const emptyForm = { name: "", speak: 0, read: 0, write: 0, percentage: 0 };

const AdminLanguage = () => {
  const [languages, setLanguages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchLanguages = () => {
    fetch(`${API_BASE}/api/admin/languages`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("admin_token")}` },
    })
      .then((res) => res.json())
      .then((data) => setLanguages(Array.isArray(data) ? data : []))
      .catch(() => toast.error("Failed to fetch languages"));
  };

  useEffect(() => {
    fetchLanguages();
  }, []);

  useEffect(() => {
    if (showModal) {
      const id = requestAnimationFrame(() => setModalVisible(true));
      return () => cancelAnimationFrame(id);
    }
    setModalVisible(false);
  }, [showModal]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (language) => {
    setEditing(language);
    setForm({
      name: language.name || "",
      speak: language.speak || 0,
      read: language.read || 0,
      write: language.write || 0,
      percentage: language.percentage || 0,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setTimeout(() => {
      setShowModal(false);
      setEditing(null);
      setForm(emptyForm);
    }, 200);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const next = {
        ...prev,
        [name]: ["speak", "read", "write"].includes(name) ? Number(value) : value,
      };
      const avg = Math.round((Number(next.speak) + Number(next.read) + Number(next.write)) / 3);
      return { ...next, percentage: Number.isFinite(avg) ? avg : 0 };
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Language name is required");
      return;
    }
    setSaving(true);
    try {
      const url = editing
        ? `${API_BASE}/api/admin/languages/${editing._id}`
        : `${API_BASE}/api/admin/languages`;
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error saving language");
      toast.success(editing ? "Language updated" : "Language added");
      closeModal();
      fetchLanguages();
    } catch (err) {
      toast.error(err.message || "Server error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (languageId) => {
    const ok = window.confirm("Delete this language?");
    if (!ok) return;
    try {
      const res = await fetch(`${API_BASE}/api/admin/languages/${languageId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("admin_token")}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error deleting language");
      toast.success("Language deleted");
      setLanguages((prev) => prev.filter((l) => l._id !== languageId));
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
            <h1 className="text-3xl md:text-4xl font-semibold bg-gradient-to-r from-cyan-300 to-green-300 bg-clip-text text-transparent">
              Language
            </h1>
            <p className="text-sm text-cyan-100/70 mt-1">
              Add, Remove or Edit your preferred Languages
            </p>
          </div>
          <div className="text-sm text-cyan-200/70">
            <span className="text-cyan-300">Dashboard</span> <span className="mx-2">/</span> Language
          </div>
        </div>

        <section className="mt-8 bg-[#0f172a] border border-cyan-400/15 rounded-2xl p-6 shadow-[0_0_30px_rgba(34,211,238,0.12)]">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-cyan-100">Your Languages</h2>
            <button
              type="button"
              onClick={openCreate}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-emerald-500/90 hover:bg-emerald-400 text-black font-medium shadow-[0_0_18px_rgba(16,185,129,0.6)]"
            >
              <FaPlus /> Add New
            </button>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="text-cyan-100/80 border-b border-cyan-400/20">
                <tr>
                  <th className="py-3 px-2 w-16">Sl. No.</th>
                  <th className="py-3 px-2">Language</th>
                  <th className="py-3 px-2 w-20">Speak</th>
                  <th className="py-3 px-2 w-20">Read</th>
                  <th className="py-3 px-2 w-20">Write</th>
                  <th className="py-3 px-2">Expertise</th>
                  <th className="py-3 px-2 w-28">Percentage</th>
                  <th className="py-3 px-2 w-32">Action</th>
                </tr>
              </thead>
              <tbody className="text-cyan-100/90">
                {languages.map((language, index) => (
                  <tr key={language._id} className="border-b border-cyan-400/10">
                    <td className="py-4 px-2">{index + 1}</td>
                    <td className="py-4 px-2">{language.name}</td>
                    <td className="py-4 px-2">{language.speak || 0}</td>
                    <td className="py-4 px-2">{language.read || 0}</td>
                    <td className="py-4 px-2">{language.write || 0}</td>
                    <td className="py-4 px-2">
                      <div className="w-full max-w-[200px] h-2 rounded-full bg-white/20 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400"
                          style={{ width: `${language.percentage || 0}%` }}
                        />
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <span className="px-3 py-1 rounded-md bg-white/10">{language.percentage || 0}%</span>
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(language)}
                          className="h-9 w-9 rounded-full bg-blue-500/80 hover:bg-blue-400 text-white flex items-center justify-center"
                        >
                          <FaEdit />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(language._id)}
                          className="h-9 w-9 rounded-md bg-red-500/90 hover:bg-red-400 text-white flex items-center justify-center"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {languages.length === 0 && (
                  <tr>
                    <td colSpan="8" className="py-6 text-center text-cyan-100/60">
                      No languages added yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {showModal && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-200 ${
            modalVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className={`w-full max-w-xl rounded-2xl bg-[#0f172a] border border-emerald-400/20 shadow-[0_0_35px_rgba(16,185,129,0.25)] transition-all duration-200 ${
              modalVisible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-2"
            }`}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-emerald-400/15">
              <h3 className="text-lg font-semibold text-emerald-100">
                {editing ? "Edit Language" : "Add Language"}
              </h3>
              <button
                type="button"
                onClick={closeModal}
                className="text-emerald-200/70 hover:text-emerald-100"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSave} className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm text-emerald-100/80 mb-1">Language Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full bg-[#0b1220] border border-emerald-400/20 rounded-md px-4 py-2 text-emerald-100 outline-none focus:border-emerald-300"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-emerald-100/80 mb-1">Speak</label>
                  <input
                    type="number"
                    name="speak"
                    min="0"
                    max="100"
                    value={form.speak}
                    onChange={handleChange}
                    className="w-full bg-[#0b1220] border border-emerald-400/20 rounded-md px-4 py-2 text-emerald-100 outline-none focus:border-emerald-300"
                  />
                </div>
                <div>
                  <label className="block text-sm text-emerald-100/80 mb-1">Read</label>
                  <input
                    type="number"
                    name="read"
                    min="0"
                    max="100"
                    value={form.read}
                    onChange={handleChange}
                    className="w-full bg-[#0b1220] border border-emerald-400/20 rounded-md px-4 py-2 text-emerald-100 outline-none focus:border-emerald-300"
                  />
                </div>
                <div>
                  <label className="block text-sm text-emerald-100/80 mb-1">Write</label>
                  <input
                    type="number"
                    name="write"
                    min="0"
                    max="100"
                    value={form.write}
                    onChange={handleChange}
                    className="w-full bg-[#0b1220] border border-emerald-400/20 rounded-md px-4 py-2 text-emerald-100 outline-none focus:border-emerald-300"
                  />
                </div>
                <div>
                  <label className="block text-sm text-emerald-100/80 mb-1">Percentage</label>
                  <input
                    type="number"
                    name="percentage"
                    min="0"
                    max="100"
                    value={form.percentage}
                    readOnly
                    className="w-full bg-[#0b1220] border border-emerald-400/20 rounded-md px-4 py-2 text-emerald-100/80 outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-md bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-100"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-md bg-emerald-500 hover:bg-emerald-400 text-black font-medium shadow-[0_0_18px_rgba(16,185,129,0.6)] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {saving ? "Saving..." : editing ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLanguage;
