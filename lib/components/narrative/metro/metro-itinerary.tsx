import { connect } from 'react-redux'
import {
  FormattedMessage,
  injectIntl,
  IntlShape
} from 'react-intl'
import { Itinerary, Leg } from '@opentripplanner/types'
import React from 'react'
import styled, { keyframes } from 'styled-components'

import * as narrativeActions from '../../../actions/narrative'
import * as uiActions from '../../../actions/ui'
import { ComponentContext } from '../../../util/contexts'
import { getActiveSearch } from '../../../util/state'
import {Icon} from '../../util/styledIcon'
import { localizeGradationMap } from '../utils'
import FormattedDuration from '../../util/formatted-duration'
import ItineraryBody from '../line-itin/connected-itinerary-body'
import NarrativeItinerary from '../narrative-itinerary'
import SimpleRealtimeAnnotation from '../simple-realtime-annotation'

import MetroItineraryRoutes from './metro-itinerary-routes'
import RouteBlock from './route-block'
import {EmptyLeaf, SolidLeaf} from "./leaf";

const { ItineraryView } = uiActions

// Styled components
const ItineraryWrapper = styled.div.attrs((props) => {
  return { 'aria-label': props['aria-label'] }
})`
  border-bottom: 0.1ch solid #33333333;
  color: #333;
  padding: 35px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
`

const ItineraryHeaderItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const ItineraryHeaderItemTitle = styled.div`
  font-size: 11px;
  display: block;
  text-transform: uppercase;
`

const ItineraryHeaderItemContent = styled.div`
  display: block;
  font-size:24px;
  margin-top:10px;
`

const StyledLeafIcon = styled.span`
  display: inline-block;
  height: 22px;
  margin-right:2px;
  margin-left:2px;
`
type Props = {
  LegIcon: React.ReactNode
  accessibilityScoreGradationMap: { [value: number]: string }
  active: boolean
  /** This is true when there is only one itinerary being shown and the itinerary-body is visible */
  expanded: boolean
  intl: IntlShape
  itinerary: Itinerary
  mini?: boolean
  setActiveItinerary: () => void
  setActiveLeg: (leg: Leg) => void
  setItineraryView: (view: string) => void
  showRealtimeAnnotation: () => void
}

class MetroItinerary extends NarrativeItinerary {
  static contextType = ComponentContext

  static ModesAndRoutes = MetroItineraryRoutes

  _onMouseEnter = () => {
    const { active, index, setVisibleItinerary, visibleItinerary } = this.props
    // Set this itinerary as visible if not already visible.
    const visibleNotSet =
      visibleItinerary === null || visibleItinerary === undefined
    const isVisible =
      visibleItinerary === index || (active === index && visibleNotSet)
    if (typeof setVisibleItinerary === 'function' && !isVisible) {
      setVisibleItinerary({ index })
    }
  }

  _onMouseLeave = () => {
    const { index, setVisibleItinerary, visibleItinerary } = this.props
    if (
      typeof setVisibleItinerary === 'function' &&
      visibleItinerary === index
    ) {
      setVisibleItinerary({ index: null })
    }
  }

  // eslint-disable-next-line complexity
  render() {
    const {
      accessibilityScoreGradationMap,
      active,
      co2Config,
      expanded,
      intl,
      itinerary,
      LegIcon,
      setActiveItinerary,
      setActiveLeg,
      setItineraryView,
      showRealtimeAnnotation
    } = this.props
    const { SvgIcon } = this.context

    const durationItem =
        <ItineraryHeaderItem className="itin-duration">
          <ItineraryHeaderItemTitle>
            <FormattedMessage id="common.itineraryDescriptions.option" values={{index: this.props.optionNumber + 1}} />
          </ItineraryHeaderItemTitle>
          <ItineraryHeaderItemContent className="itin-duration-time">
            <FormattedDuration
                duration={itinerary.duration}
                includeSeconds={false}
            />
          </ItineraryHeaderItemContent>
        </ItineraryHeaderItem>;

    const modes = new Map<string, Leg>();
    itinerary.legs.forEach((leg: Leg) => modes.set(leg.mode, leg));

    const modesItem =
        <ItineraryHeaderItem className="itin-modes">
          <ItineraryHeaderItemTitle>
            <FormattedMessage id="common.itineraryDescriptions.modes" />
          </ItineraryHeaderItemTitle>
          <ItineraryHeaderItemContent>
            { Array.from(modes.values()).sort((a, b) => (a.routeType || -1) - (b.routeType || -1)).map(leg => <LegIcon height="45" width="45" leg={leg}/>) }
          </ItineraryHeaderItemContent>
        </ItineraryHeaderItem>;

    const { co2Category,co2 } = itinerary
    const sustainabilityItem = co2Config.enabled && co2Category && <ItineraryHeaderItem className="itin-sustainability">
          <ItineraryHeaderItemTitle>
            <FormattedMessage id="common.itineraryDescriptions.sustainability" />
          </ItineraryHeaderItemTitle>
          <ItineraryHeaderItemContent className="itin-sustainability-content">
            <StyledLeafIcon><Icon Icon={SolidLeaf} /></StyledLeafIcon>
            <StyledLeafIcon><Icon Icon={co2Category !== 'high' ? SolidLeaf : EmptyLeaf} /></StyledLeafIcon>
            <StyledLeafIcon><Icon Icon={co2Category === 'low' ? SolidLeaf : EmptyLeaf} /></StyledLeafIcon>
            <span className="sustainability-value">
              {Math.round((co2/1000) * 100) / 100}
              <span className="sustainability-units">KWH/PASSENGER</span>
            </span>
          </ItineraryHeaderItemContent>
        </ItineraryHeaderItem>;

    const localizedGradationMapWithIcons = localizeGradationMap(
      intl,
      SvgIcon,
      accessibilityScoreGradationMap
    );

    const handleClick = () => {
      setActiveItinerary(itinerary);
      setActiveLeg(null, null);
      setItineraryView(ItineraryView.FULL);
      // Reset the scroll. Refs would be the more
      // appropriate way to do this, but they don't work
      setTimeout(
        () => document.querySelector('.itin-wrapper')?.scrollIntoView(),
        10
      );
    };

    // Use first leg's agency as a fallback
    return (
      <div
        className={`option metro-itin${active ? ' active' : ''}${
          expanded ? ' expanded' : ''
        }`}
      >
        <div
          className="header"
          onClick={handleClick}
          // TODO: once this can be tabbed to, this behavior needs to be improved. Maybe it focuses the
          // first time?
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          onKeyDown={() => {}}
          onMouseEnter={this._onMouseEnter}
          onMouseLeave={this._onMouseLeave}
          // TODO: use _onHeaderClick for tap only -- this will require disabling
          // this onClick handler after a touchStart
          // TODO: CORRECT THIS ARIA ROLE
          role="presentation"
          // TODO test this with a screen reader
          // tabIndex={expanded ? 1 : 0}
        >
          <ItineraryWrapper className={`itin-wrapper`}>
            {durationItem}
            {modesItem}
            {sustainabilityItem}
          </ItineraryWrapper>
        </div>
        {active && expanded && (
          <>
            {showRealtimeAnnotation && <SimpleRealtimeAnnotation />}
            <ItineraryBody
              accessibilityScoreGradationMap={localizedGradationMapWithIcons}
              itinerary={itinerary}
              LegIcon={LegIcon}
              RouteDescriptionOverride={RouteBlock}
              setActiveLeg={setActiveLeg}
            />
          </>
        )}
      </div>
    )
  }
}

// TODO: state type
const mapStateToProps = (state: any, ownProps: Props) => {
  const activeSearch = getActiveSearch(state)
  const activeItineraryTimeIndex =
    // @ts-expect-error state is not yet typed
    activeSearch && activeSearch.activeItineraryTimeIndex

  return {
    accessibilityScoreGradationMap:
      state.otp.config.accessibilityScore?.gradationMap,
    activeItineraryTimeIndex,
    arrivesAt: state.otp.currentQuery.departArrive === 'ARRIVE',
    co2Config: state.otp.config.co2,
    configCosts: state.otp.config.itinerary?.costs,
    // The configured (ambient) currency is needed for rendering the cost
    // of itineraries whether they include a fare or not, in which case
    // we show $0.00 or its equivalent in the configured currency and selected locale.
    currency: state.otp.config.localization?.currency || 'USD',
    defaultFareKey: state.otp.config.itinerary?.defaultFareKey,
    enableDot: !state.otp.config.itinerary?.disableMetroSeperatorDot,
    // @ts-expect-error TODO: type activeSearch
    pending: activeSearch ? Boolean(activeSearch.pending) : false,
    showLegDurations: state.otp.config.itinerary?.showLegDurations
  }
}

// TS TODO: correct redux types
const mapDispatchToProps = (dispatch: any) => {
  return {
    setItineraryTimeIndex: (payload: number) =>
      dispatch(narrativeActions.setActiveItineraryTime(payload)),
    setItineraryView: (payload: any) =>
      dispatch(uiActions.setItineraryView(payload))
  }
}

export default injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(MetroItinerary)
)
