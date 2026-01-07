
import Header from "./components/Header"
import ImageGenerator from "./components/ImageGenerator"
import { ThemeProvider } from "./components/ThemeProvider"

export default function Home() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors">
        <Header />
        <main className="container mx-auto px-4 py-8 md:py-12 max-w-7xl">
          <ImageGenerator />
        </main>
      </div>
    </ThemeProvider>
  )
}
