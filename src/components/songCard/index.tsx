import { type Track } from '../../types/data'
import './SongCard.css'
import { useAudioContext } from '../../hooks/useAudio'
import { useQuery } from '@tanstack/react-query'
import { getTrack as fetchTrack } from '../../services/dataService'
import { useState } from 'react'

interface Props {
  track: Track
  isActive?: boolean
}

const SongCard = ({ track, isActive }: Props) => {
  const { setAudioUrl } = useAudioContext()
  const [trackId, setTrackId] = useState<number>()
  const getTrack = async (trackId: number | undefined) => {
    console.log(trackId)
    if (trackId) {
      const track = await fetchTrack(trackId)
      console.log('track', track.url)
      setAudioUrl(track.url)
      return track
    }
  }
  const queryTrack = useQuery({
    queryKey: ['track'],
    queryFn: async () => await getTrack(trackId)
    // enabled: !!trackId
  })

  // useEffect(() => {
  //   if (trackId) {
  //     void queryTrack.refetch()
  //   }
  // }, [trackId])
  console.log('queryTrack', queryTrack.data)
  console.log(trackId)
  return (
    <div className="songcard-container" onClick={() => {
      setTrackId(track.id)
      void queryTrack.refetch()
    }}>
      {/* <StyledLink to={`/tracks/${track.id}`}> */}
      <img className="songcard-img" src={track.thumbnail} />
      <div className="songcard-track-info">
        <h3>{track.name}</h3>
        {isActive && <p>{track.artist}</p>}
      </div>
      {/* </StyledLink> */}
    </div>
  )
}

export default SongCard
