"use client";

import { motion } from "framer-motion";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <Header />
      <div className="font-sans scroll-smooth">
        <Hero />

        {/* Temporary dashboard link */}
      <Link
        href="/dashboard"
        className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 transition"
      >
        Go to Dashboard
      </Link>
  

        {}
        <section
          id="about"
          className="py-24 bg-linear-to-b from-white to-blue-50 text-gray-800"
        >
          <div className="max-w-6xl mx-auto px-6 md:px-10 grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -80 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              viewport={{ once: true }}
              className="relative h-[380px] rounded-2xl overflow-hidden shadow-lg"
            >
              <Image
                src="/images/about-us.jpg"
                alt="Learn and Connect"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-blue-900/40"></div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              viewport={{ once: true }}
              className="text-center md:text-left"
            >
              <h2 className="text-4xl font-bold mb-6 text-blue-700">
                About <span className="text-yellow-500">Learn & Connect</span>
              </h2>
              <p className="text-lg leading-relaxed mb-4 text-gray-700">
                <strong>Learn & Connect</strong> is a global learning platform
                built to bridge knowledge, skills, and real-world opportunity.
              </p>
              <p className="text-lg leading-relaxed mb-4 text-gray-600">
                We empower learners to grow through mentorship, collaboration,
                and practical learning experiences.
              </p>
              <Link
                href="/signup"
                className="mt-8 inline-block bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition"
              >
                Join the Community
              </Link>
            </motion.div>
          </div>
        </section>

        {}
        <section id="services" className="py-24 bg-white text-center">
          <div className="max-w-6xl mx-auto px-6 md:px-10">
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="text-4xl font-bold mb-14 text-blue-700"
            >
              Our <span className="text-yellow-500">Services</span>
            </motion.h2>

            <div className="grid gap-10 md:grid-cols-3">
              {[
                {
                  title: "Learning Hub",
                  desc: "Access expertly curated courses designed to boost your knowledge and elevate your skills.",
                  image: "/images/l-hub.jpg",
                },
                {
                  title: "Interview Mastery",
                  desc: "Prepare for success with real-world mock interviews and personalized expert feedback.",
                  image: "/images/i-mastery.jpg",
                },
                {
                  title: "Presentation Coaching",
                  desc: "Learn how to confidently present your ideas and make lasting impressions in any setting.",
                  image: "/images/p-coaching.jpg",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: i * 0.2 }}
                  viewport={{ once: true }}
                  className="bg-blue-50 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2"
                >
                  <div className="relative h-48 mb-6 rounded-xl overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="text-2xl font-semibold mb-3 text-blue-700">
                    {item.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {}
        <section
          id="mission"
          className="py-24 bg-linear-to-b from-white to-blue-50 text-gray-800"
        >
          <div className="max-w-6xl mx-auto px-6 md:px-10 grid md:grid-cols-2 gap-16 items-center">
            {}
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="text-center md:text-left"
            >
              <h2 className="text-4xl font-bold mb-6 text-blue-700">
                Our <span className="text-yellow-500">Mission</span>
              </h2>
              <p className="text-lg leading-relaxed mb-4 text-gray-700">
                Our mission is to make learning human, accessible, and
                community-driven. We connect passionate learners with mentors
                and practical resources that transform curiosity into skills and
                opportunities.
              </p>
              <p className="text-lg leading-relaxed text-gray-600">
                By blending technology, mentorship, and collaboration, we help
                learners grow with confidence and build meaningful careers that
                shape the future.
              </p>
            </motion.div>

            {}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
              className="flex justify-center md:justify-end items-center gap-4 md:gap-6 relative"
            >
              {[
                "/images/our-mission1.jpg",
                "/images/our-mission2.jpg",
                "/images/our-mission3.jpg",
              ].map((src, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 * i }}
                  viewport={{ once: true }}
                  className={`relative ${
                    i === 1 ? "h-64" : "h-56"
                  } w-1/3 rounded-2xl overflow-hidden shadow-xl transform ${
                    i === 0
                      ? "md:-rotate-2"
                      : i === 2
                      ? "md:rotate-2"
                      : "z-10 hover:-translate-y-2"
                  } hover:rotate-0 transition duration-500`}
                >
                  <Image src={src} alt={`Mission ${i + 1}`} fill className="object-cover" />
                  <div className="absolute inset-0 bg-blue-900/20"></div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {}
        <section className="py-24 bg-white">
           <div className="max-w-6xl mx-auto px-6 md:px-10 text-center">
            <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-4xl font-bold mb-14 text-blue-700"
          >
            Why Choose <span className="text-yellow-500">Us</span>
            </motion.h2>

            <div className="grid md:grid-cols-3 gap-10">
         {[
            {
              title: "Personalized Learning",
              desc: "We tailor your learning path based on your career goals and progress.",
              image: "/images/p-learning.jpg", 
            },
            {
               title: "Expert Mentorship",
               desc: "Learn directly from experienced mentors who guide you every step of the way.",
               image: "/images/e-mentor.jpg", 
            },
            {
              title: "Global Community",
              desc: "Join thousands of learners and professionals from across the world.",
              image: "/images/g-connect.jpg", 
            },
            ].map((item, i) => (
              <motion.div
              key={i}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: i * 0.2 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)] transition-all duration-500 hover:-translate-y-2"
            >
              {}
              <div className="relative h-52 w-full">
               <Image
                 src={item.image}
                 alt={item.title}
                 fill
                 className="object-cover"
                />
                  <div className="absolute inset-0 bg-linear-to-t from-blue-900/30 via-transparent to-transparent"></div>
               </div>

                  {}
                  <div className="p-8">
                    <h3 className="text-2xl font-semibold mb-3 text-blue-700">
                      {item.title}
                    </h3>
                   <p className="text-gray-700 leading-relaxed">{item.desc}</p>
                 </div>
                 </motion.div>
               ))}
            </div>
         </div>
       </section>


        {}
        <section className="py-24 bg-linear-to-b from-blue-900 to-blue-800 text-white text-center relative overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="relative z-10"
          >
            <h2 className="text-4xl font-bold mb-6">
              Join Our <span className="text-yellow-400">Community</span>
            </h2>
            <p className="text-lg max-w-2xl mx-auto mb-12 text-gray-100">
              Be part of our growing network of learners and get exclusive
              updates on courses, events, and resources.
            </p>

            <form className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full sm:w-2/3 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-yellow-400 text-gray-900"
              />
              <button
                type="submit"
                className="bg-yellow-400 text-blue-900 px-6 py-3 rounded-xl font-semibold hover:bg-yellow-300 transition"
              >
                Subscribe
              </button>
            </form>
          </motion.div>
        </section>

          {}
          <footer className="bg-blue-700 text-white py-16 mt-16">
          <div className="max-w-6xl mx-auto px-6 md:px-10 grid md:grid-cols-3 gap-10">
            <div>
              <h3 className="text-2xl font-bold mb-4">Learn & Connect</h3>
              <p className="text-sm leading-relaxed text-gray-200">
                Empowering learners globally to grow and achieve excellence.
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
                  <a
                    href="#services"
                    className="hover:text-yellow-300 transition"
                  >
                    Services
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-3">Contact Us</h4>
              <ul className="space-y-2 text-gray-200">
                <li>Email: support@learnconnect.com</li>
                <li>Phone: +234 7026089954</li>
                <li>Location: Lagos, Nigeria</li>
              </ul>
            </div>
          </div>
          <div className="text-center mt-10 text-sm text-gray-300 border-t border-blue-500 pt-6">
            © {new Date().getFullYear()} Learn & Connect. All rights reserved.
          </div>
        </footer>
      </div>
    </>
  );
}
