import React from 'react'
import { ItemScroller } from './ItemScroller'
import { RestaurantListing } from './RestaurantListing'
import { CuisineListing } from './CuisineListing'

export const UserLanding = () => {
  return (
    <div>

        <ItemScroller/>
        <RestaurantListing/>
        <CuisineListing/>

    </div>
  )
}
