import { useSelector } from "react-redux"

// import forbiddenContent from "../component"

const authorizedContent = () => {
  return (
    <div style={{ marginTop: "200px" }}>
      <h1>Tenant</h1>
    </div>
  )
}

const unathorizedContent = () => {
  return (
    <div style={{ marginTop: "200px" }}>
      <h1>Terlarang</h1>
    </div>
  )
}

const Tenant = () => {
  const authSelector = useSelector((state) => state.auth)

  // kalo mau redirect
  // if(authSelector.role !== 'tenant') Navigate('/forbidden')

  return authSelector.role === "tenant"
    ? authorizedContent()
    : unathorizedContent()
}

export default Tenant

/**
 * submit login
 * dispatch(login)
 *
 */
