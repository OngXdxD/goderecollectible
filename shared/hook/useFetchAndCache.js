import { useState, useEffect } from 'react';
import {
    getVersionForCategory,
    setVersionForCategory,
    getDataForCategory,
    setDataForCategory,
  } from "../helper/cacheHelpers";

// Universal hook for fetching and caching data based on version
const useFetchAndCache = (categories, apiFetchUrl, cachePrefix) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!loading) return;
    // Function to fetch data and manage cache
        const fetchData = async () => {
            setLoading(true);
            try {
                // Step 1: Fetch version from server
                const versionResponse = await fetch(`${apiFetchUrl}/getVersion`);
                const versionData = await versionResponse.json();
                const currentVersion = versionData.version;

                const newData = {};
                let isFetchRequired = false;

                // Check each category independently
                for (const category of categories) {
                    const cachedVersion = getVersionForCategory(category);
                    const cachedData = getDataForCategory(category);
                    if (
                        cachedVersion &&
                        cachedData &&
                        parseInt(cachedVersion, 10) === currentVersion[category]
                    ) {
                        // Use cached data if version matches
                        newData[category] = cachedData;
                    } else {
                        // Fetch fresh data for this category if version doesn't match
                        isFetchRequired = true;
                    }
                }

                if (!isFetchRequired) {
                    setData(newData); // All categories are valid
                    setLoading(false);
                    return;
                }

                // Fetch new data from the API for the invalid categories
                const fetchUrl = `${apiFetchUrl}/fetch?dataNeeded=${categories.join(",")}`;
                const response = await fetch(fetchUrl);
                const fetchedData = await response.json();
                // Update the cache and state for each category
                for (const category of categories) {
                    setDataForCategory(category, fetchedData[category.toLowerCase()]);
                    setVersionForCategory(category, currentVersion[category]);
                    newData[category] = fetchedData[category.toLowerCase()];
                }
                setData(newData);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError(err);
                setLoading(false);
            }
        };

        fetchData();
    }, [categories, apiFetchUrl, cachePrefix]); // Re-run effect when any of these dependencies change

    return { data, loading, error };
};

export default useFetchAndCache;