/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

// SVG Icon Components
const ConnectIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-8 w-8 text-purple-400"
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
    className="h-8 w-8 text-purple-400"
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
    className="h-8 w-8 text-purple-400"
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
const IdeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-8 w-8 text-purple-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
    />
  </svg>
);

export default function LandingPage({ session }: { session: any }) {
  const [billingCycle, setBillingCycle] = useState("monthly");

  const featureVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="w-full text-white">
      {/* Hero Section */}
      <section className="py-24 text-center md:py-40">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4"
        >
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-7xl">
            Your Code is Smart.
            <br />
            <span className="text-purple-400">
              Your Learning Path Should Be, Too.
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg text-gray-300 md:text-xl">
            CodeCompass is your AI-powered mentor, turning your own code into a
            personalized curriculum. Find your blind spots and master the skills
            you need to excel.
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-10 inline-block"
          >
            <Link
              href={session?.user ? "/dashboard" : "/api/auth/signin"}
              className="rounded-full bg-purple-600 px-10 py-4 font-semibold no-underline shadow-lg shadow-purple-600/30 transition hover:bg-purple-500"
            >
              {session?.user ? "Go to Your Dashboard" : "Start For Free"}
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="border-y border-gray-800 bg-gray-900/50 py-24"
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            A Smarter Way to Upskill
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">
            Our platform is designed to integrate seamlessly into your workflow.
          </p>
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: <ConnectIcon />,
                title: "Deep Code Analysis",
                text: "Connect GitHub to perform a deep, read-only analysis of your repositories to understand your unique coding style.",
              },
              {
                icon: <IdentifyIcon />,
                title: "Personalized Gap Detection",
                text: "We identify conceptual gaps and architectural anti-patterns, not just simple linting errors.",
              },
              {
                icon: <GrowIcon />,
                title: "Actionable Learning Paths",
                text: "Receive a tailored path with articles, videos, and challenges to master new skills effectively.",
              },
              {
                icon: <IdeIcon />,
                title: "IDE Integration",
                text: "Get real-time feedback and suggestions directly in your code editor with our VS Code extension. (Coming Soon)",
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                className="flex flex-col items-center rounded-xl border border-gray-800 bg-gray-900 p-8 text-center"
                variants={featureVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{
                  y: -10,
                  boxShadow:
                    "0 20px 25px -5px rgba(168, 85, 247, 0.1), 0 10px 10px -5px rgba(168, 85, 247, 0.04)",
                }}
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-purple-900/50">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="mt-4 text-sm text-gray-400">{feature.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Simple, Transparent Pricing
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">
            Choose the plan that&apos;s right for you. Get started for free.
          </p>
          <div className="mt-16 flex justify-center">
            <div className="flex rounded-full bg-gray-800 p-1.5">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`rounded-full px-6 py-2 text-sm font-semibold transition-colors ${billingCycle === "monthly" ? "bg-purple-600 text-white" : "text-gray-400 hover:text-white"}`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                className={`rounded-full px-6 py-2 text-sm font-semibold transition-colors ${billingCycle === "yearly" ? "bg-purple-600 text-white" : "text-gray-400 hover:text-white"}`}
              >
                Yearly (Save 20%)
              </button>
            </div>
          </div>
          <div className="mx-auto mt-10 max-w-md">
            <AnimatePresence mode="wait">
              <motion.div
                key={billingCycle}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.25 }}
                className="rounded-xl border border-purple-500/50 bg-gray-900 p-8 shadow-2xl shadow-purple-900/20"
              >
                <h3 className="text-2xl font-semibold">Pro Plan</h3>
                <p className="mt-4 text-gray-400">
                  Unlock your full potential with unlimited analyses, private
                  repos, and advanced insights.
                </p>
                {billingCycle === "monthly" ? (
                  <p className="mt-8 text-5xl font-extrabold">
                    $15{" "}
                    <span className="text-lg font-medium text-gray-400">
                      / month
                    </span>
                  </p>
                ) : (
                  <p className="mt-8 text-5xl font-extrabold">
                    $144{" "}
                    <span className="text-lg font-medium text-gray-400">
                      / year
                    </span>
                  </p>
                )}
                <button
                  className="mt-8 w-full rounded-lg bg-purple-600 py-3 font-semibold transition hover:bg-purple-500"
                  disabled
                >
                  Coming Soon
                </button>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        id="testimonials"
        className="border-t border-gray-800 bg-gray-900/50 py-24"
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Don&apos;t Just Take Our Word For It
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">
            Developers are saving time and leveling up faster than ever before.
          </p>
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "Sarah L.",
                role: "Frontend Developer",
                text: "I finally understood React Hooks properly because CodeCompass gave me a challenge related to my own project. Mind-blowing!",
                avatar: "https://avatar.vercel.sh/sarah.png",
              },
              {
                name: "Mike R.",
                role: "Backend Engineer",
                text: "This is the first learning tool that doesn't feel like a chore. The analysis found an N+1 query I'd missed for weeks.",
                avatar: "https://avatar.vercel.sh/mike.png",
              },
              {
                name: "Jenna K.",
                role: "Full-Stack Developer",
                text: "As a team lead, this is a game-changer. I can finally get a real sense of where my team's strengths and weaknesses are.",
                avatar: "https://avatar.vercel.sh/jenna.png",
              },
            ].map((testimonial) => (
              <motion.div
                key={testimonial.name}
                className="flex flex-col rounded-xl border border-gray-800 bg-gray-900 p-8"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <p className="flex-grow text-gray-300">
                  &quot;{testimonial.text}&quot;
                </p>
                <div className="mt-6 flex items-center">
                  <img
                    className="h-12 w-12 rounded-full"
                    src={testimonial.avatar}
                    alt={testimonial.name}
                  />
                  <div className="ml-4 text-left">
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-gray-800 bg-gray-900/50 py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to Elevate Your Skills?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">
            Stop the endless tutorial cycle. Get a learning path that&apos;s as
            unique as your codebase.
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-10 inline-block"
          >
            <Link
              href={session?.user ? "/dashboard" : "/api/auth/signin"}
              className="rounded-full bg-purple-600 px-10 py-4 font-semibold no-underline shadow-lg shadow-purple-600/30 transition hover:bg-purple-500"
            >
              Start Your First Analysis
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
