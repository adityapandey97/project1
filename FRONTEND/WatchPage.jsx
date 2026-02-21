import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { videoService } from '../services'
import VideoPlayer from '../components/video/VideoPlayer'
import CommentSection from '../components/comment/CommentSection'
import VideoCard from '../components/video/VideoCard'
import { PageSpinner } from '../components/common/Spinner'

const WatchPage = () => {
  const { videoId } = useParams()
  const [video, setVideo] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    window.scrollTo(0, 0)
    fetchVideo()
    fetchRelated()
  }, [videoId])

  const fetchVideo = async () => {
    setLoading(true)
    try {
      const res = await videoService.getVideoById(videoId)
      setVideo(res.data.data)
    } catch (_) {} finally {
      setLoading(false)
    }
  }

  const fetchRelated = async () => {
    try {
      const res = await videoService.getAllVideos({ page: 1, limit: 12, sortBy: 'views', sortType: 'desc' })
      const data = res.data.data
      setRelated((data?.docs || data || []).filter((v) => v._id !== videoId))
    } catch (_) {}
  }

  if (loading) return <PageSpinner />
  if (!video) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <p className="text-zinc-400">Video not found or unavailable.</p>
    </div>
  )

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-screen-2xl mx-auto">
      {/* Main content */}
      <div className="flex-1 min-w-0">
        <VideoPlayer video={video} />
        <div className="mt-8 border-t border-dark-600 pt-6">
          <CommentSection videoId={videoId} />
        </div>
      </div>

      {/* Related videos sidebar */}
      <div className="lg:w-96 flex-shrink-0">
        <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">Up Next</h3>
        <div className="space-y-4">
          {related.map((v) => (
            <VideoCard key={v._id} video={v} showChannel />
          ))}
        </div>
      </div>
    </div>
  )
}

export default WatchPage
