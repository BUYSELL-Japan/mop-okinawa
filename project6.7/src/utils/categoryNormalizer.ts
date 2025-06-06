import { Location } from '../types/location';

const CATEGORY_MAPPING = {
  "1": {
    name: "Tourist Attractions",
    id: "1"
  },
  "2": {
    name: "Activity",
    id: "2"
  },
  "3": {
    name: "Hotels",
    id: "3"
  },
  "4": {
    name: "Restaurant",
    id: "4"
  },
  "5": {
    name: "Beaches",
    id: "5"
  },
  "6": {
    name: "Hospitals",
    id: "6"
  },
  "9": {
    name: "Naha Airport",
    id: "9"
  }
};

export const normalizeCategory = (location: Location): Location => {
  // Try to find category from various possible locations in the data structure
  let categoryId = "1"; // Default category

  // Check original_data first
  if (location.properties.original_data?.category) {
    categoryId = location.properties.original_data.category;
  }
  // Then check direct category property
  else if (location.properties.category) {
    const category = location.properties.category.toString();
    if (Object.keys(CATEGORY_MAPPING).includes(category)) {
      categoryId = category;
    }
  }

  const mappedCategory = CATEGORY_MAPPING[categoryId as keyof typeof CATEGORY_MAPPING] || CATEGORY_MAPPING["1"];

  // Get the photo URL from various possible fields
  const photoUrl = location.properties.photo_url || 
                  location.properties.pic || 
                  location.properties.image_url || 
                  location.properties.image;

  return {
    ...location,
    properties: {
      ...location.properties,
      category: mappedCategory.name,
      category_id: mappedCategory.id,
      pic: photoUrl // Normalize photo URL field
    }
  };
};