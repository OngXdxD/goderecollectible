// Store version for a specific category
export const setVersionForCategory = (category, version) => {
  localStorage.setItem(`dropdownVersion_${category}`, version);
};

// Get the cached version for a specific category
export const getVersionForCategory = (category) => {
  return localStorage.getItem(`dropdownVersion_${category}`);
};

export const setDataForCategory = (category, data) => {
  try {
    const stringifiedData = JSON.stringify(data);
    localStorage.setItem(`dropdownData_${category}`, stringifiedData);
  } catch (error) {
    console.error(`Error stringifying data for category ${category}:`, error);
  }
};

export const getDataForCategory = (category) => {
  try {
    const cachedData = localStorage.getItem(`dropdownData_${category}`);
    return cachedData ? JSON.parse(cachedData) : null;
  } catch (error) {
    console.error(`Error parsing data for category ${category}:`, error);
    localStorage.removeItem(`dropdownData_${category}`);
    return null;
  }
};