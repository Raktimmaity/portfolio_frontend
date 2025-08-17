import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhoneAlt,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaGithub,
  FaSkype,
  FaPaperPlane,
} from "react-icons/fa";
import { toast } from "sonner";

/* animations – short + easy to render */
const container = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};
const stagger = { show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

/* ------------------ RIGHT SIDE DATA IN ONE OBJECT ------------------ */
const contactInfo = {
  location: { label: "Kolkata, West Bengal", icon: FaMapMarkerAlt },
  email: { label: "raktim@example.com", href: "mailto:raktim@example.com", icon: FaEnvelope },
  phone: { label: "+91 99999 99999", href: "tel:+919999999999", icon: FaPhoneAlt },
  socials: [
    { icon: FaFacebookF, href: "#" },
    { icon: FaInstagram, href: "#" },
    { icon: FaLinkedinIn, href: "#" },
    { icon: FaGithub, href: "#" },
    { icon: FaSkype, href: "#" },
  ],
};

const initialForm = { name: "", email: "", subject: "", message: "" };

const Contact = () => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const emailRegex = useMemo(
    () =>
      // simple, reliable email regex
      /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
    []
  );

  /* ------------------ VALIDATION ------------------ */
  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Please enter your name.";
    if (!emailRegex.test(form.email)) e.email = "Enter a valid email.";
    if (form.subject.trim().length < 3) e.subject = "Subject should be at least 3 characters.";
    if (form.message.trim().length < 10) e.message = "Message should be at least 10 characters.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (key) => (ev) => {
    setForm((f) => ({ ...f, [key]: ev.target.value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  /* ------------------ SUBMIT ------------------ */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix the highlighted fields.", {
        description: "Some inputs look incomplete.",
      });
      return;
    }

    try {
      setLoading(true);

      // Send to your backend route (adjust if needed)
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || data?.success === false) {
        throw new Error(data?.message || "Failed to send message.");
      }

      // success
      toast.success("Message sent ✨", {
        description: "Thanks! I’ll get back to you soon.",
        style: {
          background:
            "linear-gradient(90deg, rgba(34,211,238,0.12), rgba(34,197,94,0.12))",
          border: "1px solid rgba(34,211,238,0.35)",
          color: "white",
        },
      });
      setForm(initialForm);
      setErrors({});
    } catch (err) {
      toast.error("Something went wrong", {
        description: err.message || "Please try again.",
        style: {
          background:
            "linear-gradient(90deg, rgba(34,211,238,0.08), rgba(34,197,94,0.08))",
          border: "1px solid rgba(34,211,238,0.35)",
          color: "white",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contact"
      className="relative py-16 px-6 md:px-12 max-w-6xl mx-auto mt-20"
      aria-labelledby="contact-title"
    >
      {/* <div className="mb-13 h-px w-full bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" /> */}
      <h2
        id="contact-title"
        className="text-center text-3xl md:text-4xl font-bold text-transparent bg-clip-text
                   bg-gradient-to-r from-cyan-400 via-green-400 to-blue-400 mb-3"
      >
        Contact
      </h2>
      {/* half-width divider under the heading */}
      <div className="flex justify-center mb-6" aria-hidden="true">
        <span className="inline-block h-[2px] w-1/2 rounded-full bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
      </div>

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="grid md:grid-cols-2 gap-8"
      >
        {/* LEFT: form */}
        <motion.form
          onSubmit={handleSubmit}
          noValidate
          variants={container}
          className="rounded-xl p-5 bg-gradient-to-br from-gray-900/70 to-gray-800/50
                     border border-cyan-400/30"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            {/* Name */}
            <div className="flex flex-col">
              <label htmlFor="name" className="text-sm text-cyan-200 mb-1">
                Your Name
              </label>
              <input
                id="name"
                type="text"
                value={form.name}
                onChange={handleChange("name")}
                aria-invalid={!!errors.name}
                className={`w-full rounded-md bg-black/40 border outline-none px-3 py-2 text-white
                  focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/40
                  ${errors.name ? "border-red-400" : "border-cyan-400/30"}`}
                placeholder="John Doe"
              />
              {errors.name && <span className="text-xs text-red-400 mt-1">{errors.name}</span>}
            </div>

            {/* Email */}
            <div className="flex flex-col">
              <label htmlFor="email" className="text-sm text-cyan-200 mb-1">
                Your Email
              </label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={handleChange("email")}
                aria-invalid={!!errors.email}
                className={`w-full rounded-md bg-black/40 border outline-none px-3 py-2 text-white
                  focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/40
                  ${errors.email ? "border-red-400" : "border-cyan-400/30"}`}
                placeholder="john@email.com"
              />
              {errors.email && <span className="text-xs text-red-400 mt-1">{errors.email}</span>}
            </div>
          </div>

          {/* Subject */}
          <div className="mt-4">
            <label htmlFor="subject" className="text-sm text-cyan-200 mb-1 block">
              Subject
            </label>
            <input
              id="subject"
              type="text"
              value={form.subject}
              onChange={handleChange("subject")}
              aria-invalid={!!errors.subject}
              className={`w-full rounded-md bg-black/40 border outline-none px-3 py-2 text-white
                focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/40
                ${errors.subject ? "border-red-400" : "border-cyan-400/30"}`}
              placeholder="How can I help?"
            />
            {errors.subject && <span className="text-xs text-red-400">{errors.subject}</span>}
          </div>

          {/* Message */}
          <div className="mt-4">
            <label htmlFor="message" className="text-sm text-cyan-200 mb-1 block">
              Message
            </label>
            <textarea
              id="message"
              rows="6"
              value={form.message}
              onChange={handleChange("message")}
              aria-invalid={!!errors.message}
              className={`w-full rounded-md bg-black/40 border outline-none px-3 py-2 text-white resize-y
                focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/40
                ${errors.message ? "border-red-400" : "border-cyan-400/30"}`}
              placeholder="Write your message here…"
            />
            {errors.message && <span className="text-xs text-red-400">{errors.message}</span>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-5 inline-flex items-center gap-2 px-5 py-2 rounded-full
                       bg-gradient-to-r from-cyan-500 to-green-500 text-black font-semibold
                       hover:shadow-[0_0_26px_rgba(34,211,238,0.6)]
                       disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            {loading ? "Sending..." : "Send Message"} <FaPaperPlane />
          </button>
        </motion.form>

        {/* RIGHT: info panel (driven by object above) */}
        <motion.div
          variants={container}
          className="rounded-xl p-5 bg-gradient-to-br from-gray-900/70 to-gray-800/50 border border-green-400/30"
        >
          {/* Location */}
          <motion.div variants={item} className="flex items-start gap-3">
            <div className="p-3 rounded-full bg-black/40 border border-cyan-400/40">
              <contactInfo.location.icon className="text-cyan-300" />
            </div>
            <div>
              <h4 className="text-white font-semibold">Location</h4>
              <p className="text-sm text-cyan-200">{contactInfo.location.label}</p>
            </div>
          </motion.div>

          {/* Email */}
          <motion.div variants={item} className="flex items-start gap-3 mt-5">
            <div className="p-3 rounded-full bg-black/40 border border-cyan-400/40">
              <contactInfo.email.icon className="text-cyan-300" />
            </div>
            <div>
              <h4 className="text-white font-semibold">Email</h4>
              <a
                href={contactInfo.email.href}
                className="text-sm text-cyan-200 hover:text-white transition"
              >
                {contactInfo.email.label}
              </a>
            </div>
          </motion.div>

          {/* Phone */}
          <motion.div variants={item} className="flex items-start gap-3 mt-5">
            <div className="p-3 rounded-full bg-black/40 border border-cyan-400/40">
              <contactInfo.phone.icon className="text-cyan-300" />
            </div>
            <div>
              <h4 className="text-white font-semibold">Call</h4>
              <a
                href={contactInfo.phone.href}
                className="text-sm text-cyan-200 hover:text-white transition"
              >
                {contactInfo.phone.label}
              </a>
            </div>
          </motion.div>

          {/* Socials */}
          <motion.div variants={item} className="mt-6">
            <h4 className="text-white font-semibold mb-3">Follow Me</h4>
            <div className="flex gap-3">
              {contactInfo.socials.map((S, i) => (
                <a
                  key={i}
                  href={S.href}
                  className="p-3 rounded-full text-white bg-gradient-to-br from-cyan-500 to-green-500
                             shadow-md hover:shadow-green-500/40 transition"
                  aria-label="social link"
                >
                  <S.icon />
                </a>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* bottom accent line */}
      {/* <div className="mt-10 h-px w-full bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" /> */}
    </section>
  );
};

export default Contact;
