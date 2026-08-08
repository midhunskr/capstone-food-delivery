import { after, before, describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { api, startTestServer, stopTestServer } from './helpers.js'
import { seedDatabase } from '../seed/index.js'

let seedSummary

before(async () => {
    await startTestServer()
    seedSummary = await seedDatabase()
})

after(async () => {
    await stopTestServer()
})

describe('seed', () => {
    it('produces the curated dataset', () => {
        assert.ok(seedSummary.restaurants >= 12 && seedSummary.restaurants <= 15,
            `restaurants: ${seedSummary.restaurants}`)
        assert.ok(seedSummary.menuItems >= 150 && seedSummary.menuItems <= 220,
            `menu items: ${seedSummary.menuItems}`)
        assert.ok(seedSummary.cuisines >= 10 && seedSummary.cuisines <= 12)
        assert.ok(seedSummary.offers >= 6 && seedSummary.offers <= 8)
    })

    it('is idempotent — re-running gives identical counts, no duplicates', async () => {
        const second = await seedDatabase()
        assert.deepEqual(second, seedSummary)
    })

    it('is deterministic — ratings are stable across runs', async () => {
        const first = await api('/api/v2/restaurants/dum-street/menu')
        await seedDatabase()
        const second = await api('/api/v2/restaurants/dum-street/menu')
        assert.deepEqual(
            first.body.data.sections[0].items.map((i) => i.rating),
            second.body.data.sections[0].items.map((i) => i.rating),
        )
    })

    it('seeds believable ratings, not all near-perfect', async () => {
        const res = await api('/api/v2/restaurants?limit=50')
        const averages = res.body.data.map((r) => r.rating.average)
        assert.ok(Math.min(...averages) < 4.0, `min rating ${Math.min(...averages)}`)
        assert.ok(Math.max(...averages) <= 4.8)
        assert.ok(new Set(averages).size > 5, 'ratings should vary')
    })
})

describe('GET /api/v2/home', () => {
    it('returns every discovery section populated', async () => {
        const res = await api('/api/v2/home')
        assert.equal(res.status, 200)
        assert.equal(res.body.ok, true)

        const d = res.body.data
        for (const key of ['cuisines', 'offers', 'featuredRestaurants', 'popularRestaurants',
            'topRatedRestaurants', 'nearbyRestaurants', 'popularDishes']) {
            assert.ok(Array.isArray(d[key]), `${key} should be an array`)
            assert.ok(d[key].length > 0, `${key} should not be empty`)
        }
    })

    it('does not dump the whole catalogue into any section', async () => {
        const d = (await api('/api/v2/home')).body.data
        assert.ok(d.popularRestaurants.length <= 10)
        assert.ok(d.popularDishes.length <= 12)
    })

    it('top rated is actually sorted by rating', async () => {
        const list = (await api('/api/v2/home')).body.data.topRatedRestaurants
        const averages = list.map((r) => r.rating.average)
        assert.deepEqual(averages, [...averages].sort((a, b) => b - a))
    })

    it('popular dishes carry their restaurant for linking', async () => {
        const dishes = (await api('/api/v2/home')).body.data.popularDishes
        assert.ok(dishes.every((d) => d.restaurant?.slug), 'every dish needs a restaurant')
    })

    it('cuisines include a restaurant count', async () => {
        const cuisines = (await api('/api/v2/home')).body.data.cuisines
        assert.ok(cuisines.every((c) => typeof c.restaurantCount === 'number'))
        assert.ok(cuisines.some((c) => c.restaurantCount > 0))
    })
})

describe('GET /api/v2/restaurants — listing and pagination', () => {
    it('returns cards with pagination meta', async () => {
        const res = await api('/api/v2/restaurants?page=1&limit=5')
        assert.equal(res.status, 200)
        assert.equal(res.body.data.length, 5)
        assert.equal(res.body.meta.page, 1)
        assert.equal(res.body.meta.limit, 5)
        assert.ok(res.body.meta.total >= 12)
        assert.equal(res.body.meta.pages, Math.ceil(res.body.meta.total / 5))
    })

    it('page 2 returns different restaurants', async () => {
        const [p1, p2] = await Promise.all([
            api('/api/v2/restaurants?page=1&limit=5'),
            api('/api/v2/restaurants?page=2&limit=5'),
        ])
        const ids1 = p1.body.data.map((r) => r.id)
        const ids2 = p2.body.data.map((r) => r.id)
        assert.equal(ids1.filter((id) => ids2.includes(id)).length, 0)
    })

    it('rejects a bad limit rather than silently accepting it', async () => {
        const res = await api('/api/v2/restaurants?limit=500')
        assert.equal(res.status, 400)
        assert.equal(res.body.error.code, 'VALIDATION_FAILED')
    })
})

describe('GET /api/v2/restaurants — filters', () => {
    it('filters by cuisine', async () => {
        const res = await api('/api/v2/restaurants?cuisine=biryani')
        assert.ok(res.body.data.length > 0)
        assert.ok(res.body.data.every((r) => r.cuisines.includes('biryani')))
    })

    it('filters by multiple cuisines', async () => {
        const res = await api('/api/v2/restaurants?cuisine=pizza,burgers')
        assert.ok(res.body.data.length >= 2)
        assert.ok(res.body.data.every((r) =>
            r.cuisines.includes('pizza') || r.cuisines.includes('burgers')))
    })

    it('filters to veg-only restaurants', async () => {
        const res = await api('/api/v2/restaurants?veg=1')
        assert.ok(res.body.data.length > 0)
        assert.ok(res.body.data.every((r) => r.isVegOnly === true))
    })

    it('filters by minimum rating', async () => {
        const res = await api('/api/v2/restaurants?rating=4.3')
        assert.ok(res.body.data.length > 0)
        assert.ok(res.body.data.every((r) => r.rating.average >= 4.3))
        const all = await api('/api/v2/restaurants?limit=50')
        assert.ok(res.body.meta.total < all.body.meta.total, 'filter should narrow results')
    })

    it('filters by max delivery time', async () => {
        const res = await api('/api/v2/restaurants?maxDeliveryTime=28')
        assert.ok(res.body.data.length > 0)
        assert.ok(res.body.data.every((r) => r.deliveryTimeMinutes <= 28))
    })

    it('filters to restaurants with an offer', async () => {
        const res = await api('/api/v2/restaurants?offers=1')
        assert.ok(res.body.data.length > 0)
        assert.ok(res.body.data.every((r) => r.offerLabel !== null),
            'offers filter should only return restaurants with an offer label')
    })

    it('filters to free delivery', async () => {
        const res = await api('/api/v2/restaurants?freeDelivery=1')
        assert.ok(res.body.data.length > 0)
        assert.ok(res.body.data.every((r) => r.deliveryFee === 0 || r.freeDeliveryAbove !== null))
    })

    it('combines filters with AND', async () => {
        const res = await api('/api/v2/restaurants?rating=4.2&maxDeliveryTime=35')
        assert.ok(res.body.data.every((r) => r.rating.average >= 4.2 && r.deliveryTimeMinutes <= 35))
    })

    it('returns an empty list, not an error, when nothing matches', async () => {
        const res = await api('/api/v2/restaurants?rating=5&maxDeliveryTime=1')
        assert.equal(res.status, 200)
        assert.deepEqual(res.body.data, [])
        assert.equal(res.body.meta.total, 0)
    })
})

describe('GET /api/v2/restaurants — sorting', () => {
    it('sorts by rating', async () => {
        const res = await api('/api/v2/restaurants?sort=rating&limit=50')
        const values = res.body.data.map((r) => r.rating.average)
        assert.deepEqual(values, [...values].sort((a, b) => b - a))
    })

    it('sorts by delivery time', async () => {
        const res = await api('/api/v2/restaurants?sort=deliveryTime&limit=50')
        const values = res.body.data.map((r) => r.deliveryTimeMinutes)
        assert.deepEqual(values, [...values].sort((a, b) => a - b))
    })

    it('sorts by price low to high', async () => {
        const res = await api('/api/v2/restaurants?sort=priceLow&limit=50')
        const values = res.body.data.map((r) => r.priceForTwo)
        assert.deepEqual(values, [...values].sort((a, b) => a - b))
    })

    it('rejects an unknown sort', async () => {
        const res = await api('/api/v2/restaurants?sort=magic')
        assert.equal(res.status, 400)
    })
})

describe('GET /api/v2/restaurants/:slug', () => {
    it('returns full detail for a valid slug', async () => {
        const res = await api('/api/v2/restaurants/kappa-and-co')
        assert.equal(res.status, 200)

        const d = res.body.data
        assert.equal(d.slug, 'kappa-and-co')
        assert.equal(d.area, 'Kakkanad')
        assert.ok(d.description)
        assert.ok(d.cuisines.length > 0)
        assert.ok(typeof d.rating.average === 'number')
        assert.ok(typeof d.deliveryTimeMinutes === 'number')
        assert.ok(Array.isArray(d.offers))
        assert.ok(d.menuItemCount > 0)
    })

    it('includes both restaurant-specific and global offers', async () => {
        const d = (await api('/api/v2/restaurants/kappa-and-co')).body.data
        assert.ok(d.offers.some((o) => o.scope === 'restaurant'))
        assert.ok(d.offers.some((o) => o.scope === 'global'))
    })

    it('excludes expired offers', async () => {
        const d = (await api('/api/v2/restaurants/kappa-and-co')).body.data
        assert.ok(!d.offers.some((o) => o.code === 'EXPIRED10'))
    })

    it('returns a human 404 for an unknown slug', async () => {
        const res = await api('/api/v2/restaurants/not-a-real-place')
        assert.equal(res.status, 404)
        assert.equal(res.body.ok, false)
        assert.equal(res.body.error.code, 'RESTAURANT_NOT_FOUND')
        assert.equal(res.body.error.message, "We couldn't find that restaurant.")
    })
})

describe('GET /api/v2/restaurants/:slug/menu', () => {
    it('returns the menu already grouped into sections', async () => {
        const res = await api('/api/v2/restaurants/dum-street/menu')
        assert.equal(res.status, 200)

        const d = res.body.data
        assert.ok(d.sections.length > 1)
        assert.ok(d.categories.length === d.sections.length)
        assert.ok(d.sections.every((s) => s.items.length > 0))
        assert.equal(d.totalItems, d.sections.reduce((n, s) => n + s.items.length, 0))
    })

    it('orders sections the way the menu reads, not alphabetically', async () => {
        const d = (await api('/api/v2/restaurants/kappa-and-co/menu')).body.data
        const names = d.categories.map((c) => c.name)
        assert.equal(names[0], 'Kerala Specials')
        assert.equal(names[names.length - 1], 'Desserts')
        assert.notDeepEqual(names, [...names].sort())
    })

    it('exposes bestseller and popular flags on items', async () => {
        const d = (await api('/api/v2/restaurants/dum-street/menu')).body.data
        const items = d.sections.flatMap((s) => s.items)
        assert.ok(items.some((i) => i.isBestseller))
        assert.ok(items.some((i) => i.isPopular))
    })

    it('filters the menu to veg', async () => {
        const d = (await api('/api/v2/restaurants/dum-street/menu?veg=1')).body.data
        const items = d.sections.flatMap((s) => s.items)
        assert.ok(items.length > 0)
        assert.ok(items.every((i) => i.isVeg === true))
    })

    it('filters the menu by category', async () => {
        const d = (await api('/api/v2/restaurants/dum-street/menu?category=Biryani')).body.data
        assert.equal(d.sections.length, 1)
        assert.equal(d.sections[0].category, 'Biryani')
    })

    it('searches within the menu', async () => {
        const d = (await api('/api/v2/restaurants/dum-street/menu?q=mutton')).body.data
        const items = d.sections.flatMap((s) => s.items)
        assert.ok(items.length > 0)
        assert.ok(items.every((i) =>
            /mutton/i.test(i.name) || /mutton/i.test(i.description ?? '')))
    })

    it('404s for an unknown restaurant', async () => {
        const res = await api('/api/v2/restaurants/nope/menu')
        assert.equal(res.status, 404)
    })
})

describe('GET /api/v2/search', () => {
    it('finds restaurants by name', async () => {
        const d = (await api('/api/v2/search?q=dum')).body.data
        assert.ok(d.restaurants.some((r) => r.slug === 'dum-street'))
    })

    it('finds dishes by name and links them to a restaurant', async () => {
        const d = (await api('/api/v2/search?q=biryani')).body.data
        assert.ok(d.dishes.length > 0)
        assert.ok(d.dishes.every((i) => i.restaurant?.slug))
    })

    it('finds cuisines', async () => {
        const d = (await api('/api/v2/search?q=kerala')).body.data
        assert.ok(d.cuisines.some((c) => c.slug === 'kerala'))
    })

    it('matches partial words', async () => {
        const d = (await api('/api/v2/search?q=biry')).body.data
        assert.ok(d.dishes.length > 0 || d.restaurants.length > 0)
    })

    it('separates the three result types', async () => {
        const d = (await api('/api/v2/search?q=chicken')).body.data
        assert.ok(Array.isArray(d.restaurants) && Array.isArray(d.dishes) && Array.isArray(d.cuisines))
    })

    it('returns empty buckets for a missing or too-short query', async () => {
        for (const path of ['/api/v2/search', '/api/v2/search?q=', '/api/v2/search?q=a']) {
            const res = await api(path)
            assert.equal(res.status, 200, path)
            assert.deepEqual(res.body.data.restaurants, [], path)
            assert.deepEqual(res.body.data.dishes, [], path)
        }
    })

    it('returns empty buckets for nonsense, not an error', async () => {
        const res = await api('/api/v2/search?q=zzzzqqq')
        assert.equal(res.status, 200)
        assert.deepEqual(res.body.data.dishes, [])
    })

    it('respects the result limit', async () => {
        const d = (await api('/api/v2/search?q=chicken&limit=3')).body.data
        assert.ok(d.dishes.length <= 3)
        assert.ok(d.restaurants.length <= 3)
    })

    it('is not confused by regex characters', async () => {
        const res = await api('/api/v2/search?q=' + encodeURIComponent('a.*('))
        assert.equal(res.status, 200)
    })
})

describe('GET /api/v2/search/suggest', () => {
    it('returns typed suggestions', async () => {
        const d = (await api('/api/v2/search/suggest?q=bir')).body.data
        assert.ok(d.suggestions.length > 0)
        assert.ok(d.suggestions.every((s) => ['restaurant', 'dish', 'cuisine'].includes(s.type)))
        assert.ok(d.suggestions.every((s) => typeof s.label === 'string'))
    })

    it('stays small', async () => {
        const d = (await api('/api/v2/search/suggest?q=c')).body.data
        assert.ok(d.suggestions.length <= 10)
    })

    it('returns nothing for a too-short query', async () => {
        const d = (await api('/api/v2/search/suggest?q=b')).body.data
        assert.deepEqual(d.suggestions, [])
    })

    it('does not repeat the same dish name', async () => {
        const d = (await api('/api/v2/search/suggest?q=chicken')).body.data
        const dishLabels = d.suggestions.filter((s) => s.type === 'dish').map((s) => s.label.toLowerCase())
        assert.equal(dishLabels.length, new Set(dishLabels).size)
    })
})

describe('GET /api/v2/cuisines', () => {
    it('returns the curated cuisines with counts', async () => {
        const res = await api('/api/v2/cuisines')
        assert.equal(res.status, 200)
        assert.ok(res.body.data.length >= 10)
        assert.ok(res.body.data.every((c) => c.name && c.slug))
        assert.ok(res.body.data.some((c) => c.restaurantCount > 0))
    })
})

describe('GET /api/v2/offers', () => {
    it('returns only active, unexpired offers', async () => {
        const res = await api('/api/v2/offers')
        assert.equal(res.status, 200)
        assert.ok(res.body.data.length >= 6)
        assert.ok(!res.body.data.some((o) => o.code === 'EXPIRED10'))
    })

    it('covers all three offer types', async () => {
        const types = new Set((await api('/api/v2/offers')).body.data.map((o) => o.type))
        assert.ok(types.has('percentage') && types.has('flat') && types.has('free_delivery'))
    })

    it('resolves the restaurant on restaurant-scoped offers', async () => {
        const scoped = (await api('/api/v2/offers')).body.data.filter((o) => o.scope === 'restaurant')
        assert.ok(scoped.length > 0)
        assert.ok(scoped.every((o) => o.restaurant?.slug))
    })

    it('filters by restaurant, keeping global offers', async () => {
        const d = (await api('/api/v2/offers?restaurantSlug=dum-street')).body.data
        assert.ok(d.some((o) => o.scope === 'global'))
        assert.ok(d.filter((o) => o.scope === 'restaurant')
            .every((o) => o.restaurant?.slug === 'dum-street'))
    })
})

describe('consistent DTO shapes', () => {
    const cardKeys = (c) => Object.keys(c).sort().join(',')

    it('restaurant cards are identical across home, listing and search', async () => {
        const [home, list, search] = await Promise.all([
            api('/api/v2/home'),
            api('/api/v2/restaurants?limit=1'),
            api('/api/v2/search?q=dum'),
        ])
        const a = cardKeys(home.body.data.popularRestaurants[0])
        const b = cardKeys(list.body.data[0])
        const c = cardKeys(search.body.data.restaurants[0])
        assert.equal(a, b)
        assert.equal(b, c)
    })

    it('dish cards are identical across menu, home and search', async () => {
        const [home, menu, search] = await Promise.all([
            api('/api/v2/home'),
            api('/api/v2/restaurants/dum-street/menu'),
            api('/api/v2/search?q=biryani'),
        ])
        const a = cardKeys(home.body.data.popularDishes[0])
        const b = cardKeys(menu.body.data.sections[0].items[0])
        const c = cardKeys(search.body.data.dishes[0])
        assert.equal(a, b)
        assert.equal(b, c)
    })

    it('never leaks mongoose internals', async () => {
        const raw = JSON.stringify((await api('/api/v2/restaurants?limit=5')).body)
        assert.ok(!raw.includes('__v'))
        assert.ok(!raw.includes('_id'))
    })
})
