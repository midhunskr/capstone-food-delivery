import React from 'react'
import { ItemScroller } from './ItemScroller'
import { RestaurantListing } from './RestaurantListing'
import { CuisineListing } from './CuisineListing'

export const UserLanding = () => {
  return (
    <div>
      <div className='bg-bg-white text-dark'>
        <ItemScroller/>
        <RestaurantListing/>
        <CuisineListing/>
        </div>
    </div>
  )
}
