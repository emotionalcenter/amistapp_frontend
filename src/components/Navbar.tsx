import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Navbar() {
  return (
    <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center gap-3 p-4">
        <img
          src={logo}
          alt="AmistApp Logo"
          className="w-10 h-10 rounded-lg shadow-sm"
        />
        <h1 className="text-xl font-semibold text-gray-700">Amistapp</h1>
      </div>
    </header>
  );
}
