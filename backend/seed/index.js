import mongoose from 'mongoose'
import { Restaurant } from '../models/v2/restaurant.js'
import { MenuItem } from '../models/v2/menuItem.js'
import { Cuisine } from '../models/v2/cuisine.js'
import { Offer } from '../models/v2/offer.js'
import { cuisines } from './data/cuisines.js'
import { restaurants } from './data/restaurants.js'
import { offers } from './data/offers.js'
import { cuisineImage, dishImage, restaurantCover, restaurantImage } from './images.js'

/**
 * Seeds the v2 discovery collections.
 *
 * Deterministic: dish ratings come from a hash of the dish name, so repeated
 * runs produce identical data. Resettable: it clears the four v2 collections
 * first, so running twice leaves the same result rather than duplicates.
 *
 * Only touches v2 collections. Legacy v1 data is never read or written.
 */

// Small deterministic hash → stable "random" values without a seeded PRNG dependency.
const hash = (text) => {
    let h = 0
    for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) >>> 0
    return h
}

const pick = (text, min, max) => min + (hash(text) % (max - min + 1))

const slugify = (text) => text.toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

/**
 * Dish rating: believable spread in 3.8–4.8, nudged up for popular/bestseller
 * items so the discovery rails are not contradicted by the numbers on them.
 * Roughly one dish in nine has too few ratings to show a score at all.
 */
const dishRating = (name, { popular, bestseller }) => {
    const seed = hash(name)
    if (seed % 9 === 0 && !popular && !bestseller) return { average: 0, count: 0 }

    let average = 3.8 + ((seed % 9) / 10)
    if (popular) average = Math.min(4.8, average + 0.2)
    if (bestseller) average = Math.min(4.8, average + 0.1)

    return {
        average: Math.round(average * 10) / 10,
        count: pick(`${name}-count`, 18, 480),
    }
}

export const seedDatabase = async ({ log = false } = {}) => {
    const say = (...args) => { if (log) console.log(...args) }

    await Promise.all([
        Restaurant.deleteMany({}),
        MenuItem.deleteMany({}),
        Cuisine.deleteMany({}),
        Offer.deleteMany({}),
    ])

    // --- cuisines ---
    const cuisineDocs = await Cuisine.insertMany(cuisines.map((c, index) => ({
        ...c,
        image: cuisineImage(c.name),
        displayOrder: index,
        isActive: true,
    })))

    // --- restaurants + menu items ---
    const restaurantDocs = []
    const menuItemDocs = []

    for (const entry of restaurants) {
        const { items, ...meta } = entry

        const doc = {
            ...meta,
            image: restaurantImage(meta.name),
            coverImage: restaurantCover(meta.name),
            city: 'Kochi',
            addressLine: `${meta.area}, Kochi, Kerala`,
            isVegOnly: !!meta.isVegOnly,
            isActive: true,
            minimumOrder: meta.minimumOrder ?? 0,
        }
        restaurantDocs.push(doc)
    }

    const savedRestaurants = await Restaurant.insertMany(restaurantDocs)
    const bySlug = new Map(savedRestaurants.map((r) => [r.slug, r]))

    for (const entry of restaurants) {
        const restaurant = bySlug.get(entry.slug)

        // Section order = order of first appearance in the seed file, which is
        // how the menu is meant to read.
        const categoryOrder = new Map()
        for (const [, , , category] of entry.items) {
            if (!categoryOrder.has(category)) categoryOrder.set(category, categoryOrder.size)
        }

        for (const [name, price, isVeg, category, description, flags = ''] of entry.items) {
            const popular = flags.includes('p')
            const bestseller = flags.includes('b')

            menuItemDocs.push({
                restaurant: restaurant._id,
                name,
                slug: slugify(name),
                description,
                image: dishImage(name),
                category,
                categoryOrder: categoryOrder.get(category),
                cuisines: entry.cuisines,
                price,
                isVeg,
                isAvailable: !flags.includes('x'),
                isPopular: popular,
                isBestseller: bestseller,
                rating: dishRating(`${entry.slug}-${name}`, { popular, bestseller }),
                orderCount: popular || bestseller
                    ? pick(`${name}-orders-hi`, 400, 2600)
                    : pick(`${name}-orders`, 20, 380),
            })
        }
    }

    const savedItems = await MenuItem.insertMany(menuItemDocs)

    // --- offers ---
    const offerDocs = offers.map((o) => {
        const { restaurantSlug, expired, ...rest } = o
        const now = Date.now()
        return {
            ...rest,
            code: rest.code || undefined,
            restaurant: restaurantSlug ? bySlug.get(restaurantSlug)?._id ?? null : null,
            validFrom: new Date(now - 30 * 24 * 3600 * 1000),
            validTo: expired
                ? new Date(now - 2 * 24 * 3600 * 1000)
                : new Date(now + 90 * 24 * 3600 * 1000),
        }
    })

    const savedOffers = await Offer.insertMany(offerDocs)

    const summary = {
        cuisines: cuisineDocs.length,
        restaurants: savedRestaurants.length,
        menuItems: savedItems.length,
        offers: savedOffers.length,
        activeOffers: savedOffers.filter((o) => o.isActive).length,
    }

    say('Seeded:', summary)
    return summary
}

// CLI: `npm run seed`
const isDirectRun = process.argv[1]?.replace(/\\/g, '/').endsWith('seed/index.js')

if (isDirectRun) {
    const { env } = await import('../config/env.js')
    await mongoose.connect(env.mongoUri)
    await seedDatabase({ log: true })
    await mongoose.connection.close()
    process.exit(0)
}
