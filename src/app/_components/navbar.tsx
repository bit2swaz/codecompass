/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";

// Helper function to combine class names
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const { data: session } = useSession();

  const navItems = [
    { name: "Pricing", href: "#", disabled: true },
    { name: "Docs", href: "#", disabled: true },
    { name: "Roadmap", href: "#", disabled: true },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-gray-700/50 bg-gray-900/80 backdrop-blur">
      <nav className="container mx-auto flex items-center justify-between p-4 text-white">
        {/* Logo and Nav Links */}
        <div className="flex items-center gap-8">
          <Link href="/" className="text-2xl font-bold text-purple-400">
            CodeCompass
          </Link>
          <div className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              <span
                key={item.name}
                className="cursor-not-allowed text-sm font-medium text-gray-500"
                title="Coming Soon!"
              >
                {item.name}
              </span>
            ))}
          </div>
        </div>

        {/* Auth Buttons / User Menu */}
        <div>
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
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        href="/dashboard"
                        className={classNames(
                          active ? "bg-gray-700" : "",
                          "block px-4 py-2 text-sm text-white",
                        )}
                      >
                        Your Dashboard
                      </Link>
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
            <button
              onClick={() => signIn("github")}
              className="rounded-md bg-purple-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-purple-500"
            >
              Sign In
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
