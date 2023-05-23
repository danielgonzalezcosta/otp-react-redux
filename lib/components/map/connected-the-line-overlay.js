import { connect } from 'react-redux'
import React, { Component } from 'react'
import TheLineOverlay from '@opentripplanner/the-line-overlay'

import { setLocation } from '../../actions/map'
import { setViewedStop } from '../../actions/ui'

class ConnectedTheLineOverlay extends Component {
  render() {
    return <TheLineOverlay {...this.props} />
  }
}

// connect to the redux store

const mapStateToProps = (state, ownProps) => {
  return {}
}

const mapDispatchToProps = {
  setLocation,
  setViewedStop
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConnectedTheLineOverlay)
