import { ConfiguredCompany, Station, Stop } from '@opentripplanner/types'
import { connect } from 'react-redux'
import { FormattedMessage, injectIntl, IntlShape } from 'react-intl'
// @ts-expect-error not typescripted yet
import { getCompanyIcon } from '@opentripplanner/icons/lib/companies'
import React, { Component } from 'react'
import styled from 'styled-components'

import { ComponentContext } from '../../util/contexts'

import RelatedPanel from './related-panel'

const StyledParkAndRideIcon = styled.div`
  background: #000;
  border-radius: 17px;
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  height: 22px;
  line-height: 0px;
  margin-right: 5px;
  width: 22px;

  display: inline-flex;
  justify-content: center;
  align-items: center;
  padding-left: 1px;
`

const parkAndRideMarker = <StyledParkAndRideIcon>P</StyledParkAndRideIcon>

type Props = {
  configCompanies: ConfiguredCompany[]
  intl: IntlShape
  stopData: Stop & {
    bikeRental: any
    parkAndRideLocations: any
    vehicleRental: any
  }
}
type State = {
  expanded: boolean
}

class AmenitiesPanel extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      expanded: false
    }
  }

  static contextType = ComponentContext

  _toggleExpandedView = () => {
    this.setState({ expanded: !this.state.expanded })
  }

  _renderParkAndRides = () => {
    const { parkAndRideLocations } = this.props.stopData
    return parkAndRideLocations && parkAndRideLocations.length > 0 ? (
      // TODO Type for P+R
      parkAndRideLocations.map((parkAndRide: any) => (
        <li
          className="related-item"
          key={parkAndRide.name}
          title={parkAndRide.name}
        >
          {parkAndRideMarker}
          {parkAndRide.name}
        </li>
      ))
    ) : (
      <li className="related-item">
        {parkAndRideMarker}
        <FormattedMessage id="components.AmenitiesPanel.noPRLotsFound" />
      </li>
    )
  }

  _renderBikeRentalStations = () => {
    const { intl, stopData } = this.props
    if (!stopData || !stopData.bikeRental) return null
    const { stations } = stopData.bikeRental
    // TODO: Rewrite this in a way that the types make sense
    const stationCounts: { [key: string]: any } = {}
    stations.forEach((station: Station) => {
      const isHub = !station.isFloatingBike
      const key = `${station.networks[0]}${isHub ? station.id : ''}`
      if (!stationCounts[key]) {
        const name = isHub
          ? intl.formatMessage(
              { id: 'components.AmenitiesPanel.bikesAtStation' },
              {
                company: this._getCompany(station),
                companyLength: this._getCompany(station).length,
                name: station.name
              }
            )
          : this._getCompany(station)
        stationCounts[key] = {
          icon: this._getStationIcon('BICYCLE', station),
          isHub,
          name,
          stations: []
        }
      }
      stationCounts[key].stations.push(station)
    })
    const keys = Object.keys(stationCounts)
    return keys.length > 0 ? (
      keys.map((key) => {
        const company = stationCounts[key]
        const label = company.isHub
          ? company.name
          : intl.formatMessage(
              { id: 'components.AmenitiesPanel.bikesNearby' },
              {
                company: company.name,
                count: company.stations.length
              }
            )
        return (
          <li className="related-item" key={key} title={label}>
            {company.icon}
            {label}
            {company.isHub && (
              <>
                <div>
                  <FormattedMessage
                    id="components.AmenitiesPanel.bikesAvailable"
                    values={{ count: company.stations[0].bikesAvailable }}
                  />
                </div>
                <div>
                  <FormattedMessage
                    id="components.AmenitiesPanel.spacesAvailable"
                    values={{ count: company.stations[0].spacesAvailable }}
                  />
                </div>
              </>
            )}
          </li>
        )
      })
    ) : (
      <li className="related-item">
        {this._getModeIcon('BICYCLE')}
        <FormattedMessage id="components.AmenitiesPanel.noNearbyBikes" />
      </li>
    )
  }

  _getModeIcon = (mode: string) => {
    const { ModeIcon } = this.context
    return (
      <ModeIcon
        height={22}
        mode={mode}
        style={{ marginRight: '5px' }}
        width={22}
      />
    )
  }

  _getStationIcon = (mode: string, station: Station) => {
    const CompanyIcon = getCompanyIcon(station?.networks[0])
    return CompanyIcon ? (
      <CompanyIcon height={22} style={{ marginRight: '5px' }} width={22} />
    ) : (
      this._getModeIcon(mode)
    )
  }

  _getCompany = (station: Station) => {
    return (
      this.props?.configCompanies?.find((c) => c.id === station.networks[0])
        ?.label || ''
    )
  }

  _renderVehicleRentalStations = () => {
    const { stopData } = this.props
    if (!stopData || !stopData.vehicleRental) return null
    const { stations } = stopData.vehicleRental
    const companyCounts: { [key: string]: any } = {}
    stations.forEach((station: Station) => {
      if (!companyCounts[station.networks[0]]) {
        companyCounts[station.networks[0]] = {
          icon: this._getStationIcon('MICROMOBILITY', station),
          name: this._getCompany(station),
          stations: []
        }
      }
      companyCounts[station.networks[0]].stations.push(station)
    })
    const keys = Object.keys(companyCounts)
    return keys.length > 0 ? (
      keys.map((key) => {
        const company = companyCounts[key]
        return (
          <li className="related-item" key={key}>
            {company.icon}
            <FormattedMessage
              id="components.AmenitiesPanel.scootersNearby"
              values={{
                company: company.name,
                count: company.stations.length
              }}
            />
          </li>
        )
      })
    ) : (
      <li className="related-item">
        {this._getModeIcon('MICROMOBILITY')}
        <FormattedMessage id="components.AmenitiesPanel.noNearbyScooters" />
      </li>
    )
  }

  render() {
    const { intl } = this.props
    const { expanded } = this.state
    return (
      <RelatedPanel
        count={0}
        expanded={expanded}
        onToggleExpanded={this._toggleExpandedView}
        title={intl.formatMessage({
          id: 'components.AmenitiesPanel.nearbyAmenities'
        })}
      >
        <ul className="related-items-list list-unstyled">
          {this._renderParkAndRides()}
          {this._renderBikeRentalStations()}
          {this._renderVehicleRentalStations()}
        </ul>
      </RelatedPanel>
    )
  }
}

const mapStateToProps = (state: any) => {
  return {
    configCompanies: state.otp.config.companies
  }
}

const mapDispatchToProps = {}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(injectIntl(AmenitiesPanel))
