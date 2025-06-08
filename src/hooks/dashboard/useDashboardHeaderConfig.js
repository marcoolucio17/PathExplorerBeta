import useHeaderConfig from '../useHeaderConfig';

/**
 * Hook for configuring the SearchHeader for the Dashboard page
 * 
 * @param {Object} props - Props from the dashboard page
 * @returns {Object} Header configuration for SearchHeader component
 */
export const useDashboardHeaderConfig = (props) => {
  const {
    viewMode,
    toggleViewMode,
    searchTerm,
    setSearchTerm,
    getActiveFilters,
    handleClearFilters,
    toggleSkillsFilterModal,
    toggleClientsFilterModal,
    toggleRolesFilterModal,
    setSortOption,
    toggleCompatibility,
    showCompatibility,
    handleViewApplicants,
    handleRemoveFilter,
    activeTab //add activeTab to check current tab
  } = props;

  const customButtons = [
    {
      label: "View Applicants",
      type: "primary",
      icon: "bi-people-fill",
      onClick: handleViewApplicants,
    },
    {
      label: "Filter By",
      type: "secondary",
      icon: "bi-funnel",
      hasDropdown: true,
      isFilterButton: true,
      dropdownItems: [
        {
          label: "Skills",
          action: "skills",
          icon: "bi-tools",
        },
        {
          label: "Clients",
          action: "clients",
          icon: "bi bi-person-circle",
        },
        {
          label: "Roles",
          action: "roles",
          icon: "bi bi-person-workspace",
        },
      ],
      onDropdownItemClick: (item) => {
        if (item.action === "skills") {
          toggleSkillsFilterModal();
        } else if (item.action === "clients") {
          toggleClientsFilterModal();
        } else if (item.action === "roles") {
          toggleRolesFilterModal();
        }
      },
    },
    {
      label: "Sort By",
      type: "secondary",
      icon: "bi-sort-down",
      hasDropdown: true,
      isFilterButton: true,
      dropdownItems: [
        {
          label: "Name (A to Z)",
          value: "name_asc",
          icon: "bi-sort-alpha-down",
        },
        {
          label: "Name (Z to A)",
          value: "name_desc",
          icon: "bi-sort-alpha-down-alt",
        },
        { label: "Newest First", value: "date_desc", icon: "bi-calendar-date" },
        { label: "Oldest First", value: "date_asc", icon: "bi-calendar2-date" },
      ],
      onDropdownItemClick: (item) => {
        setSortOption(item.value);
      },
    },
  ];

  const filterButtons = [];

  //only show compatibility button if not on my projects tab
  if (activeTab !== "My Projects") {
    filterButtons.push({
      label: "Compatibility",
      onClick: () => {
        toggleCompatibility();
        setSortOption("compatibility");
      },
      type: "primary",
      variant: "compatibility",
      isActive: showCompatibility,
      value: "compatibility",
    });
  }

  return useHeaderConfig({
    viewMode,
    toggleViewMode,
    searchTerm,
    setSearchTerm,
    activeFilters: getActiveFilters(),
    onRemoveFilter: handleRemoveFilter,
    onClearFilters: handleClearFilters,
    customButtons,
    filterButtons,
    setSortOption,
    placeholder: "Search by Name...",
    searchName: "searchProjects",
  });
};

export default useDashboardHeaderConfig;
