import { type Track } from '../../types/data'
import './SongCard.css'
import { useAudioContext } from '../../hooks/useAudio'
import { useQuery } from '@tanstack/react-query'
import { getTrack as fetchTrack } from '../../services/dataService'
import { getTracks as fetchTracks } from '../../services/dataService'

interface Props {
  track: Track
  isActive?: boolean
}

const SongCard = ({ track, isActive }: Props) => {
  const { setAudioUrl, setAudioImg, trackId, setTrackId, setIsPlaying, getSongDuration, audioRef, setSongDuration} = useAudioContext()

  const getAllTracks = async () => {
    const tracks = await fetchTracks()
    console.log("tracks length",tracks.length)
    localStorage.setItem('allTracks', JSON.stringify(tracks))
    return tracks
  }

  const getTrack = async (trackId: number | undefined) => {
    console.log(trackId)
    if (trackId) {
      const track = await fetchTrack(trackId)
      console.log('track', track.url)
      getSongDuration(audioRef, setSongDuration)
      setAudioUrl(track.url)
      setAudioImg(track.thumbnail)
      localStorage.setItem('localTrack', JSON.stringify(track))
      setTimeout(() => {
        setTrackId(0)
        void queryTrack.refetch()
      }, 90)
      return track
    } else {
      const track = JSON.parse(localStorage.getItem('localTrack') || '{}')
      console.log('track', track.url)
      setAudioUrl(track.url)
      setAudioImg(track.thumbnail)
      return track
    }
  }
  const queryTrack = useQuery({
    queryKey: ['track'],
    queryFn: async () => await getTrack(trackId)
  })

  const queryAllTracks = useQuery({
    queryKey: ['tracks'],
    queryFn: async() => await getAllTracks()
  })

  console.log('queryAllTracks', queryAllTracks.data.length)
  console.log(trackId)
  return (
    <div className="songcard-container" onClick={() => {
      setTrackId(track.id)
      setIsPlaying(false)
      setTimeout(() => {
        void queryTrack.refetch()
      }, 90)
    }}>
      <img className="songcard-img" src={track.thumbnail} />
      <div className="songcard-track-info">
        <h3>{track.name}</h3>
        {isActive && <p>{track.artist}</p>}
      </div>
    </div>
  )
}

export default SongCard
