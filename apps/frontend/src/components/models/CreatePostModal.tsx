"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { MapPin, Camera } from "lucide-react"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import axios from "axios"
import { BACKEND_URL } from "../../config"
import { useNavigate } from "react-router-dom"
// import { fetchImagesFromPexels } from "../../utils/imageApi"

interface CreatePostModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CreatePostModal({ isOpen, onClose }: CreatePostModalProps) {
  // const [activeTab, setActiveTab] = useState("photo")
  const [content, setContent] = useState("")
  const [title, setTitle] = useState("")
  // const [tags, setTags] = useState("")
  // const [selectedFile, setSelectedFile] = useState<File | null>(null)
  // const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate();

  // For Pexels API
  // const [searchQuery, setSearchQuery] = useState("")
  // const [isSearching, setIsSearching] = useState(false)
  // const [searchResults, setSearchResults] = useState<string[]>([])

  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0] || null
  //   if (file) {
  //     setSelectedFile(file)
  //     const reader = new FileReader()
  //     reader.onloadend = () => {
  //       setPreviewUrl(reader.result as string)
  //     }
  //     reader.readAsDataURL(file)
  //   }
  // }

  // const handleSearchImages = async () => {
  //   if (!searchQuery.trim()) return

  //   setIsSearching(true)
  //   try {
  //     const images = await fetchImagesFromPexels(searchQuery, 12)
  //     setSearchResults(images)
  //   } catch (error) {
  //     console.error("Error searching for images:", error)
  //   } finally {
  //     setIsSearching(false)
  //   }
  // }

  // const handleSelectImage = (imageUrl: string) => {
  //   setPreviewUrl(imageUrl)
  //   setSelectedFile(null)
  //   setSearchResults([]) // Clear search results after selection
  // }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Here you would typically send the data to your backend
      const formData = {
        // type: activeTab,
        content,
        title,
        // tags: tags.split(',').map(tag => tag.trim()),
        // file: selectedFile,
        // imageUrl: previewUrl,
      }

      console.log('Submitting post:', formData)
      
      try {
          setIsLoading(true);
          await axios.post(`${BACKEND_URL}/api/v1/post`, {
              ...formData,
              // PostPhoto: photos,
          }, {
              headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
              }
          });
          navigate('/post');
      } catch (error) {
          console.error('Error publishing post:', error);
      } finally {
          setIsLoading(false);
      }
      // await createPost(formData)

      // Reset form
      setContent("")
      setTitle("")
      // setTags("")
      // setSelectedFile(null)
      // setPreviewUrl(null)
      // setSearchQuery("")
      // setSearchResults([])

      onClose()
    } catch (error) {
      console.error('Error creating post:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // useEffect(() => {
  //   if (!isOpen) {
  //     setSearchResults([])
  //     setSearchQuery("")
  //   }
  // }, [isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className=" dark:bg-background sm:max-w-[600px] test-black max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="test-black dark:text-white">Create New Post</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="dark:bg-background space-y-6">
          {/* <Tabs defaultValue="photo" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="photo" className="flex items-center gap-2">
                <Image className="h-4 w-4" />
                <span>Photo</span>
              </TabsTrigger>
              <TabsTrigger value="video" className="flex items-center gap-2">
                <Video className="h-4 w-4" />
                <span>Video</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="photo" className="space-y-4 mt-4">
              {/* Image Preview */}
              {/* {previewUrl ? (
                <div className="relative w-full border-2 border-primary rounded-lg p-4">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-h-64 mx-auto object-contain"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setSelectedFile(null)
                      setPreviewUrl(null)
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <>
                  
                  <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center">
                    <Image className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Drag photos here or click to upload
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById("photo-upload")?.click()}
                    >
                      Select from computer
                    </Button>
                    <input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>

                  
                  <div className="space-y-2">
                    <Label>Search Online Images</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Search for images..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={handleSearchImages}
                        disabled={isSearching}
                      >
                        <Search className="h-4 w-4 mr-2" />
                        Search
                      </Button>
                    </div>
                  </div> */}

                  

                  {/* Search Results */}
                  {/* {searchResults.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-4">
                      {searchResults.map((imageUrl, index) => (
                        <div
                          key={index}
                          className="relative cursor-pointer hover:opacity-80"
                          onClick={() => handleSelectImage(imageUrl)}
                        >
                          <img
                            src={imageUrl}
                            alt={`Search result ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </TabsContent>
          </Tabs> */}

          <div>
            <label className="block text-sm font-medium test-black dark:text-white mb-2">
                <Camera className="w-4 h-4 inline mr-1" />
                Image Content URL
            </label>
            <input
              type="text"
              name="image"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 test-black dark:bg-background rounded-lg dark:text-gray-300 dark:border-gray-700"
              placeholder="Enter image URL"
            />
          </div>

          {/* Caption */}
          <div className=" test-black dark:text-white space-y-2">
            <Label htmlFor="caption">Caption</Label>
            <Textarea
              id="caption"
              placeholder="Write a caption for your post..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="min-h-[100px] dark:border-gray-700 test-black dark:bg-background rounded-lg dark:text-gray-300"
            />
          </div>

          {/* Image URL */}
          <div className="space-y-2 test-black dark:text-white">
            <Label htmlFor="location">Add Image URL</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="text"
                placeholder="Add location"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="pl-9 dark:border-gray-700 dark:bg-background dark:text-white"
              />
            </div>
          </div>

          {/* Tags */}
          {/* <div className="space-y-2">
            <Label htmlFor="tags">Add sports tags</Label>
            <div className="relative">
              <Tag className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="tags"
                placeholder="Add sports tags (comma-separated)"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="pl-9"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Separate tags with commas (e.g., basketball, soccer, tennis)
            </p>
          </div> */}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full dark:bg-gray-900 dark:hover:bg-gray-600 dark:text-white"
            disabled={ /* isLoading || (!previewUrl && activeTab === "photo") || */ !content || !title}
          >
            {isLoading ? "Creating post..." : "Share Post"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}