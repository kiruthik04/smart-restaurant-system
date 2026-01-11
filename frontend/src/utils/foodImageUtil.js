/**
 * Utility to map food names/categories to public high-quality images.
 * Uses Unsplash source URLs for reliability.
 */

const IMAGE_MAP = {
    // Starters
    'soup': 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500',
    'salad': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500',
    'fries': 'https://images.unsplash.com/photo-1573080496982-b9418af17195?w=500',
    'wing': 'https://images.unsplash.com/photo-1527477396000-dc879788d633?w=500',
    'tikka': 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=500',
    'paneer': 'https://images.unsplash.com/photo-1567188040754-01b55fa11475?w=500',

    // Mains
    'burger': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500',
    'pizza': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500',
    'pasta': 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=500',
    'rice': 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500',
    'biryani': 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=500',
    'curry': 'https://images.unsplash.com/photo-1626500135898-842eb3a8db5f?w=500',
    'dal': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500',

    // Drinks
    'cola': 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500',
    'pepsi': 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=500',
    'drink': 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500',
    'coffee': 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500',
    'juice': 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=500',
    'shake': 'https://images.unsplash.com/photo-1579954115545-a95591f28dfc?w=500',

    // Desserts
    'cake': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500',
    'ice': 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=500', // ice cream
    'cream': 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=500',
    'sweet': 'https://images.unsplash.com/photo-1551024601-564d6d67e2b8?w=500',
};

const CATEGORY_DEFAULTS = {
    'starters': 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500',
    'mains': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500',
    'desserts': 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500',
    'drinks': 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=500',
    'others': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500' // General food
};

export const getFoodImage = (name, category) => {
    if (!name) return CATEGORY_DEFAULTS['others'];

    const lowerName = name.toLowerCase();

    // Check specific keywords in name
    for (const [key, url] of Object.entries(IMAGE_MAP)) {
        if (lowerName.includes(key)) {
            return url;
        }
    }

    // Fallback to category default
    if (category && CATEGORY_DEFAULTS[category.toLowerCase()]) {
        return CATEGORY_DEFAULTS[category.toLowerCase()];
    }

    return CATEGORY_DEFAULTS['others'];
};
