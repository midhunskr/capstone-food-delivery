import React from 'react'
import { ItemScroller } from './restaurant/ItemScroller'
import { RestaurantListing } from './restaurant/RestaurantListing'
import { CuisineListing } from './restaurant/CuisineListing'

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
