import { connect } from 'react-redux'
import React, { Component } from 'react'
import TheLineOverlay from '@opentripplanner/the-line-overlay'

import { clearLocation } from '../../actions/form'
import { getActiveSearch } from '../../util/state'
import { setLocation } from '../../actions/map'

class ConnectedTheLineOverlay extends Component {
  render() {
    return <TheLineOverlay {...this.props} />
  }
}

// connect to the redux store

const mapStateToProps = (state) => {
  // Use query from active search (if a search has been made) or default to
  // current query is no search is available.
  const activeSearch = getActiveSearch(state)
  const query = activeSearch ? activeSearch.query : state.otp.currentQuery
  const { from, to } = query

  return {
    fromLocation: from,
    toLocation: to
  }
}

const mapDispatchToProps = {
  clearLocation,
  setLocation
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConnectedTheLineOverlay)
