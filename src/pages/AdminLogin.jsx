import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserShield, FaLock } from "react-icons/fa";
import { toast } from "sonner";

const AdminLogin = () => {
    const [form, setForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [greeting, setGreeting] = useState("");
    const navigate = useNavigate();

    // Greeting logic
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) return "Good Morning";
        if (hour >= 12 && hour < 15) return "Good Noon";
        if (hour >= 15 && hour < 18) return "Good Afternoon";
        if (hour >= 18 && hour < 22) return "Good Evening";
        return "Good Night";
    };

    useEffect(() => {
        setGreeting(getGreeting()); // set initial greeting

        const interval = setInterval(() => {
            setGreeting(getGreeting());
        }, 60 * 1000); // update every 1 minute

        return () => clearInterval(interval);
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 🔹 Fake check: any email with "admin" works, others fail
            if (form.email.includes("admin") && form.password === "1234") {
                toast.success("Login successful", {
                    description: "Welcome back, Admin!",
                });
                navigate("/admin-dashboard");
            } else {
                throw new Error("Invalid credentials");
            }
        } catch (err) {
            toast.error("Login failed", {
                description: err.message || "Invalid credentials",
            });
        } finally {
            setLoading(false);
        }
    };




    return (
        <section className="min-h-screen flex items-center justify-center px-6">
            <div className="w-full max-w-md bg-black/50 border border-cyan-400/30 rounded-2xl shadow-lg p-8">
                <div className="flex flex-col items-center mb-6">
                    <FaUserShield className="text-4xl text-cyan-400 mb-2" />
                    <h2 className="text-xl font-semibold text-cyan-300">{greeting}, <span className="text-2xl font-bold text-white">Boss</span></h2>
                    <p className="text-sm text-gray-400">Enter your credentials</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        name="email"
                        placeholder="Admin Email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full rounded-md bg-gray-800 border border-cyan-400/30 px-3 py-2 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        className="w-full rounded-md bg-gray-800 border border-cyan-400/30 px-3 py-2 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                        required
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-green-500 py-2 rounded-md text-black font-semibold hover:shadow-[0_0_20px_rgba(34,211,238,0.6)] transition disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        <FaLock /> {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
            </div>
        </section>
    );
};

export default AdminLogin;
