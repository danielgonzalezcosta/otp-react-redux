import * as flags from 'country-flag-icons/react/3x2'
import { connect, ConnectedProps } from 'react-redux'
import { MenuItem, NavDropdown } from 'react-bootstrap'
import { useIntl } from 'react-intl'
import React, { MouseEvent } from 'react'
import styled from 'styled-components'

import * as uiActions from '../../actions/ui'
import * as userActions from '../../actions/user'

const FlagContainer = styled.span`
  &::after {
    content: '';
    margin: 0 0.125em;
  }
`

type PropsFromRedux = ConnectedProps<typeof connector>

interface LocaleSelectorProps extends PropsFromRedux {
  // Typescript TODO configLanguageType
  configLanguages: Record<string, any>
  style?: any
}

const LocaleSelector = (props: LocaleSelectorProps): JSX.Element => {
  const {
    configLanguages,
    createOrUpdateUser,
    locale: currentLocale,
    loggedInUser,
    setLocale
  } = props

  const CurrentLocaleFlag = flags[configLanguages[currentLocale].flag]
  const intl = useIntl()

  const handleLocaleSelection = (e: MouseEvent<Element>, locale: string) => {
    e.stopPropagation()

    window.localStorage.setItem('lang', locale)

    if (loggedInUser) {
      loggedInUser.preferredLanguage = locale
      createOrUpdateUser(loggedInUser, false, intl)
    }
    setLocale(locale)

    document.location.reload()
  }

  return (
    <NavDropdown
      id="locale-selector"
      pullRight
      title={<CurrentLocaleFlag style={{ width: 15 }} />}
    >
      {Object.keys(configLanguages).map((locale) => {
        const Flag = flags[configLanguages[locale].flag]
        if (locale === currentLocale)
          return (
            <MenuItem>
              <FlagContainer>
                <span
                  aria-label="checkbox"
                  role="img"
                  style={{ float: 'left' }}
                >
                  ☑️
                </span>
              </FlagContainer>
              {configLanguages[locale].name}
            </MenuItem>
          )
        else
          return (
            locale !== 'allLanguages' && (
              <MenuItem
                onClick={(e: MouseEvent) => handleLocaleSelection(e, locale)}
              >
                <FlagContainer>
                  <Flag style={{ width: 15 }} />
                </FlagContainer>
                {configLanguages[locale].name}
              </MenuItem>
            )
          )
      })}
    </NavDropdown>
  )
}

// Typescript TODO: type state properly
const mapStateToProps = (state: any) => {
  return {
    locale: state.otp.ui.locale,
    loggedInUser: state.user.loggedInUser
  }
}

const mapDispatchToProps = {
  createOrUpdateUser: userActions.createOrUpdateUser,
  setLocale: uiActions.setLocale
}

const connector = connect(mapStateToProps, mapDispatchToProps)
export default connector(LocaleSelector)
