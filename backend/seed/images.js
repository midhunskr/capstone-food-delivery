/**
 * Seed image fields.
 *
 * Photography lives in the web app (web/public/images/food) and is resolved by
 * web/lib/foodImages.js, which maps cuisines, restaurants and dishes to the
 * right master. The database therefore stores no image URLs: an entity is
 * identified by slug or name, and the frontend decides what it looks like.
 *
 * That keeps one source of truth for imagery and means a dish with no honest
 * photograph renders text-first rather than carrying a dead placeholder.
 *
 * These helpers remain so the seed shape is unchanged; they simply return null.
 */

export const restaurantImage = () => null

export const restaurantCover = () => null

export const dishImage = () => null

export const cuisineImage = () => null
