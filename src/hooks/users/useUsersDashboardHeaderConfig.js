import useHeaderConfig from '../useHeaderConfig';

/**
 * hook for configuring the searchheader for the users dashboard page
 * shows filter by and sort by buttons for user management
 * 
 * @param {Object} props - props from the dashboard page
 * @returns {Object} header configuration for searchheader component
 */
export const useUsersDashboardHeaderConfig = (props) => {
  const {
    viewMode,
    toggleViewMode,
    searchTerm,
    setSearchTerm,
    getActiveFilters,
    handleClearFilters,
    toggleSkillsFilterModal,
    toggleRoleFilterModal,
    setSortOption,
    toggleCompatibility,
    showCompatibility,
    handleRemoveFilter
  } = props;

  const customButtons = [
    {
      label: "Filter By",
      type: "secondary", 
      icon: "bi-funnel",
      hasDropdown: true,
      isFilterButton: true,
      dropdownItems: [
        { 
          label: 'Role', 
          action: 'role', 
          icon: 'bi-person-badge'
        }
      ],
      onDropdownItemClick: (item) => {
        if (item.action === 'role') {
          toggleRoleFilterModal();
        }
      }
    },
    {
      label: "Sort By",
      type: "secondary",
      icon: "bi-sort-down",
      hasDropdown: true,
      isFilterButton: true,
      dropdownItems: [
        { label: 'Name (A to Z)', value: 'name_asc', icon: 'bi-sort-alpha-down' },
        { label: 'Name (Z to A)', value: 'name_desc', icon: 'bi-sort-alpha-down-alt' },
        { label: 'Email (A to Z)', value: 'email_asc', icon: 'bi-envelope' },
        { label: 'Email (Z to A)', value: 'email_desc', icon: 'bi-envelope-fill' },
        { label: 'Role (A to Z)', value: 'role_asc', icon: 'bi-person-badge' },
        { label: 'Role (Z to A)', value: 'role_desc', icon: 'bi-person-badge-fill' }
      ],
      onDropdownItemClick: (item) => {
        setSortOption(item.value);
      }
    }
  ];

  const filterButtons = [];

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
    placeholder: "Search by Name or Email...",
    searchName: "searchUsers"
  });
};

export default useUsersDashboardHeaderConfig;