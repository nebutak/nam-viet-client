const Can = ({ permission, children, option = 'every' }) => {
  const userPermissions =
    JSON.parse(localStorage.getItem('permissionCodes')) || []

  const hasPermission = Array.isArray(permission)
    ? option === 'every'
      ? permission.every((p) => userPermissions.includes(p))
      : permission.some((p) => userPermissions.includes(p))
    : userPermissions.includes(permission) // Single permission check

  if (hasPermission) {
    return <>{children}</> // Render children if the user has the required permission(s)
  }

  return null // Render null if the user doesn't have the required permission(s)
}

export default Can
