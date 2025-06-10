import React, { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import axios from "axios"
import { BACKEND_URL } from "../../config"
// import { Camera, X } from "lucide-react"

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
  const [formErrors, setFormErrors] = useState<{
    startDate?: string;
    endDate?: string;
    startTime?: string;
  }>({});

  // const [selectedFile, setSelectedFile] = useState<File | null>(null)
  // const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  // const [error, setError] = useState<string | null>(null)


  // const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0]
  //   if (!file) return

  //   if (!file.type.startsWith("image/")) {
  //     setError("Please select a valid image file")
  //     return
  //   }

  //   setSelectedFile(file)
  //   setPreviewUrl(URL.createObjectURL(file))
  //   setError(null)

  //   // Cloudflare Upload
  //   try {
  //     const formData = new FormData()
  //     formData.append("file", file)

  //     const res = await axios.post(`${BACKEND_URL}/api/v1/upload`, formData, {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("token")}`,
  //         "Content-Type": "multipart/form-data",
  //       },
  //     })

  //     const uploadedUrl = res.data?.url // Adjust based on your API response
  //     if (uploadedUrl) {
  //       setImage(uploadedUrl)
  //     }
  //   } catch (uploadErr) {
  //     console.error("Upload error:", uploadErr)
  //     setError("Failed to upload image. Try again.")
  //   }
  // }


  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault()
  //   setIsLoading(true)

  //   try {
  //     // Compose startTime as ISO string combining date + time
  //     const startDateTime = new Date(`${startDate}T${startTime}`).toISOString();

  //     // Backend expects dates as ISO strings or date objects:
  //     const formData = {
  //       name,
  //       startDate: startDate,
  //       endDate: endDate,
  //       startTime: startDateTime,
  //       city,
  //       state,
  //       country,
  //       stadium,
  //       OrganisedBy: organisedBy,
  //       image,
  //     }

  //     await axios.post(`${BACKEND_URL}/api/v1/event`, formData, {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("token")}`,
  //       },
  //     })

  //     // Reset form and close modal
  //     setName("")
  //     setStartDate("")
  //     setendDate("")
  //     setstartTime("")
  //     setCity("")
  //     setState("")
  //     setCountry("")
  //     setStadium("")
  //     setOrganisedBy("")
  //     setImage("")
  //     onClose()
  //   } catch (error) {
  //     console.error("Error creating event:", error)
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const errors: typeof formErrors = {};
    const now = new Date();
    const startDateTime = new Date(`${startDate}T${startTime}`);
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);

    // Validation rules
    if (endDateObj < startDateObj) {
      errors.endDate = "End date must be after or same as start date.";
    }

    const todayStr = now.toISOString().split("T")[0];
    if (startDate === todayStr && startDateTime < now) {
      errors.startTime = "Start time must be in the future for today's date.";
    }

    if (startDateTime < now) {
      errors.startDate = "Start date or time must be in the future.";
    }

    // If any errors found, set and stop
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setIsLoading(false);
      return;
    }

    // Clear any previous errors
    setFormErrors({});

    // Submit the form (your original logic)
    try {
      const isostartTime = startDateTime.toISOString();

      const formData = {
        name,
        startDate: startDate,
        endDate: endDate,
        startTime: isostartTime,
        city,
        state,
        country,
        stadium,
        OrganisedBy: organisedBy,
        image,
      };

      await axios.post(`${BACKEND_URL}/api/v1/event`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // Reset form
      setName("");
      setStartDate("");
      setEndDate("");
      setStartTime("");
      setCity("");
      setState("");
      setCountry("");
      setStadium("");
      setOrganisedBy("");
      setImage("");
      onClose();
    } catch (error) {
      console.error("Error creating event:", error);
    } finally {
      setIsLoading(false);
    }
  };



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
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setFormErrors((prev) => ({ ...prev, startDate: undefined }));
                }}
                className="w-full px-3 py-2 border dark:border-gray-700 rounded-lg dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                />
            </div>


            <div className="space-y-2">
                <Label className="block text-sm font-medium dark:text-white text-black mb-2">End Date</Label>
                <Input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setFormErrors((prev) => ({ ...prev, startDate: undefined }));
                }}
                className="w-full px-3 py-2 border dark:border-gray-700 rounded-lg dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                />
            </div>
          </div>

            <div className="grid grid-cols-2 gap-4 dark:text-white text-black">
                {formErrors.startDate && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.startDate}</p>
                )}
                {formErrors.endDate && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.endDate}</p>
                )}
            </div>

          <div>
            <Label className="block text-sm font-medium dark:text-white text-black mb-2">Start Time</Label>
            <Input
              type="time"
              value={startTime}
              onChange={(e) => {
                setStartTime(e.target.value);
                setFormErrors((prev) => ({ ...prev, startDate: undefined }));
              }}
              className="w-fit px-3 py-2 border dark:border-gray-700 rounded-lg dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            {formErrors.startTime && (
              <p className="text-red-500 text-sm mt-1">{formErrors.startTime}</p>
            )}
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

          {/* Image Upload + Preview */}
          {/* <div>
            <Label className="block mb-2 dark:text-white">
              <Camera className="w-4 h-4 inline mr-1" />
              Upload an Image
            </Label>

            {previewUrl ? (
              <div className="relative w-full border border-gray-600 rounded-lg p-4">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-h-64 mx-auto object-contain rounded-lg"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => {
                    setSelectedFile(null)
                    setPreviewUrl(null)
                    setImage("")
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center">
                <Camera className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-2">
                  Drag & drop image or click to upload
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="dark:text-white"
                  onClick={() => document.getElementById("image-upload")?.click()}
                >
                  Select from computer
                </Button>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            )}

            {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
          </div> */}

          {/* {selectedFile && (
            <p className="text-sm text-muted-foreground mt-1">
              Selected file: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
            </p>
          )} */}


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
