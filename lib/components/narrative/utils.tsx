import { IntlShape } from 'react-intl'
import React from 'react'

import { StyledIconWrapper } from '../util/styledIcon'

/**
 * Takes a gradation map and overrides the text with intl strings when available.
 * Also replaces icon string with actual icon components.
 * TODO: This function should be implemented where the icons are displayed,
 * rather than messily rewriting the gradation mapping object. Future accessilibty refactor?
 * @param intl React-Intl object
 * @param SvgIcon SvgIcon from context
 * @param gradationMap Gradation mapping from config
 * @returns Gradation map with icons and overridden text
 */
export function localizeGradationMap(
  intl: IntlShape,
  SvgIcon: React.ComponentType<{ iconName: string }>,
  gradationMap?: Record<string, any>
): Record<string, any> {
  if (!gradationMap) return {}
  const newGradationMap: Record<string, any> = { ...gradationMap }

  Object.keys(newGradationMap).forEach((key) => {
    // As these localization keys are in the config, rather than
    // standard language files, the message ids must be dynamically generated
    const localizationId = `config.accessibilityScore.gradationMap.${key}`
    const localizedText = intl.formatMessage({ id: localizationId })
    // Override the config label if a localized label exists
    if (localizationId !== localizedText) {
      newGradationMap[key].text = localizedText
    }

    const iconName = gradationMap[key].icon
    if (typeof iconName === 'string') {
      newGradationMap[key].icon = (
        <StyledIconWrapper>
          <SvgIcon iconName={iconName} />
        </StyledIconWrapper>
      )
    }
  })
  return newGradationMap
}

/**
 * Takes the itinerary start time and returns a label for button title and
 * screen readers that indicates whether the departure time is based on realtime
 * or scheduled data.
 * @param intl React-Intl object
 * @param time Itinerary start time
 * @param realTime Whether the itinerary is based on realtime data
 * @returns string with time and realtime/schedule status
 */
export const getDepartureLabelText = (
  intl: IntlShape,
  time: any,
  realTime: boolean
): string => {
  return `${intl.formatTime(time)} ${
    realTime
      ? `(${intl.formatMessage({ id: 'components.StopTimeCell.realtime' })})`
      : `(${intl.formatMessage({ id: 'components.StopTimeCell.scheduled' })})`
  }`
}
