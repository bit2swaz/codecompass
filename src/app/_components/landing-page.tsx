/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { motion } from "framer-motion";

// SVG Icon Components
const ConnectIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-10 w-10 text-purple-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13 10V3L4 14h7v7l9-11h-7z"
    />
  </svg>
);
const IdentifyIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-10 w-10 text-purple-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);
const GrowIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-10 w-10 text-purple-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
    />
  </svg>
);

export default function LandingPage({ session }: { session: any }) {
  const featureVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="w-full text-white">
      {/* Hero Section */}
      <section className="py-20 text-center md:py-32">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto"
        >
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            Your Code is Smart.
            <br />
            <span className="text-purple-400">
              Your Learning Path Should Be, Too.
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg text-gray-300 md:text-xl">
            Stop guessing what to learn next. CodeCompass analyzes your GitHub
            projects to create a personalized curriculum that closes your
            real-world skill gaps.
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-8 inline-block"
          >
            <Link
              href={session?.user ? "/dashboard" : "/api/auth/signin"}
              className="rounded-full bg-purple-600 px-10 py-4 font-semibold no-underline shadow-lg shadow-purple-600/20 transition"
            >
              {session?.user ? "Go to Your Dashboard" : "Get Started for Free"}
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="border-y border-gray-800 bg-gray-900/50 py-24">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight">How It Works</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">
            A simple yet powerful workflow to accelerate your growth.
          </p>
          <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-3">
            {[
              {
                icon: <ConnectIcon />,
                title: "1. Connect & Analyze",
                text: "Securely connect your GitHub account. CodeCompass performs a deep, read-only analysis of your repositories.",
              },
              {
                icon: <IdentifyIcon />,
                title: "2. Identify Gaps",
                text: "Our AI engine identifies anti-patterns, security risks, and areas where new technologies could improve your code.",
              },
              {
                icon: <GrowIcon />,
                title: "3. Learn & Grow",
                text: "Receive a hyper-personalized learning path with articles, videos, and project-based challenges to fill your knowledge gaps.",
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                className="flex flex-col items-center rounded-lg bg-gray-800 p-8"
                variants={featureVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-purple-400">
                  {feature.title}
                </h3>
                <p className="mt-4 text-gray-400">{feature.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Built for the Modern Developer
          </h2>
          <div className="mx-auto mt-12 max-w-4xl">
            <div className="relative rounded-lg bg-gray-900 p-8 shadow-2xl">
              <div className="absolute top-4 left-4 text-6xl font-bold text-purple-500/20">
                “
              </div>
              <p className="relative z-10 text-xl text-gray-300 italic">
                &quot;CodeCompass found three major performance issues in my
                side project that I had completely missed. The learning path it
                generated was spot on. It feels like having a senior dev
                reviewing my code 24/7.&quot;
              </p>
              <p className="mt-6 font-semibold text-purple-400">
                - Brodie C., Full-Stack Dev
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
