import { Play } from "lucide-react"

function resolveSource(lesson) {
  const video = lesson.video && typeof lesson.video === "object" ? lesson.video : {}
  const directSource = lesson.videoUrl || lesson.embedUrl || video.videoUrl || video.embedUrl || video.url
  if (directSource) return directSource

  const libraryId = lesson.bunnyLibraryId || lesson.libraryId || video.bunnyLibraryId || video.libraryId
  const videoId = lesson.bunnyVideoId || lesson.videoId || video.bunnyVideoId || video.videoId || video.id
  if (libraryId && videoId) {
    return `https://iframe.mediadelivery.net/embed/${encodeURIComponent(libraryId)}/${encodeURIComponent(videoId)}`
  }
  return ""
}

export default function VideoPlayer({ lesson }) {
  const source = resolveSource(lesson)

  if (!source) {
    return (
      <div className="flex aspect-video items-center justify-center bg-slate-950 px-6 text-center text-sm text-slate-300">
        <div><Play className="mx-auto mb-3 text-indigo-300" size={32} /><p>Bu dars uchun video hali yuklanmagan.</p></div>
      </div>
    )
  }

  if (/\.(mp4|webm|ogg)(\?.*)?$/i.test(source)) {
    return <video className="aspect-video w-full bg-black" src={source} controls playsInline />
  }

  return <iframe className="aspect-video w-full bg-black" src={source} title={lesson.title || "Dars videosi"} allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowFullScreen />
}
