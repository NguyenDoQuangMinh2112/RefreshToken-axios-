import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { setNavigateFunction } from '~/utils/navigation'

const useNavigateSetter = () => {
  const navigate = useNavigate()

  useEffect(() => {
    setNavigateFunction(navigate)
  }, [navigate])
}

export default useNavigateSetter
