"use client";

import { useState, Fragment } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { api } from "~/trpc/react";

// SVG Icons
const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
      clipRule="evenodd"
    />
  </svg>
);
const SelectorIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-gray-400"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
      clipRule="evenodd"
    />
  </svg>
);
const LockClosedIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4 text-gray-500"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
      clipRule="evenodd"
    />
  </svg>
);

type Repo = {
  id: number;
  name: string;
  isPrivate: boolean;
  url: string;
};

export default function RepoSelector({
  onSelectRepoAction,
}: {
  onSelectRepoAction: (url: string) => void;
}) {
  const { data: repos, isLoading, error } = api.github.getUserRepos.useQuery();
  const [selected, setSelected] = useState<Repo | null>(null);
  const [query, setQuery] = useState("");

  const filteredRepos =
    query === ""
      ? repos
      : repos?.filter((repo) =>
          repo.name
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, "")),
        );

  const handleSelect = (repo: Repo) => {
    setSelected(repo);
    onSelectRepoAction(repo.url);
  };

  if (isLoading)
    return (
      <div className="rounded-md bg-gray-800 p-4 text-center text-gray-400">
        Loading repositories...
      </div>
    );
  if (error)
    return (
      <div className="rounded-md bg-red-900/50 p-4 text-center text-red-400">
        Error: {error.message}
      </div>
    );

  return (
    <Combobox value={selected} onChange={handleSelect}>
      <div className="relative">
        <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-gray-800 text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-purple-300 sm:text-sm">
          <Combobox.Input
            className="w-full border-none bg-gray-800 py-3 pr-10 pl-3 text-sm leading-5 text-white focus:ring-0"
            displayValue={(repo: Repo) => repo?.name ?? ""}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search for a repository..."
          />
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
            <SelectorIcon />
          </Combobox.Button>
        </div>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setQuery("")}
        >
          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-gray-800 py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
            {filteredRepos?.length === 0 && query !== "" ? (
              <div className="relative cursor-default px-4 py-2 text-gray-400 select-none">
                Nothing found.
              </div>
            ) : (
              filteredRepos?.map((repo) => (
                <Combobox.Option
                  key={repo.id}
                  className={({ active }) =>
                    `relative cursor-default py-2 pr-4 pl-10 select-none ${
                      active ? "bg-purple-600 text-white" : "text-gray-300"
                    }`
                  }
                  value={repo}
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={`block truncate ${selected ? "font-medium" : "font-normal"}`}
                      >
                        <div className="flex items-center gap-2">
                          {repo.isPrivate && <LockClosedIcon />}
                          {repo.name}
                        </div>
                      </span>
                      {selected ? (
                        <span
                          className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? "text-white" : "text-purple-600"}`}
                        >
                          <CheckIcon />
                        </span>
                      ) : null}
                    </>
                  )}
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  );
}
