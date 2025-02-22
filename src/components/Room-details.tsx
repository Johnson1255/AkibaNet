import { ArrowLeft, ArrowRight, Image, Clock, ChevronDown, Plus} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"

export default function RoomDetails() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="p-4 flex items-center justify-between">
        <Button variant="ghost" size="icon" className="rounded-full">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-2xl font-normal">Gaming Room #14</h1>
        <div className="w-6" /> {/* Spacer for alignment */}
      </header>

      {/* Room Preview */}
      <div className="px-4 mb-4">
        <Card className="bg-gray-100 p-8 flex items-center justify-between rounded-2xl">
          <Image className="w-12 h-12 mx-auto" />
          <ArrowRight className="w-6 h-6" />
        </Card>
      </div>

      {/* Details */}
      <div className="px-4 mb-6">
        <Card className="p-6 rounded-2xl">
          <h2 className="text-xl font-bold mb-4">Details</h2>
          <ul className="space-y-4">
            <li>Size: 4m² (private and comfortable space).</li>
            <li>
              Included:
              <ul className="ml-6 space-y-2 mt-2">
                <li>High-speed Wi-Fi: Ultra-fast connection for gaming and streaming.</li>
                <li>Gaming PC: High-performance setup (technical specs available).</li>
              </ul>
            </li>
          </ul>
        </Card>
      </div>

      {/* Booking Section */}
      <div className="px-4 space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <Button variant="outline" className="w-full rounded-full bg-gray-100 border-0">
              <span>10:00 pm</span>
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
            <span className="text-sm block mt-1">Time</span>
          </div>

          <Clock className="w-8 h-8" />

          <div className="flex-1">
            <Button variant="outline" className="w-full rounded-full bg-gray-100 border-0">
              <span>Today</span>
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        <div>
          <div className="text-right mb-2">¥800-15,000</div>
          <Slider defaultValue={[20]} max={100} step={1} className="mb-2" />
          <div className="text-sm text-gray-500">¥800 for 1 hour. Max. 12 hours</div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4">
          <Button variant="outline" className="w-full rounded-full h-12 bg-gray-100 border-0">
            Add services
            <Plus className="ml-2 h-5 w-5" />
          </Button>

          <Button variant="default" className="w-full rounded-full h-12 bg-black text-white hover:bg-black/90">
            Confirm and Pay
          </Button>
        </div>
      </div>
    </div>
  )
}

