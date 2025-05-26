import { useEffect, useState } from "react";
import axios from "axios";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { MobileNav } from "../components/StickyBars/MobileNav";
import { Sidebar } from "../components/StickyBars/Sidebar";

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  published_at: string;
  image?: string;
  source: string;
}

// MOCK default news data (3 items)
const MOCK_NEWS: NewsArticle[] = [
  {
    title: "Local Team Wins Championship",
    description: "In an exciting final match, the local team secured the championship title with a last-minute goal.",
    url: "https://example.com/news1",
    published_at: new Date().toISOString(),
    image: "https://via.placeholder.com/400x200?text=Sports+News+1",
    source: "Example Sports",
  },
  {
    title: "Star Player Injured During Training",
    description: "The star player suffered an injury during training and is expected to be out for at least two weeks.",
    url: "https://example.com/news2",
    published_at: new Date().toISOString(),
    image: "https://via.placeholder.com/400x200?text=Sports+News+2",
    source: "Example Sports",
  },
  {
    title: "Upcoming Sports Events This Week",
    description: "A list of upcoming sports events happening this week in your area that you don't want to miss.",
    url: "https://example.com/news3",
    published_at: new Date().toISOString(),
    image: "https://via.placeholder.com/400x200?text=Sports+News+3",
    source: "Example Sports",
  },
];
interface NewsPageProps {
  openCreateModal: () => void
}

export const NewsPage = ({ openCreateModal }: NewsPageProps) => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSportsNews = async () => {
    try {
      const response = await axios.get("https://api.mediastack.com/v1/news", {
        params: {
          access_key: "6be479e11e6d979d68b88363982ddd4c",
          categories: "sports",
          languages: "en",
          limit: 3,
        },
      });

      if (response.data.data && response.data.data.length > 0) {
        setArticles(response.data.data);
      } else {
        // If API returns no data or empty, fallback to mock
        setArticles(MOCK_NEWS);
      }
    } catch (err) {
      console.error("Error fetching news:", err);
      // On error, fallback to mock news
      setArticles(MOCK_NEWS);
      setError("Failed to load latest news, showing default news.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSportsNews();
  }, []);

  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div className="min-h-screen bg-background">
      {isMobile && <MobileNav openCreateModal={openCreateModal} />}

      <div className="flex">
        {/* Sidebar for md+ */}
        <div className="hidden md:block w-16 xl:w-52 fixed h-screen">
          <Sidebar openCreateModal={openCreateModal} />
        </div>

        {/* Main content */}
        <main className="flex-1 md:ml-16 xl:ml-56 p-4  mr-2">
          <h1 className="text-3xl ml-5 font-bold text-gray-900 dark:text-slate-300 mb-6">Sports News</h1>

          {error && (
            <p className="mb-4 p-2 ml-5 bg-yellow-200 text-yellow-800 rounded">
              {error}
            </p>
          )}

          <div className="grid grid-cols-1 ml-5 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading
              ? [1, 2, 3].map((key) => <SkeletonCard key={key} />)
              : articles.map((article, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-4 shadow-sm bg-white dark:bg-gray-800"
                  >
                    {article.image && (
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-40 object-cover mb-4 rounded"
                      />
                    )}
                    <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-slate-300">
                      {article.title}
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300 mb-2">
                      {article.description.length > 100
                        ? `${article.description.slice(0, 100)}... `
                        : article.description}
                      {article.description.length > 100 && (
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 underline"
                        >
                          Read more
                        </a>
                      )}
                    </p>

                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      {new Date(article.published_at).toLocaleString()} —{" "}
                      <span className="italic">{article.source}</span>
                    </p>
                  </div>
                ))}
          </div>
        </main>
      </div>
    </div>
  );
};

const SkeletonCard = () => (
  <div className="border rounded-lg p-4 shadow-sm bg-white dark:bg-gray-800 animate-pulse">
    <div className="w-full h-40 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
    <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded mb-2 w-3/4"></div>
    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-2 w-full"></div>
    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
  </div>
);

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useMediaQuery } from "../hooks/useMediaQuery";
// import { MobileNav } from "../components/StickyBars/MobileNav";
// import { Sidebar } from "../components/StickyBars/Sidebar";

// interface NewsArticle {
//   title: string;
//   description: string;
//   url: string;
//   published_at: string;
//   image?: string;
//   source: string;
// }

// const News: React.FC<{ openCreateModal: () => void }> = ({ openCreateModal }) => {
//   const [articles, setArticles] = useState<NewsArticle[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   const fetchSportsNews = async () => {
//     try {
//       const response = await axios.get("http://api.mediastack.com/v1/news", {
//         params: {
//           access_key: "6be479e11e6d979d68b88363982ddd4c",
//           categories: "sports",
//           languages: "en",
//           limit: 3,
//         },
//       });

//       setArticles(response.data.data || []);
//     } catch (err) {
//       console.error("Error fetching news:", err);
//       setError("Failed to load news.");
//     } finally {ff
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchSportsNews();
//   }, []);

//   const isMobile = useMediaQuery("(max-width: 768px)");

//   if (error) return <p className="p-4">{error}</p>;

//   return (
//     <div className="min-h-screen bg-background">
//       {isMobile && <MobileNav openCreateModal={openCreateModal} />}

//       <div className="flex">
//         {/* Sidebar for md+ */}
//         <div className="hidden md:block w-16 xl:w-52 fixed h-screen">
//           <Sidebar openCreateModal={openCreateModal} />
//         </div>

//         {/* Main content */}
//         <main className="flex-1 md:ml-16 xl:ml-56 p-4">
//             <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-300 mb-6">Sports News</h1>

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {loading
//                 ? [1, 2, 3].map((key) => <SkeletonCard key={key} />)
//                 : articles.map((article, index) => (
//                     <div key={index} className="border rounded-lg p-4 shadow-sm bg-white dark:bg-gray-800">
//                         {article.image && (
//                         <img
//                             src={article.image}
//                             alt={article.title}
//                             className="w-full h-40 object-cover mb-4 rounded"
//                         />
//                         )}
//                         <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-slate-300">{article.title}</h2>
//                         <p className="text-gray-700 dark:text-gray-300 mb-2">
//                             {article.description.length > 100
//                                 ? `${article.description.slice(0, 100)}... `
//                                 : article.description}
//                             {article.description.length > 100 && (
//                                 <a
//                                 href={article.url}
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                                 className="text-blue-600 dark:text-blue-400 underline"
//                                 >
//                                 Read more
//                                 </a>
//                             )}
//                         </p>

//                         <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
//                         {new Date(article.published_at).toLocaleString()} —{" "}
//                         <span className="italic">{article.source}</span>
//                         </p>
//                     </div>
//                     ))}
//             </div>
//         </main>

//       </div>
//     </div>
//   );
// };

// export default News;


// const SkeletonCard = () => (
//   <div className="border rounded-lg p-4 shadow-sm bg-white dark:bg-gray-800 animate-pulse">
//     <div className="w-full h-40 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
//     <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded mb-2 w-3/4"></div>
//     <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-2 w-full"></div>
//     <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
//   </div>
// );
