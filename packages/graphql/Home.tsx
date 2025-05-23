import React from 'react'

import { useEventsSubscription, useGetAtomQuery } from './src/generated'

const Home = () => {
  const { data } = useGetAtomQuery({ id: 25 })

  console.log(data)
}

export default Home
