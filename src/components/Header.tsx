"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "./ThemeProvider"

export default function Header() {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="border-b border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 dark:backdrop-blur-sm sticky top-0 z-50 transition-colors">
      <div className="container mx-auto px-4 py-4 md:py-6 flex items-center justify-between max-w-7xl">
        <div className="flex items-center gap-3">
          <img src="download.jpeg" className="w-10 h-10 rounded-lg"/>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Cord4 AI Image Gen</h1>
            <p className="text-xs text-gray-600 dark:text-slate-400">Create stunning images with AI</p>
          </div>
        </div>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-gray-200 dark:bg-slate-800 hover:bg-gray-300 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 dark:hover:text-white transition-colors"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </header>
  )
}
