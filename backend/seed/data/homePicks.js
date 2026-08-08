/**
 * What MORO promotes on the home page.
 *
 * "Popular right now" is a merchandising decision, not a statistic. Deriving it
 * from the popular/bestseller flags alone surfaces a scattershot list — several
 * of them dishes the product has no photograph of, which makes the flagship
 * rail look thin.
 *
 * So the rail is curated. Every entry below is a real seeded dish that is
 * already flagged popular or bestseller at its restaurant, and that has
 * accurate photography. Between them they cover all twelve cuisines.
 *
 * Names and slugs must match the seed exactly; anything that doesn't resolve is
 * skipped, and if none resolve the home controller falls back to the flags.
 */
export const homePicks = [
    { restaurant: 'dum-street', dish: 'Chicken Dum Biryani' },        // Biryani
    { restaurant: 'kappa-and-co', dish: 'Kappa and Meen Curry' },     // Kerala
    { restaurant: 'al-barakah-grills', dish: 'Chicken Mandi' },       // Arabian
    { restaurant: 'kochi-fish-house', dish: 'Meen Pollichathu' },     // Seafood
    { restaurant: 'amminis', dish: 'Mysore Masala Dosa' },            // South Indian
    { restaurant: 'wok-lane', dish: 'Chilli Chicken' },               // Chinese
    { restaurant: 'pizza-junction', dish: 'Peri Peri Chicken' },      // Pizza
    { restaurant: 'bun-stop', dish: 'Classic Chicken Burger' },       // Burgers
    { restaurant: 'green-bowl', dish: 'Grilled Chicken Quinoa Bowl' },// Healthy
    { restaurant: 'noor-mahal', dish: 'Butter Chicken' },             // North Indian
    { restaurant: 'cocoa-and-crumb', dish: 'Belgian Chocolate Slice' },// Desserts
    { restaurant: 'kulukki-corner', dish: 'Kulukki Sarbath' },        // Beverages
]
