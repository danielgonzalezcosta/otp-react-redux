import { connect } from 'react-redux'
import styled from 'styled-components'
import TripDetailsBase from '@opentripplanner/trip-details'

const TripDetails = styled(TripDetailsBase)`
  b {
    font-weight: 600;
  }
  margin-left: 5px;
  margin-right: 5px;
`

// Connect imported TripDetails class to redux store.

const mapStateToProps = (state) => {
  const { co2, itinerary } = state.otp.config
  return {
    co2Config: co2,
    defaultFareKey: itinerary?.defaultFareKey || undefined,
    displayCalories:
      typeof itinerary?.displayCalories === 'boolean'
        ? itinerary?.displayCalories
        : undefined,
    fareDetailsLayout: itinerary?.fareDetailsLayout || undefined,
    fareKeyNameMap: itinerary?.fareKeyNameMap || {},
    useMetricUnits: state.otp.config.localization.useMetricUnits
  }
}

export default connect(mapStateToProps)(TripDetails)
