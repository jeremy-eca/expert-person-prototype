import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsUpDownIcon,
  ColumnsIcon,
  FilterIcon,
  SearchIcon,
  Edit2Icon,
  Trash2Icon,
  PlusIcon,
  XIcon,
  CheckIcon,
  ChevronDownIcon,
} from "lucide-react";
import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../shared/components/ui/avatar";
import { Badge } from "../../shared/components/ui/badge";
import { Button as ShadcnButton } from "../../shared/components/ui/button";
import { Card, CardContent } from "../../shared/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "../../shared/components/ui/pagination";
import { Input } from "../../shared/components/ui/input";
import { Button, TextInput } from '@ecainternational/eca-components';
import { personService } from "../services/api/personService";
import { PersonListItem } from "../types/frontend.types";

export interface ProfilesListFormProps {
  onPersonSelect: (personId: string | null) => void;
  onCreatePerson?: () => void;
  className?: string;
}

export const ProfilesListFormDark: React.FC<ProfilesListFormProps> = ({
  onPersonSelect,
  onCreatePerson,
  className = "",
}) => {
  const [people, setPeople] = useState<PersonListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPeople, setTotalPeople] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showingAll, setShowingAll] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    employmentType: '',
    location: '',
    status: ''
  });
  const filterDropdownRef = useRef<HTMLDivElement>(null);

  const totalPages = Math.ceil(totalPeople / itemsPerPage);

  // Filter options (as a UX designer, I'm choosing intuitive categories)
  const filterOptions = {
    employmentType: [
      { value: '', label: 'All Employment Types' },
      { value: 'full-time', label: 'Full-time' },
      { value: 'contract', label: 'Contract' },
      { value: 'consultant', label: 'Consultant' },
      { value: 'temporary', label: 'Temporary' },
      { value: 'intern', label: 'Intern' }
    ],
    location: [
      { value: '', label: 'All Locations' },
      { value: 'remote', label: 'Remote' },
      { value: 'hybrid', label: 'Hybrid' },
      { value: 'office', label: 'Office' },
      { value: 'london', label: 'London' },
      { value: 'new-york', label: 'New York' },
      { value: 'singapore', label: 'Singapore' },
      { value: 'dubai', label: 'Dubai' }
    ],
    status: [
      { value: '', label: 'All Statuses' },
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
      { value: 'on-leave', label: 'On Leave' },
      { value: 'pending', label: 'Pending' }
    ]
  };

  // Fetch people data
  const fetchPeople = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (showingAll) {
        // Get all people without pagination
        const result = await personService.getAllPersons({ 
          search: searchTerm || undefined,
          employmentType: filters.employmentType || undefined,
          location: filters.location || undefined,
          status: filters.status || undefined
        });
        setPeople(result.persons);
        setTotalPeople(result.total);
      } else {
        // Get paginated results
        const offset = (currentPage - 1) * itemsPerPage;
        const params = {
          limit: itemsPerPage,
          offset,
          search: searchTerm || undefined,
          employmentType: filters.employmentType || undefined,
          location: filters.location || undefined,
          status: filters.status || undefined
        };
        
        const result = await personService.getPersonsList(params);
        setPeople(result.persons);
        setTotalPeople(result.total);
      }
      
    } catch (err: any) {
      console.error('❌ [LIST] Failed to fetch people:', err);
      
      let errorMessage = 'Failed to load people. Please try again.';
      
      if (err.response?.status === 401) {
        errorMessage = 'Authentication failed. Please check your credentials.';
      } else if (err.response?.status === 403) {
        errorMessage = 'Access denied. Insufficient permissions.';
      } else if (err.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (err.code === 'NETWORK_ERROR' || !err.response) {
        errorMessage = 'Network error. Please check your connection.';
      }
      
      setError(errorMessage);
      setPeople([]);
      setTotalPeople(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, searchTerm, showingAll, filters]);

  useEffect(() => {
    fetchPeople();
  }, [fetchPeople]);

  // Click outside to close filter dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
        setShowFilters(false);
      }
    };

    if (showFilters) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFilters]);

  // Handle card click
  const handlePersonClick = (personId: string) => {
    onPersonSelect(personId);
  };

  // Handle add new person
  const handleAddPerson = () => {
    if (onCreatePerson) {
      onCreatePerson();
    } else {
      onPersonSelect(null);
    }
  };

  // Handle delete person
  const handleDeletePerson = async (e: React.MouseEvent, personId: string, personName: string) => {
    e.stopPropagation();
    
    if (confirm(`Are you sure you want to delete ${personName}?`)) {
      try {
        await personService.deletePerson(personId);
        fetchPeople();
      } catch (err) {
        console.error('Failed to delete person:', err);
        alert('Failed to delete person. Please try again.');
      }
    }
  };

  // Handle edit person (from icon)
  const handleEditPerson = (e: React.MouseEvent, personId: string) => {
    e.stopPropagation();
    onPersonSelect(personId);
  };

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };

  // Handle get all people
  const handleGetAllPeople = () => {
    setShowingAll(true);
    setCurrentPage(1);
  };

  // Handle return to paginated view
  const handleReturnToPaginated = () => {
    setShowingAll(false);
    setCurrentPage(1);
  };

  // Handle filter changes
  const handleFilterChange = (filterType: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Clear all filters
  const handleClearFilters = () => {
    setFilters({
      employmentType: '',
      location: '',
      status: ''
    });
    setCurrentPage(1);
  };

  // Check if any filters are active
  const hasActiveFilters = filters.employmentType || filters.location || filters.status;

  // Generate pagination buttons
  const getPaginationButtons = (): (number | string)[] => {
    const buttons: (number | string)[] = [];
    const maxButtons = 5;
    
    if (totalPages <= maxButtons) {
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(i);
      }
    } else {
      if (currentPage <= 3) {
        buttons.push(1, 2, 3, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        buttons.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
      } else {
        buttons.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    
    return buttons;
  };

  return (
    <div className={`flex flex-col gap-8 w-full ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-white">
            People
          </h1>
          <Badge className="bg-[#374151] text-[#9CA3AF] border-0 px-3 py-1">
            {totalPeople} total
          </Badge>
          
          {/* Active Filter Indicators */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2">
              {filters.employmentType && (
                <Badge className="bg-[#3B82F6] text-white border-0 px-2 py-1 text-xs">
                  {filterOptions.employmentType.find(opt => opt.value === filters.employmentType)?.label}
                  <button
                    onClick={() => handleFilterChange('employmentType', '')}
                    className="ml-1 hover:bg-white/20 rounded-full p-0.5"
                  >
                    <XIcon className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {filters.location && (
                <Badge className="bg-[#10B981] text-white border-0 px-2 py-1 text-xs">
                  {filterOptions.location.find(opt => opt.value === filters.location)?.label}
                  <button
                    onClick={() => handleFilterChange('location', '')}
                    className="ml-1 hover:bg-white/20 rounded-full p-0.5"
                  >
                    <XIcon className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {filters.status && (
                <Badge className="bg-[#F59E0B] text-white border-0 px-2 py-1 text-xs">
                  {filterOptions.status.find(opt => opt.value === filters.status)?.label}
                  <button
                    onClick={() => handleFilterChange('status', '')}
                    className="ml-1 hover:bg-white/20 rounded-full p-0.5"
                  >
                    <XIcon className="w-3 h-3" />
                  </button>
                </Badge>
              )}
            </div>
          )}
        </div>

        <Button
          name="new-person-button"
          variant="primary"
          size="medium"
          onClick={handleAddPerson}
          className="flex items-center gap-2 px-6 py-3 bg-[#16A34A] hover:bg-[#15803D] text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl border-0 min-w-[140px]"
        >
          <PlusIcon className="w-5 h-5" />
          New Person
        </Button>
      </div>

      {/* Error display */}
      {error && (
        <div className="w-full p-4 bg-[#7F1D1D]/20 border border-[#B91C1C]/30 rounded-lg">
          <p className="text-sm text-[#FCA5A5]">
            ⚠️ {error}
          </p>
        </div>
      )}

      {/* Search and filter controls */}
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-4">
          <div className="relative w-80">
            <SearchIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B7280] z-10" />
            <TextInput
              id="search-people"
              name="search"
              type="text"
              placeholder="Search people..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              variant="outline"
              className="bg-[#1E2329] border-[#374151] text-white placeholder:text-[#6B7280] pl-10 pr-4 py-3 rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all duration-200 w-full"
            />
          </div>

          {/* Filter Button - Professional UX Design */}
          <div className="relative" ref={filterDropdownRef}>
            <Button
              name="filter-button"
              variant="outline"
              size="medium"
              onClick={() => setShowFilters(!showFilters)}
              className={`${
                hasActiveFilters 
                  ? 'bg-[#3B82F6] border-[#3B82F6] text-white' 
                  : 'bg-[#374151] border-[#4B5563] text-[#9CA3AF] hover:bg-[#4B5563] hover:text-white'
              } px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-2 relative`}
            >
              <FilterIcon className="w-4 h-4" />
              Filter
              {hasActiveFilters && (
                <span className="w-2 h-2 bg-white rounded-full ml-1"></span>
              )}
              <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
            </Button>

            {/* Filter Dropdown - Elegant Design */}
            {showFilters && (
              <div className="absolute top-full left-0 mt-2 w-80 bg-[#1E2329] border border-[#374151] rounded-lg shadow-xl z-50 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold text-sm">Filter People</h3>
                  {hasActiveFilters && (
                    <Button
                      name="clear-filters-button"
                      variant="ghost"
                      size="small"
                      onClick={handleClearFilters}
                      className="text-[#9CA3AF] hover:text-white text-xs px-2 py-1"
                    >
                      Clear All
                    </Button>
                  )}
                </div>

                <div className="space-y-4">
                  {/* Employment Type Filter */}
                  <div>
                    <label className="text-[#9CA3AF] text-xs font-medium uppercase tracking-wide mb-2 block">
                      Employment Type
                    </label>
                    <div className="space-y-1">
                      {filterOptions.employmentType.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handleFilterChange('employmentType', option.value)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 flex items-center justify-between ${
                            filters.employmentType === option.value
                              ? 'bg-[#3B82F6] text-white'
                              : 'text-[#9CA3AF] hover:bg-[#374151] hover:text-white'
                          }`}
                        >
                          {option.label}
                          {filters.employmentType === option.value && (
                            <CheckIcon className="w-4 h-4" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Location Filter */}
                  <div>
                    <label className="text-[#9CA3AF] text-xs font-medium uppercase tracking-wide mb-2 block">
                      Location
                    </label>
                    <div className="space-y-1">
                      {filterOptions.location.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handleFilterChange('location', option.value)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 flex items-center justify-between ${
                            filters.location === option.value
                              ? 'bg-[#3B82F6] text-white'
                              : 'text-[#9CA3AF] hover:bg-[#374151] hover:text-white'
                          }`}
                        >
                          {option.label}
                          {filters.location === option.value && (
                            <CheckIcon className="w-4 h-4" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <label className="text-[#9CA3AF] text-xs font-medium uppercase tracking-wide mb-2 block">
                      Status
                    </label>
                    <div className="space-y-1">
                      {filterOptions.status.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handleFilterChange('status', option.value)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 flex items-center justify-between ${
                            filters.status === option.value
                              ? 'bg-[#3B82F6] text-white'
                              : 'text-[#9CA3AF] hover:bg-[#374151] hover:text-white'
                          }`}
                        >
                          {option.label}
                          {filters.status === option.value && (
                            <CheckIcon className="w-4 h-4" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            name="toggle-view-button"
            variant="outline"
            size="medium"
            onClick={showingAll ? handleReturnToPaginated : handleGetAllPeople}
            className="bg-[#374151] border-[#4B5563] text-[#9CA3AF] hover:bg-[#4B5563] hover:text-white px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-2"
          >
            <span className="text-sm font-medium">
              {showingAll ? 'Show Paged' : 'Get All'}
            </span>
          </Button>
          
          <Button
            name="view-button"
            variant="outline"
            size="medium"
            className="bg-[#374151] border-[#4B5563] text-[#9CA3AF] hover:bg-[#4B5563] hover:text-white px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-2"
          >
            <ColumnsIcon className="w-4 h-4" />
            View
          </Button>
        </div>
      </div>

      {/* People Stack */}
      <div className="w-full">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3B82F6]"></div>
            <p className="text-[#9CA3AF] ml-4">Loading people...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-64">
            <p className="text-[#FCA5A5] mb-4">Something went wrong</p>
            <Button
              name="try-again-button"
              variant="primary"
              size="medium"
              onClick={fetchPeople}
              className="bg-[#3B82F6] hover:bg-[#2563EB] text-white px-4 py-2 rounded-lg"
            >
              Try Again
            </Button>
          </div>
        ) : people.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <p className="text-[#9CA3AF] mb-4">No people found</p>
            {searchTerm && (
              <p className="text-sm text-[#6B7280]">
                Try adjusting your search term "{searchTerm}"
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {people.map((person, index) => (
              <Card
                key={person.id}
                className="bg-[#1E2329] border-[#374151] hover:border-[#4B5563] transition-all duration-200 cursor-pointer hover:shadow-lg"
                onClick={() => handlePersonClick(person.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    {/* Left: Avatar + Name + Job Title */}
                    <div className="flex items-center gap-4 flex-1">
                      <Avatar
                        className="w-12 h-12 ring-2 ring-[#374151]"
                        style={{ backgroundColor: person.avatarBg }}
                      >
                        {person.avatarUrl ? (
                          <AvatarImage
                            src={person.avatarUrl}
                            alt={person.name}
                            className="w-12 h-12"
                          />
                        ) : (
                          <AvatarFallback className="font-bold text-white text-lg bg-transparent">
                            {person.avatarInitials}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className="flex flex-col">
                        <h3 className="text-lg font-semibold text-white">
                          {person.name}
                        </h3>
                        <p className="text-sm text-[#9CA3AF]">
                          {person.jobTitle} • {person.department}
                        </p>
                      </div>
                    </div>

                    {/* Center: Location Info - Better aligned */}
                    <div className="flex items-center justify-between gap-12 flex-1 px-8">
                      <div className="flex flex-col items-start min-w-[140px]">
                        <p className="text-xs font-medium text-[#6B7280] uppercase tracking-wide mb-1">
                          Current Location
                        </p>
                        <p className="text-sm text-white font-medium">
                          {person.currentLocation || '—'}
                        </p>
                      </div>
                      <div className="flex flex-col items-start min-w-[120px]">
                        <p className="text-xs font-medium text-[#6B7280] uppercase tracking-wide mb-1">
                          Home Base
                        </p>
                        <p className="text-sm text-white font-medium">
                          {person.permanentHome || '—'}
                        </p>
                      </div>
                      <div className="flex flex-col items-start min-w-[160px]">
                        <p className="text-xs font-medium text-[#6B7280] uppercase tracking-wide mb-1">
                          Contact
                        </p>
                        <p className="text-sm text-white font-medium">
                          {person.email || person.phone || '—'}
                        </p>
                      </div>
                    </div>

                    {/* Right: Actions Only (Removed Status) */}
                    <div className="flex items-center gap-2 flex-none">
                      <ShadcnButton
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-[#9CA3AF] hover:text-white hover:bg-[#374151] rounded-lg transition-all duration-200"
                        onClick={(e) => handleEditPerson(e, person.id)}
                        title="Edit person"
                      >
                        <Edit2Icon className="h-4 w-4" />
                      </ShadcnButton>
                      <ShadcnButton
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-[#9CA3AF] hover:text-[#FCA5A5] hover:bg-[#7F1D1D]/20 rounded-lg transition-all duration-200"
                        onClick={(e) => handleDeletePerson(e, person.id, person.name)}
                        title="Delete person"
                      >
                        <Trash2Icon className="h-4 w-4" />
                      </ShadcnButton>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPeople > 0 && (
        <div className="flex items-center justify-between w-full">
          {/* Left: Pagination info */}
          <div className="flex items-center gap-4">
            <p className="text-sm text-[#9CA3AF]">
              {showingAll 
                ? `Showing all ${totalPeople} people`
                : `Showing ${((currentPage - 1) * itemsPerPage) + 1} to ${Math.min(currentPage * itemsPerPage, totalPeople)} of ${totalPeople} people`
              }
            </p>
          </div>

          {/* Center: Pagination controls */}
          {!showingAll && totalPages > 1 && (
            <Pagination>
              <PaginationContent className="gap-2">
                <PaginationItem>
                  <ShadcnButton
                    variant="outline"
                    className={`w-10 h-10 bg-[#1E2329] border-[#374151] text-[#9CA3AF] hover:bg-[#374151] hover:text-white rounded-lg transition-all duration-200 ${
                      currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeftIcon className="w-4 h-4" />
                  </ShadcnButton>
                </PaginationItem>
                
                {getPaginationButtons().map((page, index) => (
                  <PaginationItem key={index}>
                    {page === '...' ? (
                      <ShadcnButton
                        variant="outline"
                        className="w-10 h-10 bg-[#1E2329] border-[#374151] text-[#6B7280] rounded-lg"
                        disabled
                      >
                        <span className="text-sm">...</span>
                      </ShadcnButton>
                    ) : (
                      <ShadcnButton
                        variant={page === currentPage ? "default" : "outline"}
                        className={`w-10 h-10 rounded-lg border transition-all duration-200 ${
                          page === currentPage 
                            ? 'bg-[#3B82F6] border-[#3B82F6] text-white shadow-lg' 
                            : 'bg-[#1E2329] border-[#374151] text-[#9CA3AF] hover:bg-[#374151] hover:text-white'
                        }`}
                        onClick={() => handlePageChange(page as number)}
                      >
                        <span className="text-sm font-medium">
                          {page}
                        </span>
                      </ShadcnButton>
                    )}
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <ShadcnButton
                    variant="outline"
                    className={`w-10 h-10 bg-[#1E2329] border-[#374151] text-[#9CA3AF] hover:bg-[#374151] hover:text-white rounded-lg transition-all duration-200 ${
                      currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRightIcon className="w-4 h-4" />
                  </ShadcnButton>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}

          {/* Right: Items per page */}
          {!showingAll && (
            <Button
              name="items-per-page-button"
              variant="outline"
              size="medium"
              onClick={() => {
                const newValue = itemsPerPage === 10 ? 25 : itemsPerPage === 25 ? 50 : 10;
                handleItemsPerPageChange(newValue);
              }}
              className="bg-[#1E2329] border-[#374151] text-[#9CA3AF] hover:bg-[#374151] hover:text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2"
            >
              <span className="text-sm font-medium">
                {itemsPerPage} per page
              </span>
              <ChevronsUpDownIcon className="w-4 h-4" />
            </Button>
          )}
          
          {/* When showing all, show a helpful message */}
          {showingAll && (
            <div className="text-sm text-[#6B7280]">
              All records displayed
            </div>
          )}
        </div>
      )}
    </div>
  );
};