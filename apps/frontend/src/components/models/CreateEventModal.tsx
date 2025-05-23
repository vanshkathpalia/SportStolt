import React, { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import axios from "axios"
import { BACKEND_URL } from "../../config"

interface CreateEventModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CreateEventModal({ isOpen, onClose }: CreateEventModalProps) {
  const [name, setName] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [country, setCountry] = useState("")
  const [stadium, setStadium] = useState("")
  const [organisedBy, setOrganisedBy] = useState("")
  const [image, setImage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Compose startTime as ISO string combining date + time
      const startDateTime = new Date(`${startDate}T${startTime}`)

      // Backend expects dates as ISO strings or date objects:
      const formData = {
        name,
        StartDate: startDate,
        EndDate: endDate,
        StartTime: startDateTime.toISOString(),
        city,
        state,
        country,
        stadium,
        OrganisedBy: organisedBy,
        image,
      }

      await axios.post(`${BACKEND_URL}/api/v1/event`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      // Reset form and close modal
      setName("")
      setStartDate("")
      setEndDate("")
      setStartTime("")
      setCity("")
      setState("")
      setCountry("")
      setStadium("")
      setOrganisedBy("")
      setImage("")
      onClose()
    } catch (error) {
      console.error("Error creating event:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-black dark:text-white">Create New Event</DialogTitle>
          <p className="text-black dark:text-gray-500">All fields are necessary</p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">

          <div>
            <Label className="block text-sm font-medium dark:text-white text-black mb-2">Event Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border dark:border-gray-700 rounded-lg dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              placeholder="Enter event name"
            />
          </div>

          <div>
            <Label className="block text-sm font-medium dark:text-white text-black mb-2">Organised By</Label>
            <Input
              value={organisedBy}
              onChange={(e) => setOrganisedBy(e.target.value)}
              className="w-full px-3 py-2 border dark:border-gray-700 rounded-lg dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Organiser name"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4 dark:text-white text-black">
            <div className="space-y-2">
                <Label className="block text-sm font-medium dark:text-white text-black mb-2">Start Date</Label>
                <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border dark:border-gray-700 rounded-lg dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                />
            </div>

            <div className="space-y-2">
                <Label className="block text-sm font-medium dark:text-white text-black mb-2">End Date</Label>
                <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border dark:border-gray-700 rounded-lg dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                />
            </div>
          </div>

          <div>
            <Label className="block text-sm font-medium dark:text-white text-black mb-2">Start Time</Label>
            <Input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-fit px-3 py-2 border dark:border-gray-700 rounded-lg dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>


          <div>
            <Label className="block text-sm font-medium dark:text-white text-black mb-2">Image URL</Label>
            <Input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full px-3 py-2 border dark:border-gray-700 rounded-lg dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Image URL"
              required
            />
          </div>

          <div>
            <Label className="block text-sm font-medium dark:text-white text-black mb-2">Country</Label>
            <Input
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full px-3 py-2 border dark:border-gray-700 rounded-lg dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter country"
              required
            />
          </div>

          <div>
            <Label className="block text-sm font-medium dark:text-white text-black mb-2">State</Label>
            <Input
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full px-3 py-2 border dark:border-gray-700 rounded-lg dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter state"
              required
            />
          </div>

          <div>
            <Label className="block text-sm font-medium dark:text-white text-black mb-2">City</Label>
            <Input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-3 py-2 border dark:border-gray-700 rounded-lg dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              placeholder="Enter city"
            />
          </div>

          <div>
            <Label className="block text-sm font-medium dark:text-white text-black mb-2">Stadium</Label>
            <Input
              value={stadium}
              onChange={(e) => setStadium(e.target.value)}
              className="w-full px-3 py-2 border dark:border-gray-700 rounded-lg dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter stadium"
              required
            />
          </div>

          <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-gray-900 dark:hover:bg-gray-600 dark:text-white"
                disabled={ /*!isloading, was for when image was uploaded form device... */!image || !organisedBy || !name || !startDate || !endDate || !startTime || !city || !state || !country || !stadium }
                >
                {isLoading ? "Creating Event..." : "Share Event"}
          </Button>
          
            
        </form>
      </DialogContent>
    </Dialog>
  )
}
