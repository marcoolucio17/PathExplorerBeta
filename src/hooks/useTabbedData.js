import { useState, useEffect, useMemo } from 'react';

/**
 * Custom hook for managing tabbed data with counts
 * @param {Array} data - The complete data array
 * @param {Object} options - Configuration options for tabs
 * @returns {Object} - Tab state and filtered data
 */
const useTabbedData = (data = [], options = {}) => {
  const { defaultTab = "Pending", tabNameField = "status", singleTab = false } = options;
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [tabCounts, setTabCounts] = useState({});

  // Get unique tab names from data
  const tabNames = useMemo(() => {
    if (singleTab) {
      return [defaultTab];
    }
    
    if (!data || data.length === 0) {
      return ["Pending", "In Review", "Accepted", "Denied"];
    }

    const uniqueTabs = [...new Set(data.map((item) => item[tabNameField]))];
    return uniqueTabs.length > 0
      ? uniqueTabs
      : ["Pending", "In Review", "Accepted", "Denied"];
  }, [data, tabNameField, singleTab, defaultTab]);

  // Apply filters based on active tab
  const filteredData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    if (singleTab) {
      return data;
    }
    
    return data.filter((item) => item[tabNameField] === activeTab);
  }, [data, activeTab, tabNameField, singleTab]);

  const handleTabChange = (tab) => {
    if (tab !== activeTab) {
      setActiveTab(tab);
    }
  };

  return {
    activeTab,
    setActiveTab: handleTabChange,
    tabCounts,
    filteredData,
    tabNames,
  };
};

export default useTabbedData;