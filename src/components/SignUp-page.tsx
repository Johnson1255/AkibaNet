import { useState } from "react";
import { ArrowLeft, CalendarIcon } from "lucide-react";
import { format, subYears } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export default function SignUpPage() {
  const [date, setDate] = useState<Date>();

  // Calculate the date 18 years ago from today
  const maxDate = subYears(new Date(), 18);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="p-4 flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-2xl font-normal">Register</h1>
        <div className="w-10" /> {/* Spacer for alignment */}
      </header>

      <div className="max-w-md mx-auto p-6 space-y-8">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-center">
            Create your account
          </h2>
          <p className="text-gray-500 text-center">
            Enter your information to register
          </p>
        </div>

        <form className="space-y-6">
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="Enter your full name"
              className="h-12"
              required
            />
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="h-12"
              required
            />
          </div>

          {/* Telephone Field */}
          <div className="space-y-2">
            <Label htmlFor="telephone">Telephone</Label>
            <Input
              id="telephone"
              type="tel"
              placeholder="Enter your telephone number"
              className="h-12"
              required
            />
          </div>

          {/* Date of Birth Field */}
          <div className="space-y-2">
            <Label htmlFor="dob">Date of Birth</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="dob"
                  variant={"outline"}
                  className={cn(
                    "w-full h-12 justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(date) => date > maxDate || date > new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <p className="text-sm text-muted-foreground">
              You must be at least 18 years old to register
            </p>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-12 bg-black text-white hover:bg-black/90"
          >
            Create Account
          </Button>
        </form>
      </div>
    </div>
  );
}
