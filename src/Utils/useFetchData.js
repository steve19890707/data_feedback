import { useState, useEffect, useCallback } from "react"
import { List, fromJS } from "immutable"
import get from "lodash/get";
import noop from "lodash/noop";

export default props => {
  const fetchDataFunction = get(props, "fetchDataFunction", noop)
  const params = get(props, "params")
  const [fetchData, setFetchData] = useState(List())
  const [isLoading, setIsLoading] = useState(true)
  const fetchApi = useCallback({
    fetchApiFunc() {
      setIsLoading(true)
      fetchDataFunction({
        resolve(res) {
          const resData = !res ? List() : fromJS(res);
          setFetchData(resData)
          setIsLoading(false)
        }
      })
    }
  },[params])
  const { fetchApiFunc } = fetchApi
  useEffect(() => {
    fetchApiFunc()
  }, [fetchApiFunc])
  return {
    isLoading,
    fetchApiFunc,
    fetchData
  }
}

