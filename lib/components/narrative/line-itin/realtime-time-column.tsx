import { FormattedTime } from 'react-intl'
import { isTransit } from '@opentripplanner/core-utils/lib/itinerary'
import { Leg } from '@opentripplanner/types'
import React, { ReactElement } from 'react'
import styled from 'styled-components'



import RealtimeStatusLabel, {
  DelayText,
  MainContent,
} from '../../viewers/realtime-status-label'

interface Props {
  isDestination: boolean
  leg: Leg
}

const StyledStatusLabel = styled(RealtimeStatusLabel)`
  ${MainContent} {
    font-size: 80%;
    line-height: 1em;
  }
  ${DelayText} {
    display: block;
  }
`
/**
 * This component displays the scheduled departure/arrival time for a leg,
 * and, for transit legs, displays any delays or earliness where applicable.
 */
function RealtimeTimeColumn({ isDestination, leg }: Props): ReactElement {
  const timeMillis = isDestination ? leg.endTime : leg.startTime
  const isTransitLeg = isTransit(leg.mode)
  const isRealtimeTransitLeg = isTransitLeg && leg.realTime
  const delaySeconds = isDestination ? leg.arrivalDelay : leg.departureDelay
  const originalTimeMillis = timeMillis - delaySeconds * 1000




  if (!isTransitLeg) {
    if(leg.mode === "WALK" || leg.mode === "CAR" || leg.mode === 'MICROMOBILITY' || leg.mode === 'BUS' ) {
        return (<div className='legtime'>{Math.floor((leg.duration) / 60)} min</div> )
    } else {
        return (<div className='legtime'>{Math.floor((leg.duration + 120) / 60)} min</div>)
    }
  } else {
    if(leg.mode === "WALK" || leg.mode === "CAR" || leg.mode === 'MICROMOBILITY' || leg.mode === 'BUS') {
      return (<div className='legtime'>{Math.floor((leg.duration) / 60)} min</div>)
    } else {
      return (<div className='legtime'>{Math.floor((leg.duration + 120) / 60)} min</div>)
    }
  }
  

  /*
  if (!isTransitLeg) {
    return (
      <div>
        <FormattedTime timeStyle="short" value={timeMillis} />
      </div>
    )
  }
  */



  return (
    <StyledStatusLabel
      delay={delaySeconds}
      isRealtime={isRealtimeTransitLeg}
      originalTime={originalTimeMillis}
      time={timeMillis}
    />

  )
}

export default RealtimeTimeColumn

