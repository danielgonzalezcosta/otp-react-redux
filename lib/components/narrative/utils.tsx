import { IntlShape } from 'react-intl'
import React from 'react'

import StyledIconWrapper from '../util/styledIcon'

/**
 * Adds SVG icons to gradation map.
 * TODO: This function should be implemented where the icons are displayed,
 * rather than messily rewriting the gradation mapping object. Future accessilibty refactor?
 * @param SvgIcon SvgIcon from context
 * @param gradationMap Gradation mapping from config
 * @returns Gradation mapping with icons
 */
export function addIconsGradationMap(
  SvgIcon: React.ComponentType<{ iconName: string }>,
  gradationMap: Record<string, any>
): Record<string, any> {
  const newGradationMap: Record<string, any> = {}
  Object.keys(gradationMap).forEach((key) => {
    newGradationMap[key] = gradationMap[key]
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
 * Takes a gradation map and overrides the text with intl strings when available.
 * Also replaces icon string with actual icon components.
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
  const newGradationMap = addIconsGradationMap(SvgIcon, gradationMap)
  Object.keys(newGradationMap).forEach((key) => {
    // As these localization keys are in the config, rather than
    // standard language files, the message ids must be dynamically generated
    const localizationId = `config.acessibilityScore.gradationMap.${key}`
    const localizedText = intl.formatMessage({ id: localizationId })
    // Override the config label if a localized label exists
    if (localizationId !== localizedText) {
      newGradationMap[key].text = localizedText
    }
  })
  return newGradationMap
}
