let navigateFunction = null

export const setNavigateFunction = (navigate) => {
  navigateFunction = navigate
}

export const navigateTo = (path) => {
  if (navigateFunction) {
    navigateFunction(path)
  }
}
