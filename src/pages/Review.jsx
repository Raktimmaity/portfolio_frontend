import { useState } from "react";
import { FaStar } from "react-icons/fa";
import { toast } from "sonner";

// Change this if you have a backend endpoint:
const SUBMIT_URL =
    import.meta?.env?.VITE_TESTIMONIALS_URL || "/api/testimonials";

const Review = () => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        profession: "",
        rating: 0,       // number 1..5
        comment: "",
    });
    const [hover, setHover] = useState(0); // star hover preview
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const setField = (key, val) => setForm((f) => ({ ...f, [key]: val }));

    const validate = () => {
        const e = {};
        if (!form.name.trim()) e.name = "Name is required.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
            e.email = "Valid email is required.";
        if (!form.profession.trim()) e.profession = "Profession is required.";
        if (!(form.rating >= 1 && form.rating <= 5))
            e.rating = "Please choose a star rating.";
        if (form.comment.trim().length < 10)
            e.comment = "Comment should be at least 10 characters.";
        return e;
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        const eobj = validate();
        setErrors(eobj);
        if (Object.keys(eobj).length) {
            toast.error("Please fix the highlighted fields.");
            return;
        }

        setSubmitting(true);
        const payload = {
            name: form.name.trim(),
            email: form.email.trim().toLowerCase(),
            profession: form.profession.trim(),
            rating: Number(form.rating), // <-- numeric in DB
            comment: form.comment.trim(),
            createdAt: new Date().toISOString(),
        };

        try {
            const res = await fetch(SUBMIT_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Request failed");

            toast.success("Thanks for your testimonial! ✨");
            setForm({ name: "", email: "", profession: "", rating: 0, comment: "" });
            setHover(0);
        } catch (err) {
            // Optional fallback so you can test success flow without a backend
            try {
                const key = "__testimonials__";
                const arr = JSON.parse(localStorage.getItem(key) || "[]");
                arr.push(payload);
                localStorage.setItem(key, JSON.stringify(arr));
                toast.success("Saved locally (connect backend to persist).");
                setForm({ name: "", email: "", profession: "", rating: 0, comment: "" });
                setHover(0);
            } catch {
                toast.error("Could not submit right now. Please try again.");
            }
        } finally {
            setSubmitting(false);
        }
    };

    const inputBase =
        "w-full rounded-md bg-black/30 border px-3 py-2 text-sm text-cyan-100 outline-none transition focus:border-emerald-400 border-emerald-400/30";

    const errorText = "mt-1 text-xs text-rose-300";

    return (
        <section className="relative max-w-3xl mx-auto px-6 md:px-10 pt-24 pb-20 text-white">
            <h2 className="text-center text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-400 to-blue-400 mb-4">
                Send the Testimonial to Raktim
            </h2>
            <div className="flex justify-center -mt-2 mb-8" aria-hidden="true">
                <span className="inline-block h-[2px] w-1/2 rounded-full bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
            </div>
            <div className="relative md:pl-32">
                {/* left PNG leaning on the card */}
                <img
                    src="me.png"         // <-- your PNG path
                    alt="Me leaning on the card"
                    loading="lazy"
                    className="hidden md:block absolute left-16 -translate-x-[60%] h-[650px] select-none pointer-events-none
               drop-shadow-[0_0_18px_rgba(34,211,238,.35)] z-30"
                    aria-hidden="true"
                />
                <span
                    className="absolute -bottom-24 left-18 -translate-x-1/2
               h-20 w-20 rounded-full
               bg-gradient-to-r from-cyan-500 to-emerald-500
               opacity-90 border border-white/10
               shadow-[0_0_22px_rgba(34,211,238,.55)] z-20"
                />

                <form
                    onSubmit={onSubmit}
                    noValidate
                    className="rounded-2xl border border-emerald-400/30 bg-gradient-to-br from-gray-900/70 to-gray-800/50 p-5 shadow-[0_0_18px_rgba(44,255,125,.15)]"
                >
                    {/* Name */}
                    <label className="block mb-4">
                        <span className="text-sm text-cyan-200">Name</span>
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) => setField("name", e.target.value)}
                            className={`${inputBase} mt-1`}
                            aria-invalid={!!errors.name}
                            placeholder="Your full name"
                        />
                        {errors.name && <p className={errorText}>{errors.name}</p>}
                    </label>

                    {/* Email + Profession (grid) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <label className="block">
                            <span className="text-sm text-cyan-200">Email</span>
                            <input
                                type="email"
                                value={form.email}
                                onChange={(e) => setField("email", e.target.value)}
                                className={`${inputBase} mt-1`}
                                aria-invalid={!!errors.email}
                                placeholder="you@example.com"
                            />
                            {errors.email && <p className={errorText}>{errors.email}</p>}
                        </label>

                        <label className="block">
                            <span className="text-sm text-cyan-200">Profession</span>
                            <input
                                type="text"
                                value={form.profession}
                                onChange={(e) => setField("profession", e.target.value)}
                                className={`${inputBase} mt-1`}
                                aria-invalid={!!errors.profession}
                                placeholder="e.g., Frontend Developer"
                            />
                            {errors.profession && (
                                <p className={errorText}>{errors.profession}</p>
                            )}
                        </label>
                    </div>

                    {/* Rating */}
                    <div className="mb-4">
                        <span className="block text-sm text-cyan-200 mb-1">Star rating</span>
                        <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((n) => {
                                const active = (hover || form.rating) >= n;
                                return (
                                    <button
                                        type="button"
                                        key={n}
                                        onMouseEnter={() => setHover(n)}
                                        onMouseLeave={() => setHover(0)}
                                        onClick={() => setField("rating", n)}
                                        aria-label={`${n} star${n > 1 ? "s" : ""}`}
                                        aria-pressed={form.rating === n}
                                        className="p-1"
                                    >
                                        <FaStar
                                            className={`text-4xl transition-transform ${active
                                                ? "text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,.6)] scale-110"
                                                : "text-cyan-300/40"
                                                }`}
                                        />
                                    </button>
                                );
                            })}
                            <span className="ml-2 text-xs text-cyan-300">
                                {form.rating ? `${form.rating}/5` : "No rating"}
                            </span>
                        </div>
                        {errors.rating && <p className={errorText}>{errors.rating}</p>}
                    </div>

                    {/* Comment */}
                    <label className="block mb-5">
                        <span className="text-sm text-cyan-200">Comment</span>
                        <textarea
                            rows={5}
                            value={form.comment}
                            onChange={(e) => setField("comment", e.target.value)}
                            className={`${inputBase} mt-1 resize-y`}
                            aria-invalid={!!errors.comment}
                            placeholder="Share your experience…"
                        />
                        {errors.comment && <p className={errorText}>{errors.comment}</p>}
                    </label>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={submitting}
                            className={`rounded-md px-5 py-2 font-semibold text-black
                        bg-gradient-to-r from-cyan-500 to-emerald-500
                        hover:shadow-[0_0_22px_rgba(34,211,238,.5)]
                        transition
                        ${submitting ? "opacity-70 cursor-not-allowed" : ""}`}
                        >
                            {submitting ? "Submitting…" : "Submit"}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default Review;
