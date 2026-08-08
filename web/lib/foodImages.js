/**
 * MORO photography.
 *
 * The single source of truth for which photograph represents which cuisine,
 * restaurant and dish. Components ask this module and never reason about
 * filenames, so the same entity looks identical on home, in search, in
 * favourites, on the restaurant page and in orders.
 *
 * The governing rule is accuracy over coverage: a dish with no honest
 * photograph returns null and renders text-first. Showing a burger for a
 * shawarma to fill a grid is worse than showing nothing.
 *
 * Masters are 1536×1024 WebP in /public/images/food. `focus` sets
 * object-position where a centre crop would cut the defining element — most
 * matter in the circular cuisine ribbon.
 */

const DIR = '/images/food'

/** Every supplied asset, with the alt text and crop focus it should carry. */
export const ASSETS = {
    kulukkiSarbath: {
        src: `${DIR}/drink-kulukki-sarbath.webp`,
        alt: 'Kulukki sarbath with lime and basil seeds',
    },
    bakerySpread: {
        src: `${DIR}/food-bakery-dessert-spread.webp`,
        alt: 'Cakes, brownies and pastries on a bakery counter',
    },
    belgianChocolateCake: {
        src: `${DIR}/food-belgian-chocolate-cake.webp`,
        alt: 'Slice of Belgian chocolate cake',
    },
    butterChickenNaan: {
        src: `${DIR}/food-butter-chicken-garlic-naan.webp`,
        alt: 'Butter chicken with garlic naan',
    },
    alFaham: {
        src: `${DIR}/food-charcoal-chicken-alfaham.webp`,
        alt: 'Charcoal-grilled al faham chicken',
    },
    chickenBiryani: {
        src: `${DIR}/food-chicken-dum-biryani.webp`,
        alt: 'Chicken dum biryani',
    },
    chickenMandi: {
        src: `${DIR}/food-chicken-mandi.webp`,
        alt: 'Chicken mandi on smoked rice',
    },
    chickenShawarma: {
        src: `${DIR}/food-chicken-shawarma.webp`,
        alt: 'Chicken shawarma wrap',
    },
    chilliChicken: {
        src: `${DIR}/food-chilli-chicken.webp`,
        alt: 'Chilli chicken with peppers and spring onion',
    },
    chickenBurger: {
        src: `${DIR}/food-classic-chicken-burger.webp`,
        alt: 'Fried chicken burger',
    },
    healthySalad: {
        src: `${DIR}/food-fresh-healthy-salad.webp`,
        alt: 'Fresh green salad',
    },
    friedRice: {
        src: `${DIR}/food-fried-rice.webp`,
        alt: 'Wok-fried rice with vegetables',
    },
    quinoaBowl: {
        src: `${DIR}/food-grilled-chicken-quinoa-bowl.webp`,
        alt: 'Grilled chicken quinoa bowl',
    },
    hakkaNoodles: {
        src: `${DIR}/food-hakka-noodles.webp`,
        alt: 'Hakka noodles',
    },
    wokSpread: {
        src: `${DIR}/food-indo-chinese-wok-spread.webp`,
        alt: 'Indo-Chinese noodles and starters',
    },
    kappaMeenCurry: {
        src: `${DIR}/food-kappa-meen-curry.webp`,
        alt: 'Kappa with red fish curry',
    },
    keralaMeals: {
        src: `${DIR}/food-kerala-meals.webp`,
        alt: 'Kerala meal served on a banana leaf',
    },
    seafoodSpread: {
        src: `${DIR}/food-kochi-seafood-spread.webp`,
        alt: 'Kochi seafood spread',
    },
    margherita: {
        src: `${DIR}/food-margherita-pizza.webp`,
        alt: 'Margherita pizza',
    },
    masalaDosa: {
        src: `${DIR}/food-masala-dosa.webp`,
        alt: 'Masala dosa with sambar and chutneys',
        // The dosa runs the width of the frame; a centre crop reads as a blank
        // middle. Biasing left keeps the folded end and the chutneys in shot.
        focus: '35% 50%',
    },
    meenPollichathu: {
        src: `${DIR}/food-meen-pollichathu.webp`,
        alt: 'Meen pollichathu wrapped in banana leaf',
    },
    muttonBiryani: {
        src: `${DIR}/food-mutton-dum-biryani.webp`,
        alt: 'Mutton dum biryani',
    },
    paneerBurger: {
        src: `${DIR}/food-paneer-burger.webp`,
        alt: 'Spicy paneer burger',
    },
    periPeriPizza: {
        src: `${DIR}/food-peri-peri-chicken-pizza.webp`,
        alt: 'Peri peri chicken pizza',
    },
    porottaBeefCurry: {
        src: `${DIR}/food-porotta-beef-curry.webp`,
        alt: 'Kerala porotta with beef curry',
    },
    tiffinSpread: {
        src: `${DIR}/food-south-indian-tiffin-spread.webp`,
        alt: 'South Indian tiffin spread with idli and dosa',
    },
}

/** Cuisine ribbon. Keyed by the seeded cuisine slug. */
const CUISINE_IMAGES = {
    biryani: ASSETS.chickenBiryani,
    kerala: ASSETS.porottaBeefCurry,
    'south-indian': ASSETS.tiffinSpread,
    'north-indian': ASSETS.butterChickenNaan,
    chinese: ASSETS.hakkaNoodles,
    arabian: ASSETS.chickenMandi,
    seafood: ASSETS.meenPollichathu,
    pizza: ASSETS.margherita,
    burgers: ASSETS.chickenBurger,
    healthy: ASSETS.quinoaBowl,
    desserts: ASSETS.belgianChocolateCake,
    beverages: ASSETS.kulukkiSarbath,
}

/**
 * Restaurant identity. Keyed by the seeded slug.
 * Signature dish where one dish *is* the restaurant; a spread where the
 * restaurant's appeal is its range.
 */
const RESTAURANT_IMAGES = {
    'kappa-and-co': ASSETS.kappaMeenCurry,
    'dum-street': ASSETS.muttonBiryani,
    'thattukada-24': ASSETS.porottaBeefCurry,
    amminis: ASSETS.tiffinSpread,
    'al-barakah-grills': ASSETS.chickenMandi,
    'wok-lane': ASSETS.wokSpread,
    'pizza-junction': ASSETS.periPeriPizza,
    'bun-stop': ASSETS.chickenBurger,
    'green-bowl': ASSETS.quinoaBowl,
    'kochi-fish-house': ASSETS.seafoodSpread,
    'cocoa-and-crumb': ASSETS.bakerySpread,
    'kulukki-corner': ASSETS.kulukkiSarbath,
    'noor-mahal': ASSETS.butterChickenNaan,
}

/**
 * Dishes, by exact seeded name.
 *
 * Only exact matches and variants a diner would accept as the same photograph.
 * Everything absent from this map renders without an image on purpose —
 * see the note at the top of the file.
 */
const DISH_IMAGES = {
    // — Biryani. Chicken and red meat are visibly different; kept apart.
    'Chicken Dum Biryani': ASSETS.chickenBiryani,
    'Egg Biryani': ASSETS.chickenBiryani,
    'Mutton Dum Biryani': ASSETS.muttonBiryani,
    'Beef Biryani': ASSETS.muttonBiryani,

    // — Kerala
    'Kappa and Meen Curry': ASSETS.kappaMeenCurry,
    'Porotta and Beef Curry': ASSETS.porottaBeefCurry,
    'Kerala Parotta and Chicken Roast': ASSETS.porottaBeefCurry,
    'Kerala Sadya': ASSETS.keralaMeals,
    'Fish Curry Meal': ASSETS.keralaMeals,
    'Kerala Rice and Sambar': ASSETS.keralaMeals,
    'Meen Pollichathu': ASSETS.meenPollichathu,
    'Karimeen Pollichathu': ASSETS.meenPollichathu,

    // — Dosa. Only the folded, potato-filled ones.
    'Masala Dosa': ASSETS.masalaDosa,
    'Mysore Masala Dosa': ASSETS.masalaDosa,

    // — Arabian
    'Chicken Shawarma Roll': ASSETS.chickenShawarma,
    'Chicken Shawarma Plate': ASSETS.chickenShawarma,
    'Chicken Mandi': ASSETS.chickenMandi,
    'Al Faham Half': ASSETS.alFaham,
    'Shish Tawook': ASSETS.alFaham,
    'Tandoori Chicken Half': ASSETS.alFaham,

    // — Indo-Chinese
    'Chilli Chicken': ASSETS.chilliChicken,
    'Hakka Noodles': ASSETS.hakkaNoodles,
    'Chicken Noodles': ASSETS.hakkaNoodles,
    'Schezwan Noodles': ASSETS.hakkaNoodles,
    'Veg Fried Rice': ASSETS.friedRice,
    'Chicken Fried Rice': ASSETS.friedRice,
    'Mixed Fried Rice': ASSETS.friedRice,

    // — North Indian
    'Butter Chicken': ASSETS.butterChickenNaan,

    // — Pizza
    Margherita: ASSETS.margherita,
    Farmhouse: ASSETS.margherita,
    'Four Cheese': ASSETS.margherita,
    'Peri Peri Chicken': ASSETS.periPeriPizza,
    'Chicken Tikka Pizza': ASSETS.periPeriPizza,

    // — Burgers
    'Classic Chicken Burger': ASSETS.chickenBurger,
    'Double Chicken Burger': ASSETS.chickenBurger,
    'Grilled Chicken Burger': ASSETS.chickenBurger,
    'Spicy Paneer Burger': ASSETS.paneerBurger,

    // — Healthy
    'Grilled Chicken Quinoa Bowl': ASSETS.quinoaBowl,
    'Greek Salad': ASSETS.healthySalad,
    'Caesar Salad': ASSETS.healthySalad,
    'Sprout and Corn Salad': ASSETS.healthySalad,
    Fattoush: ASSETS.healthySalad,

    // — Desserts
    'Belgian Chocolate Slice': ASSETS.belgianChocolateCake,
    'Choco Lava Cake': ASSETS.belgianChocolateCake,

    // — Drinks
    'Kulukki Sarbath': ASSETS.kulukkiSarbath,
}

const EMPTY = { src: null, alt: '', focus: undefined }

const normalise = (asset) => (asset
    ? { src: asset.src, alt: asset.alt, focus: asset.focus }
    : EMPTY)

/** @returns {{src: string|null, alt: string, focus?: string}} */
export const cuisineImage = (slug) => normalise(CUISINE_IMAGES[slug])

export const restaurantImage = (slug) => normalise(RESTAURANT_IMAGES[slug])

/**
 * Dish photography by exact seeded name. Returns { src: null } for dishes we
 * have no honest picture of — the caller renders those text-first.
 */
export const dishImage = (name) => normalise(DISH_IMAGES[name])

export const hasDishImage = (name) => Boolean(DISH_IMAGES[name])
