/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const features = [
  {
    title: "Deep Code Analysis",
    description:
      "Connect your GitHub account and let our AI perform a deep, read-only analysis of your repositories. We identify anti-patterns, security risks, and areas for improvement without ever writing to your code.",
    id: "analyze",
  },
  {
    title: "Personalized Learning Paths",
    description:
      "Based on the analysis, we generate a hyper-personalized curriculum just for you. Get a clear path with articles, videos, and hands-on challenges to fill your specific knowledge gaps.",
    id: "learn",
  },
  {
    title: "Interactive Challenges",
    description:
      "Apply what you've learned with project-based challenges tailored to your codebase. Solidify your new skills by building real features and fixing real issues, directly inspired by your own projects.",
    id: "grow",
  },
];

export default function LandingPage({ session }: { session: any }) {
  const [activeFeature, setActiveFeature] = useState(features[0]);

  return (
    <div className="w-full text-white">
      {/* Hero Section */}
      <section className="py-20 text-center md:py-32">
        {/* ... same hero section code as before ... */}
        <div className="container mx-auto">
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
          <div className="mt-8">
            <Link
              href={session?.user ? "/dashboard" : "/api/auth/signin"}
              className="rounded-full bg-purple-600 px-10 py-4 font-semibold no-underline transition hover:bg-purple-500"
            >
              {session?.user ? "Go to Your Dashboard" : "Get Started for Free"}
            </Link>
          </div>
        </div>
      </section>

      {/* New Interactive Features Section */}
      <section id="features" className="bg-gray-800/50 py-24">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-bold">A Better Way to Upskill</h2>
              <p className="mt-4 text-lg text-gray-400">
                Traditional courses are slow. Random tutorials are disconnected.
                CodeCompass provides the just-in-time learning you actually
                need.
              </p>
              <div className="mt-8 flex flex-col gap-4">
                {features.map((feature) => (
                  <button
                    key={feature.id}
                    onClick={() => setActiveFeature(feature)}
                    className={`rounded-lg p-4 text-left transition ${activeFeature.id === feature.id ? "bg-purple-600/50" : "hover:bg-gray-700/50"}`}
                  >
                    <h3 className="text-lg font-semibold">{feature.title}</h3>
                  </button>
                ))}
              </div>
            </div>
            <div className="relative h-64 rounded-lg bg-gray-900 p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFeature.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 flex flex-col justify-center p-8"
                >
                  <h3 className="text-2xl font-bold text-purple-400">
                    {activeFeature.title}
                  </h3>
                  <p className="mt-4 text-gray-300">
                    {activeFeature.description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action Section */}
      <section className="py-20">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold">
            Ready to Supercharge Your Growth?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">
            Stop wasting time on generic tutorials. Start learning what matters,
            right now.
          </p>
          <div className="mt-8">
            <Link
              href={session?.user ? "/dashboard" : "/api/auth/signin"}
              className="transform rounded-full bg-purple-600 px-12 py-5 text-lg font-semibold no-underline shadow-lg shadow-purple-600/30 transition hover:-translate-y-1 hover:bg-purple-500"
            >
              Analyze Your First Repo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
