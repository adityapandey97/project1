import { useState, useEffect } from 'react'
import { RiFireLine, RiCompassLine } from 'react-icons/ri'
import VideoGrid from '../components/video/VideoGrid'
import { videoService } from '../services'

const categories = ['All', 'Gaming', 'Music', 'Tech', 'Education', 'Sports', 'Cooking', 'Travel', 'News']

const HomePage = () => {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')
  const [sortBy, setSortBy] = useState('createdAt')

  useEffect(() => {
    fetchVideos()
  }, [sortBy])

  const fetchVideos = async () => {
    setLoading(true)
    try {
      const res = await videoService.getAllVideos({ page: 1, limit: 20, sortBy, sortType: 'desc' })
      const data = res.data.data
      setVideos(data?.docs || data || [])
    } catch (_) {
      setVideos([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Hero strip */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex items-center gap-2">
          <RiFireLine className="w-5 h-5 text-brand-400" />
          <h1 className="text-xl font-bold text-zinc-100">Trending</h1>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-zinc-500">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-dark-700 border border-dark-500 rounded-lg px-3 py-1.5 text-sm text-zinc-300 focus:outline-none focus:border-brand-500"
          >
            <option value="createdAt">Latest</option>
            <option value="views">Most Viewed</option>
          </select>
        </div>
      </div>

      {/* Category filters */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
              activeCategory === cat
                ? 'bg-brand-500 text-white'
                : 'bg-dark-700 text-zinc-400 hover:text-zinc-200 hover:bg-dark-600'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <VideoGrid videos={videos} loading={loading} />
    </div>
  )
}

export default HomePage
