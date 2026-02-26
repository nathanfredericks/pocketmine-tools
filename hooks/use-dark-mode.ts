import * as React from 'react'

export function useDarkMode() {
  const [isDark, setIsDark] = React.useState(false)

  React.useEffect(() => {
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => {
      setIsDark(mql.matches)
    }
    mql.addEventListener('change', onChange)
    setIsDark(mql.matches)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  return isDark
}
