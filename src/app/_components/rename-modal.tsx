"use client";

import { useState, Fragment, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";

type RenameModalProps = {
  isOpen: boolean;
  onCloseAction: () => void;
  onSaveAction: (newName: string) => void;
  currentName: string;
  isSaving: boolean;
};

export default function RenameModal({
  isOpen,
  onCloseAction,
  onSaveAction,
  currentName,
  isSaving,
}: RenameModalProps) {
  const [newName, setNewName] = useState(currentName);

  useEffect(() => {
    setNewName(currentName);
  }, [currentName]);

  const handleSave = () => {
    if (newName.trim()) {
      onSaveAction(newName.trim());
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onCloseAction={onCloseAction}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg leading-6 font-medium text-white"
                >
                  Rename Analysis
                </Dialog.Title>
                <div className="mt-4">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full rounded-md border border-gray-600 bg-gray-700 px-4 py-2 text-white placeholder-gray-500 focus:border-purple-400 focus:ring focus:ring-purple-500/50 focus:outline-none"
                  />
                </div>

                <div className="mt-6 flex justify-end gap-4">
                  <button
                    type="button"
                    className="rounded-md px-4 py-2 text-sm font-medium text-gray-400 hover:text-white"
                    onClick={onCloseAction}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-purple-500 disabled:bg-gray-600"
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving ? "Saving..." : "Save"}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
