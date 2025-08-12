/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { motion } from "framer-motion";

// Helper function to combine class names
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const { data: session } = useSession();

  // Define the navigation items
  const navItems = [
    { name: "Home", href: "/" },
    { name: "Features", href: "/#features" },
    { name: "Pricing", href: "/#pricing" },
    // The Dashboard link will only be shown if the user is logged in
    ...(session?.user ? [{ name: "Dashboard", href: "/dashboard" }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-gray-700/50 bg-gray-900/80 backdrop-blur-lg">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4 text-white">
        {/* Left: Logo */}
        <div className="flex-1">
          <Link
            href="/"
            className="text-2xl font-bold text-purple-400 transition-colors hover:text-purple-300"
          >
            CodeCompass
          </Link>
        </div>

        {/* Center: Navigation Links */}
        <div className="hidden flex-1 items-center justify-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-gray-300 transition-colors hover:text-white"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Right: Auth Buttons / User Menu */}
        <div className="flex flex-1 items-center justify-end">
          {session?.user ? (
            <Menu as="div" className="relative ml-3">
              <div>
                <Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-none">
                  <span className="sr-only">Open user menu</span>
                  <img
                    className="h-8 w-8 rounded-full"
                    src={
                      session.user.image ??
                      `https://avatar.vercel.sh/${session.user.name}.png`
                    }
                    alt=""
                  />
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="ring-opacity-5 absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-gray-800 py-1 shadow-lg ring-1 ring-black focus:outline-none">
                  {/* "Your Dashboard" link is removed from here */}
                  <Menu.Item>
                    {({ active }) => (
                      <span
                        className={classNames(
                          active ? "bg-gray-700" : "",
                          "block cursor-not-allowed px-4 py-2 text-sm text-gray-500",
                        )}
                        title="Coming Soon!"
                      >
                        Settings
                      </span>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => signOut()}
                        className={classNames(
                          active ? "bg-gray-700" : "",
                          "block w-full px-4 py-2 text-left text-sm text-white",
                        )}
                      >
                        Sign out
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          ) : (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <button
                onClick={() => signIn("github")}
                className="rounded-md bg-purple-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-purple-600/20 transition hover:bg-purple-500"
              >
                Sign In
              </button>
            </motion.div>
          )}
        </div>
      </nav>
    </header>
  );
}
