"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"
import { useState } from "react"

const navItems = [
  { name: "City Hall", href: "city-hall" },
  { name: "The Mayor", href: "mayor" },
  { name: "Congressman", href: "congressman" },
  { name: "City Council", href: "city-council" },
  { name: "City Barangays", href: "barangays" },
]

export default function AboutNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 top-30 z-30 w-64 bg-white border-r shadow-md transform transition-transform duration-300 
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            About San Pablo City
          </h2>
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block px-4 py-2 rounded-md font-medium transition-colors ${
                  pathname === item.href
                    ? "bg-emerald-600 text-white shadow"
                    : "text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:ml-0 ml-0">
        {/* Mobile Toggle Button */}
        <button
          className="md:hidden mb-4 flex items-center gap-2 text-gray-700"
          onClick={() => setOpen(!open)}
        >
          <Menu className="h-5 w-5" />
          Menu
        </button>

        <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to San Pablo City
          </h1>
          <p className="text-gray-600 leading-relaxed">
            Select a section from the navigation menu to learn more about San Pablo’s 
            government, leaders, and community.
          </p>
        </div>
      </main>
    </div>
  )
}
