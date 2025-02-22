import { HelpCircle, Coffee } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Link } from "react-router-dom"
import BottomNavBar from "./Bottom-navbar"

export default function CafeHome() {
  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <main className="pb-16">
        {" "}
        {/* Add padding bottom to account for navigation */}
        {/* Welcome Section */}
        <div className="px-6 py-8">
          <h1 className="text-2xl font-normal text-center leading-tight">
            Welcome back Esteban,
            <br />
            what do you want to do today?
          </h1>
        </div>
        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-4 px-6 mb-8">
          <Link to="/help" className="flex flex-col items-center p-4 bg-gray-100 rounded-2xl">
            <HelpCircle className="w-8 h-8 mb-2" />
            <span>Help</span>
          </Link>
          <Link to="/reserve" className="flex flex-col items-center p-4 bg-gray-100 rounded-2xl">
            <Coffee className="w-8 h-8 mb-2" />
            <span>Reserve</span>
          </Link>
          <Link to="/food" className="flex flex-col items-center p-4 bg-gray-100 rounded-2xl">
            <span className="h-8 mb-2" />
            <span>Food</span>
          </Link>
        </div>
        {/* News Section */}
        <div className="px-6">
          <h2 className="text-2xl font-bold mb-4">Latest news and offers</h2>
          <div className="space-y-4">
            <Card className="p-6 rounded-3xl border-2">
              <h3 className="text-xl font-bold italic mb-2">Gaming until your eyes hurt (and then some more)</h3>
              <p className="text-lg">Book 5 hours in a Gaming Room and the 6th is free! 🎮😎</p>
            </Card>

            <Card className="p-6 rounded-3xl border-2">
              <h3 className="text-xl font-bold italic mb-2">Are you an artist? So are we (in our dreams)!</h3>
              <p className="text-lg">Book a Reading/Drawing Room and get a free art kit! 🎨✨</p>
            </Card>

            <Card className="p-6 rounded-3xl border-2">
              <h3 className="text-xl font-bold italic mb-2">Are you a Grandmaster in LoL?</h3>
              <p className="text-lg">Prove it and claim your free Monster! 🎮⚡</p>
            </Card>
          </div>
        </div>
      </main>
      <BottomNavBar />
    </div>
  )
}

