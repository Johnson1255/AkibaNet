import { ArrowLeft, User, ChevronRight, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import BottomNavBar from "./Bottom-navbar"

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="p-4 flex items-center justify-between">
        <Button variant="ghost" size="icon" className="rounded-full">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-2xl font-normal">Account</h1>
        <div className="w-10" /> {/* Spacer for alignment */}
      </header>

      {/* Profile Section */}
      <div className="px-6 py-4 flex items-center gap-4">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
          <User className="w-8 h-8 text-gray-400" />
        </div>
        <div>
          <h2 className="text-xl font-normal">Esteban Quiceno</h2>
          <p className="text-gray-500">tilin.insano@yopmail.com</p>
        </div>
      </div>

      <Separator className="my-4" />

      {/* Reservation History */}
      <div className="px-6 py-4">
        <h2 className="text-2xl font-bold mb-4">Reservation history</h2>
        <div className="space-y-3">
          <div className="border rounded-xl p-4 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-normal">Gaming Room #24</h3>
              <p className="text-gray-500">2025-01-15 | 2 hours</p>
            </div>
            <span className="text-lg">¥ 1700</span>
          </div>
          <div className="border rounded-xl p-4 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-normal">Gaming Room #5</h3>
              <p className="text-gray-500">2025-01-18 | 2 hours</p>
            </div>
            <span className="text-lg">¥ 1700</span>
          </div>
        </div>
        <Button variant="ghost" className="w-full mt-2 text-gray-500">
          View all reservations <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {/* Settings */}
      <div className="px-6 py-4">
        <h2 className="text-2xl font-bold mb-4">Settings</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b">
            <span className="text-lg">Language</span>
            <Button variant="ghost" className="text-gray-500">
              English <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center justify-between py-2 border-b">
            <span className="text-lg">Notifications</span>
            <Switch />
          </div>
          <div className="flex items-center justify-between py-2 border-b">
            <span className="text-lg">Payment Methods</span>
            <Button variant="ghost" className="text-gray-500">
              ****5831 <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Log Out Button */}
      <div className="px-6 py-4">
        <Button variant="default" className="w-full bg-black text-white rounded-xl h-12">
          Log Out <LogOut className="ml-2 h-4 w-4" />
        </Button>
      </div>
      <BottomNavBar />
    </div>
  )
}