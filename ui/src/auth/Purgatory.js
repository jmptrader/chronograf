import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {withRouter} from 'react-router'

import {meChangeOrganizationAsync} from 'shared/actions/auth'

import SplashPage from 'shared/components/SplashPage'
import PurgatoryAuthItem from 'src/auth/PurgatoryAuthItem'

const getRoleNameByOrgID = (id, roles) => {
  const role = roles.find(r => r.organization === id)
  return (role && role.name) || 'ghost'
}

const handleClickLogin = props => organization => async e => {
  e.preventDefault()
  const {router, links, meChangeOrganization} = props

  await meChangeOrganization(links.me, {organization: organization.id})
  router.push('')
}

const Purgatory = ({
  name,
  provider,
  scheme,
  currentOrganization,
  meChangeOrganization,
  roles,
  organizations,
  logoutLink,
  router,
  links,
}) => {
  const rolesAndOrgs = organizations.map(organization => ({
    organization,
    role: getRoleNameByOrgID(organization.id, roles),
    currentOrganization: organization.id === currentOrganization.id,
  }))

  const subHeading =
    rolesAndOrgs.length === 1
      ? 'Authenticated in 1 Organization'
      : `Authenticated in ${rolesAndOrgs.length} Organizations`

  return (
    <SplashPage>
      <div className="auth--purgatory">
        <h3>
          {name}
        </h3>
        <h6>
          {subHeading}{' '}
          <code>
            {scheme}/{provider}
          </code>
        </h6>
        {rolesAndOrgs.length
          ? <div className="auth--list">
              {rolesAndOrgs.map((rag, i) =>
                <PurgatoryAuthItem
                  key={i}
                  roleAndOrg={rag}
                  onClickLogin={handleClickLogin({
                    router,
                    links,
                    meChangeOrganization,
                  })}
                />
              )}
            </div>
          : <p>You are a Lost Soul</p>}
        <a href={logoutLink} className="btn btn-sm btn-link auth--logout">
          Logout
        </a>
      </div>
    </SplashPage>
  )
}

const {arrayOf, func, shape, string} = PropTypes

Purgatory.propTypes = {
  router: shape({
    push: func.isRequired,
  }).isRequired,
  links: shape({
    me: string.isRequired,
  }),
  name: string.isRequired,
  provider: string.isRequired,
  scheme: string.isRequired,
  currentOrganization: shape({
    id: string.isRequired,
    name: string.isRequired,
  }).isRequired,
  roles: arrayOf(
    shape({
      name: string,
      organization: string,
    })
  ).isRequired,
  organizations: arrayOf(
    shape({
      id: string,
      name: string,
    })
  ).isRequired,
  logoutLink: string.isRequired,
  meChangeOrganization: func.isRequired,
}

const mapStateToProps = ({
  links,
  auth: {
    me: {name, provider, scheme, currentOrganization, roles, organizations},
    logoutLink,
  },
}) => ({
  links,
  name,
  provider,
  scheme,
  currentOrganization,
  roles,
  organizations,
  logoutLink,
})

const mapDispatchToProps = dispatch => ({
  meChangeOrganization: bindActionCreators(meChangeOrganizationAsync, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(
  withRouter(Purgatory)
)