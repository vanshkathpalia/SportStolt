

import { Heart, MessageCircle, Bookmark, Share2, MoreHorizontal } from 'lucide-react';

export const PostSkeleton = () => {
    return <div className="py-10">
        <div className="flex flex-col">
                <div className="flex justify-center">
                    <div className="bg-white border border-gray-200 rounded-lg mb-4 animate-pulse">
                        <div className="p-4 flex items-center justify-between space-x-96">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gray-200 rounded-full" />
                                <div className="h-4 w-36 bg-gray-200 rounded m-x-20" />
                            </div>
                            <button className="text-gray-600 hover:text-gray-900">
                                <MoreHorizontal className="w-6 h-6" />
                            </button>
                        </div>
                            <div className="min-h-96 bg-gray-200 justify-items-center" />
                            <div className="p-4 space-y-3">
                                <div className="flex justify-between items-center">
                                    <div className="flex space-x-4">
                                        <button className="text-gray-600 hover:text-red-500 transition-colors">
                                            <Heart className="w-6 h-6" />
                                        </button>
                                        <button className="text-gray-600 hover:text-gray-900 transition-colors">
                                            <MessageCircle className="w-6 h-6" />
                                        </button>
                                        <button className="text-gray-600 hover:text-gray-900 transition-colors">
                                            <Share2 className="w-6 h-6" />
                                        </button>
                                    </div>
                                    <button className="text-gray-600 hover:text-gray-900 transition-colors">
                                        <Bookmark className="w-6 h-6" />
                                    </button>
                                </div>
                            <div className="h-4 w-20 bg-gray-200 rounded" />
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-200 rounded flex flex-row">
                                    <div /> 
                                    <div />
                                </div>
                                <div className="h-4 w-1/2 bg-gray-200 rounded" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    </div>
}

<div className="bg-white border border-gray-200 rounded-lg mb-4 animate-pulse">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full" />
            <div className="h-4 w-24 bg-gray-200 rounded" />
          </div>
          <div className="w-6 h-6 bg-gray-200 rounded" />
        </div>
        <div className="aspect-square bg-gray-200" />
        <div className="p-4 space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex space-x-4">
              <div className="w-6 h-6 bg-gray-200 rounded" />
              <div className="w-6 h-6 bg-gray-200 rounded" />
              <div className="w-6 h-6 bg-gray-200 rounded" />
            </div>
            <div className="w-6 h-6 bg-gray-200 rounded" />
          </div>
          <div className="h-4 w-20 bg-gray-200 rounded" />
          <div className="space-y-2">
            <div className="h-4 w-3/4 bg-gray-200 rounded" />
            <div className="h-4 w-1/2 bg-gray-200 rounded" />
          </div>
        </div>
</div>
