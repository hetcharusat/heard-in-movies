"use client";

import Link from "next/link";
import { Plus, Home, Table } from "lucide-react";
import { motion } from "framer-motion";

export function AddButton() {
  return (
    <motion.div
      whileHover={{ scale: 1.1, rotate: 5 }}
      whileTap={{ scale: 0.9, rotate: -10 }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
    >
      <Link 
        href="/add"
        className="brutal-btn w-10 h-10 flex items-center justify-center bg-cyan-400 cursor-pointer"
        aria-label="Add new entry"
      >
        <Plus size={24} strokeWidth={3} />
      </Link>
    </motion.div>
  );
}

export function HomeButton() {
  return (
    <motion.div
      whileHover={{ scale: 1.1, rotate: -5 }}
      whileTap={{ scale: 0.9, rotate: 10 }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
    >
      <Link
        href="/"
        className="w-10 h-10 brutal-btn bg-cyan-400 flex items-center justify-center text-black cursor-pointer"
        aria-label="Back to List"
      >
        <Home size={20} strokeWidth={3} />
      </Link>
    </motion.div>
  );
}

export function TableButton() {
  return (
    <motion.div
      whileHover={{ scale: 1.1, rotate: 5 }}
      whileTap={{ scale: 0.9, rotate: -10 }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
    >
      <a 
        href="https://docs.google.com/spreadsheets/d/1scVq_Wmz_z0g8qhVMtbRDX-4AM4Ci57RmdO6cDgQrIo/edit?usp=sharing"
        target="_blank"
        rel="noreferrer"
        className="w-10 h-10 brutal-btn bg-green-400 flex items-center justify-center text-black cursor-pointer"
        title="Open Google Sheet"
      >
        <Table size={20} strokeWidth={3} />
      </a>
    </motion.div>
  );
}
