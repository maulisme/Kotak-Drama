import Link from "next/link"
import { Download, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DownloadsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-[#00d4bd] hover:text-rose-400 mb-8">
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Beranda</span>
        </Link>
        
        <h1 className="text-3xl font-bold mb-8">Download DramaBox APK</h1>
        
        <div className="grid gap-8 md:grid-cols-2">
          {/* Official APK */}
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <h2 className="text-xl font-semibold text-[#00d4bd] mb-4">Official APK</h2>
            <p className="text-gray-400 mb-6">
              Download versi resmi DramaBox APK. Versi ini direkomendasikan untuk pengalaman terbaik.
              Tautan ini akan mengarah ke halaman unduhan resmi DramaBox di Google Play Store.
            </p>
            <a
            href="https://play.google.com/store/apps/details?id=com.storymatrix.drama&hl=id"
            target="_blank"
            rel="noopener noreferrer"
            >
            <Button className="w-full mt-6 bg-[#00d4bd] hover:bg-[#00b3a0] text-black">
                <Download className="h-4 w-4 mr-2" />
                Download Official APK
            </Button>
            </a>
          </div>

          {/* Unofficial APK */}
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <h2 className="text-xl font-semibold text-[#00d4bd] mb-4">Unofficial APK</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span>•</span>
                <span>MD5: a2df006182581df4c79b948f350390f7</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span>•</span>
                <span>SHA1: fad72cba67ca89b739accc22e7ee6362e1c2d5c9</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span>•</span>
                <span>Vitus Total: <a href="https://www.virustotal.com/gui/file/b13918e593171b7b40b8de5f68f0a04e399cce4b6b69c46b5881f06cf675f82c">b13918e593171b7b40b8de5f68f0a04e399cce4b6b69c46b5881f06cf675f82c</a></span>
              </div>
            </div>
            <a href="Kotak-Drama.apk">
            <Button className="w-full mt-6 bg-[#00d4bd] hover:bg-[#00b3a0] text-black">
              <Download className="h-4 w-4 mr-2" />
              Download Unofficial APK
            </Button>
            </a>
          </div>
        </div>

        <div className="mt-8 p-6 bg-gray-900 rounded-lg border border-gray-800">
          <h3 className="text-lg font-semibold text-[#00d4bd] mb-4">Cara Install APK</h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-400">
            <li>Download APK dari link di atas</li>
            <li>Buka file APK yang sudah didownload</li>
            <li>Izinkan instalasi dari sumber tidak dikenal di pengaturan Android</li>
            <li>Ikuti petunjuk instalasi</li>
            <li>Buka aplikasi dan mulai streaming drama favorit Anda</li>
          </ol>
        </div>
      </div>
    </div>
  )
} 