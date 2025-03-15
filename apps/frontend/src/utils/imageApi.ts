"use client"

// API key should be stored in environment variables
const PEXELS_API_KEY = "your-pexels-api-key" // Replace with your actual API key

interface PexelsPhoto {
  id: number
  width: number
  height: number
  url: string
  photographer: string
  photographer_url: string
  photographer_id: number
  avg_color: string
  src: {
    original: string
    large2x: string
    large: string
    medium: string
    small: string
    portrait: string
    landscape: string
    tiny: string
  }
  liked: boolean
  alt: string
}

interface PexelsResponse {
  total_results: number
  page: number
  per_page: number
  photos: PexelsPhoto[]
  next_page: string
}

/**
 * Fetch images from Pexels API based on search query
 * @param query Search query (e.g., "basketball", "tennis court", "swimming pool")
 * @param perPage Number of images to fetch (default: 10)
 * @param page Page number (default: 1)
 * @returns Array of image URLs
 */
export async function fetchImagesFromPexels(query: string, perPage = 10, page = 1): Promise<string[]> {
  try {
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${perPage}&page=${page}`,
      {
        headers: {
          Authorization: PEXELS_API_KEY,
        },
      },
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch images: ${response.statusText}`)
    }

    const data: PexelsResponse = await response.json()

    // Extract medium-sized image URLs
    return data.photos.map((photo) => photo.src.medium)
  } catch (error) {
    console.error("Error fetching images from Pexels:", error)
    // Return placeholder images as fallback
    return Array(perPage)
      .fill(0)
      .map((_, i) => `/placeholder.svg?height=600&width=600&text=${query}+${i + 1}`)
  }
}

/**
 * Fetch a single random image from Pexels API based on search query
 * @param query Search query (e.g., "basketball", "tennis court", "swimming pool")
 * @returns A single image URL
 */
export async function fetchRandomImageFromPexels(query: string): Promise<string> {
  try {
    const images = await fetchImagesFromPexels(query, 10, 1)
    // Get a random image from the results
    const randomIndex = Math.floor(Math.random() * images.length)
    return images[randomIndex]
  } catch (error) {
    console.error("Error fetching random image from Pexels:", error)
    // Return placeholder image as fallback
    return `/placeholder.svg?height=600&width=600&text=${query}`
  }
}

/**
 * Example usage in components:
 *
 * // In a component:
 * const [imageUrl, setImageUrl] = useState("/placeholder.svg");
 *
 * useEffect(() => {
 *   async function loadImage() {
 *     const url = await fetchRandomImageFromPexels("basketball");
 *     setImageUrl(url);
 *   }
 *   loadImage();
 * }, []);
 *
 * // Then use imageUrl in your component
 * <img src={imageUrl || "/placeholder.svg"} alt="Basketball" />
 */

