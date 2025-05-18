import { Instagram } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-black px-4 py-6 text-center text-sm text-gray-400 md:px-6">
      <p className="flex items-center justify-center gap-1">
        Devised with 🗿 by Bored People
      </p>
      <div className="flex justify-center items-center space-x-2 mt-4">
        <h4>Follow me on</h4>
        <a
          href="https://instagram.com/_mmaul_"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-white"
        >
          <Instagram className="h-5 w-5" />
        </a>          
      </div>
    </footer>
  )
} 