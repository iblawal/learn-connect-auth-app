"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";

const App = () => {
  return (
    <div className="font-sans scroll-smooth">
      {/* === Navbar === */}
      <Navbar />

      {/* === Hero Section === */}
      <section
        id="home"
        className="h-screen flex flex-col justify-center items-center text-center  from-blue-500 to-blue-700 text-white px-6 pt-20"
      >
        <h1 className="text-5xl font-bold mb-4">Welcome to Learn & Connect </h1>
        <p className="text-lg max-w-xl mb-6">
          A platform where you can learn your favorite courses and connect with
          students across the world.
        </p>
        <Link
          href="/signup"
          className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition"
        >
          Get Started
        </Link>
      </section>

      {/* === About Section === */}
      <section id="about" className="py-24  from-white to-blue-50 text-gray-800">
        <div className="max-w-6xl mx-auto px-6 md:px-10 text-center">
          <h2 className="text-4xl font-bold mb-10 text-blue-700">About Us</h2>
          <div className="bg-white rounded-2xl shadow-lg p-10 md:p-14 mx-auto">
            <p className="text-lg leading-relaxed mb-6">
              <strong>Learn & Connect</strong> is your trusted gateway to learning,
              networking, and professional growth. Our mission is to empower
              learners by providing access to top-notch educational resources,
              collaborative spaces, and mentorship opportunities that foster
              personal and career development.
            </p>
            <p className="text-lg leading-relaxed text-gray-600">
              We believe in connecting curious minds — helping you explore new
              interests, build lasting connections, and gain practical skills that
              translate into real-world success.
            </p>
          </div>
        </div>
      </section>

      {/* === Services Section === */}
      <section id="services" className="py-24 bg-white text-center">
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <h2 className="text-4xl font-bold mb-14 text-blue-700">Our Services</h2>
          <div className="grid gap-10 md:grid-cols-3">
            {[
              {
                title: "Learning Hub",
                desc: "Access expertly curated courses designed to boost your knowledge and help you stay ahead in your career.",
              },
              {
                title: "Interview Mastery",
                desc: "Prepare for success with mock interviews, personalized feedback, and insider strategies from real professionals.",
              },
              {
                title: "Presentation Coaching",
                desc: "Learn how to present your ideas confidently with guidance on storytelling, clarity, and stage presence.",
              },
            ].map((service, index) => (
              <div
                key={index}
                className="bg-blue-50 p-10 rounded-2xl shadow-md hover:shadow-lg transition-all hover:-translate-y-1 border border-blue-100"
              >
                <h3 className="text-2xl font-semibold mb-4 text-blue-700">
                  {service.title}
                </h3>
                <p className="text-gray-700 leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === Footer Section === */}
      <footer className="bg-blue-700 text-white py-16 mt-16">
        <div className="max-w-6xl mx-auto px-6 md:px-10 grid md:grid-cols-3 gap-10">
          <div>
            <h3 className="text-2xl font-bold mb-4">Learn & Connect 🚀</h3>
            <p className="text-sm leading-relaxed text-gray-200">
              Empowering learners globally to grow, collaborate, and achieve
              excellence through community-driven education and mentorship.
            </p>
          </div>

          <div>
            <h4 className="text-xl font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-gray-200">
              <li>
                <a href="#home" className="hover:text-yellow-300 transition">
                  Home
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-yellow-300 transition">
                  About
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-yellow-300 transition">
                  Services
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-semibold mb-3">Contact Us</h4>
            <ul className="space-y-2 text-gray-200">
              <li>Email: support@learnconnect.com</li>
              <li>Phone: +234 800 123 4567</li>
              <li>Location: Lagos, Nigeria</li>
            </ul>
          </div>
        </div>

        <div className="text-center mt-10 text-sm text-gray-300 border-t border-blue-500 pt-6">
          © {new Date().getFullYear()} Learn & Connect. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default App;
