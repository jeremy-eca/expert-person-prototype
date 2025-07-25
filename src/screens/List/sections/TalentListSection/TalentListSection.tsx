import {
  BellIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsUpDownIcon,
  ColumnsIcon,
  FilterIcon,
  SearchIcon,
  SettingsIcon,
  Edit2Icon,
  Trash2Icon,
  PlusIcon,
} from "lucide-react";
import React, { useEffect, useState, useCallback } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../../components/ui/avatar";
import { Badge } from "../../../../components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "../../../../components/ui/breadcrumb";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "../../../../components/ui/pagination";
import { Input } from "../../../../components/ui/input";
import { personService } from "../../../../services/api/personService";
import { PersonListItem } from "../../../../types/frontend.types";

interface TalentListSectionProps {
  onPersonSelect: (personId: string | null) => void;
}

export const TalentListSection = ({ onPersonSelect }: TalentListSectionProps): JSX.Element => {
  const [people, setPeople] = useState<PersonListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPeople, setTotalPeople] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const totalPages = Math.ceil(totalPeople / itemsPerPage);

  // Fetch people data
  const fetchPeople = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const offset = (currentPage - 1) * itemsPerPage;
      const result = await personService.getPersonsList({
        limit: itemsPerPage,
        offset,
        search: searchTerm || undefined
      });

      // Data is already mapped to PersonListItem format by the service
      setPeople(result.persons);
      setTotalPeople(result.total);
    } catch (err) {
      console.error('Failed to fetch people:', err);
      setError('Failed to load people. Please check your connection and try again.');
      // Clear data on error
      setPeople([]);
      setTotalPeople(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, searchTerm]);

  useEffect(() => {
    fetchPeople();
  }, [fetchPeople]);

  // Handle row click
  const handleRowClick = (personId: string) => {
    onPersonSelect(personId);
  };

  // Handle add new person
  const handleAddPerson = () => {
    onPersonSelect(null); // Pass null to indicate new person
  };

  // Handle delete person
  const handleDeletePerson = async (e: React.MouseEvent, personId: string, personName: string) => {
    e.stopPropagation(); // Prevent row click
    
    if (confirm(`Are you sure you want to delete ${personName}?`)) {
      try {
        await personService.deletePerson(personId);
        // Refresh the list
        fetchPeople();
      } catch (err) {
        console.error('Failed to delete person:', err);
        alert('Failed to delete person. Please try again.');
      }
    }
  };

  // Handle edit person (from icon)
  const handleEditPerson = (e: React.MouseEvent, personId: string) => {
    e.stopPropagation(); // Prevent row click
    onPersonSelect(personId);
  };

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page on new search
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1); // Reset to first page
  };

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
    <section className="gap-8 p-6 flex-1 grow flex flex-col items-start relative self-stretch">
      {/* Header with breadcrumbs and user controls */}
      <header className="flex items-center gap-2.5 relative self-stretch w-full flex-[0_0_auto]">
        <div className="flex w-[369px] items-center gap-1 px-1 py-0 relative self-stretch">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  href="#"
                  className="font-label-xs-mid text-[#637684]"
                >
                  Moves
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRightIcon className="w-3 h-3 text-[#637684]" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink
                  href="#"
                  className="font-label-xs-mid text-[#637684]"
                >
                  People
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="relative w-[68px] h-[17px]" />
        </div>

        <div className="flex items-center justify-end gap-8 relative flex-1 grow">
          <Button
            onClick={handleAddPerson}
            className="gap-2"
          >
            <PlusIcon className="w-4 h-4" />
            New Person
          </Button>
          
          <div className="flex gap-6">
            <Button
              variant="ghost"
              size="icon"
              className="w-10 h-10 rounded-md"
            >
              <SettingsIcon className="w-6 h-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-10 h-10 rounded-md"
            >
              <BellIcon className="w-6 h-6" />
            </Button>
          </div>

          <Button
            variant="secondary"
            className="h-10 gap-2.5 px-3 py-1.5 bg-[#eaecf5] rounded-md"
          >
            <div className="relative w-4 h-4 bg-[url(/fi-rr-confetti.svg)] bg-[100%_100%]" />
            <span className="font-label-sm-lighter text-[#252e38]">Ask AI</span>
          </Button>

          <Avatar className="w-10 h-10 bg-[#00ceba] rounded-[100px]">
            <AvatarFallback className="font-extrabold text-[#2e3943] text-sm tracking-[0.28px]">
              GM
            </AvatarFallback>
          </Avatar>
        </div>
      </header>

      {/* Main content section */}
      <div className="flex flex-col items-start gap-6 relative self-stretch w-full flex-[0_0_auto]">
        {/* Title and add button */}
        <div className="flex items-start gap-8 relative self-stretch w-full flex-[0_0_auto]">
          <div className="flex items-center gap-2.5 relative flex-1 self-stretch grow">
            <h1 className="flex-1 font-normal text-2xl">
              <span className="font-semibold text-[#1d252d] leading-[33.6px]">
                People{" "}
              </span>
              <span className="font-light text-[#9ba9b8] leading-[33.6px]">
                {totalPeople}
              </span>
            </h1>
          </div>

          <div className="inline-flex items-start relative flex-[0_0_auto]">
            <Button
              variant="outline"
              className="h-[46px] gap-2 p-1 rounded-[6px_0px_0px_6px] border-[#252e38]"
              onClick={handleAddPerson}
            >
              <span className="flex items-center gap-2 p-3">
                <span className="w-3.5 h-3.5">+</span>
                <span className="font-label-sm-mid text-[#252e38]">Add</span>
              </span>
            </Button>
            <Button
              variant="outline"
              className="h-[46px] p-1 rounded-[0px_6px_6px_0px] border-[#252e38]"
            >
              <ChevronDownIcon className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {/* API Status Banner */}
        {!loading && !error && people.length > 0 && (
          <div className="w-full p-3 bg-green-50 border border-green-200 rounded-lg mb-4">
            <p className="text-sm text-green-800">
              ✅ Connected to Expert Persons List API - Showing {totalPeople} real persons with employment details
            </p>
            <p className="text-xs text-green-700 mt-1">
              Using optimized /persons/list endpoint • Click any person to edit • Click "Add" button to create new person
            </p>
          </div>
        )}
        
        {error && (
          <div className="w-full p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
            <p className="text-sm text-red-800">
              ❌ {error}
            </p>
          </div>
        )}
        

        {/* Search and filter controls */}
        <div className="flex h-10 items-start justify-between relative self-stretch w-full">
          <div className="inline-flex items-center gap-6 relative flex-[0_0_auto]">
            <div className="inline-flex items-center gap-2 relative flex-[0_0_auto]">
              <div className="flex w-[316px] items-center gap-4 px-4 py-2.5 relative bg-[#eef0f6] rounded-lg">
                <SearchIcon className="w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search talent"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="border-0 bg-transparent p-0 font-paragraph-sm-mid text-[#252e38] placeholder:text-[#9ba9b8] focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>

              <Button
                variant="secondary"
                size="icon"
                className="p-3 bg-[#eef0f6] rounded-lg"
              >
                <FilterIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 relative flex-[0_0_auto]">
            <Button
              variant="outline"
              className="h-10 gap-3 p-3 bg-white border-[#d9e3ec] rounded-lg"
            >
              <ColumnsIcon className="w-4 h-4" />
              <Badge className="bg-[#02add2] rounded-md">
                <span className="font-label-xs-mid text-[#252e38]">16</span>
              </Badge>
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="p-3 bg-white border-[#d9e3ec] rounded-lg"
            >
              <ChevronRightIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Table section */}
        <Card className="w-full rounded-lg">
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">Loading people...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-64">
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={fetchPeople}>Try Again</Button>
              </div>
            ) : people.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64">
                <p className="text-gray-600 mb-4">No people found</p>
                {searchTerm && (
                  <p className="text-sm text-gray-500">
                    Try adjusting your search term "{searchTerm}"
                  </p>
                )}
              </div>
            ) : (
              <div className="flex">
                {/* Name column */}
                <div className="flex flex-col w-[315px] border-r border-[#c8d3de]">
                  <div className="flex h-10 items-center px-3 py-0">
                    <span className="font-label-sm-heavier text-[#9ba9b8]">
                      Name
                    </span>
                  </div>

                  <div className="flex flex-col">
                    {people.map((person, index) => (
                      <div
                        key={person.id}
                        className={`flex items-center gap-2 p-3 border-b border-[#d9e3ec] cursor-pointer transition-colors hover:bg-blue-50 ${
                          index % 2 === 0 ? 'bg-white' : 'bg-[#f7fbfe]'
                        }`}
                        onClick={() => handleRowClick(person.id)}
                      >
                        <div className="flex items-center gap-3 w-[291px]">
                          <Avatar
                            className={`w-10 h-10 rounded-[30px]`}
                            style={{ backgroundColor: person.avatarBg }}
                          >
                            {person.avatarUrl ? (
                              <AvatarImage
                                src={person.avatarUrl}
                                alt={person.name}
                                className="w-10 h-10"
                              />
                            ) : (
                              <AvatarFallback className="font-bold text-white text-base">
                                {person.avatarInitials}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div className="flex flex-col h-10 items-start flex-1 grow">
                            <span className="font-label-md-heavier text-[#1d252d]">
                              {person.name}
                            </span>
                            <span className="font-label-xs-mid text-[#7d8c96]">
                              {person.jobTitle}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Data columns */}
                <div className="flex-1 grow overflow-x-auto">
                  <div className="min-w-[845px]">
                    {/* Table header */}
                    <div className="flex items-start gap-2 pl-3 pr-0 py-0">
                      <div className="w-[90px] justify-center flex items-center px-3 py-0 h-10">
                        <span className="font-label-sm-heavier text-[#9ba9b8]">
                          ID
                        </span>
                      </div>
                      <div className="w-40 justify-center flex items-center px-3 py-0 h-10">
                        <span className="font-label-sm-heavier text-[#9ba9b8]">
                          Department
                        </span>
                      </div>
                      <div className="w-40 justify-center flex items-center px-3 py-0 h-10">
                        <span className="font-label-sm-heavier text-[#9ba9b8]">
                          Current location
                        </span>
                      </div>
                      <div className="w-40 justify-center flex items-center px-3 py-0 h-10">
                        <span className="font-label-sm-heavier text-[#9ba9b8]">
                          Permanent home
                        </span>
                      </div>
                      <div className="w-[190px] flex items-center justify-center px-3 py-0 h-10">
                        <span className="font-label-sm-heavier text-[#9ba9b8]">
                          Status
                        </span>
                      </div>
                      <div className="w-[180px] flex items-center justify-center px-3 py-0 h-10">
                        <span className="font-label-sm-heavier text-[#9ba9b8]">
                          Email
                        </span>
                      </div>
                      <div className="w-[190px] flex items-center justify-center px-3 py-0 h-10">
                        <span className="font-medium text-[#6d7780] text-sm tracking-[0.28px]">
                          Personal Email
                        </span>
                      </div>
                      <div className="w-[180px] flex items-center justify-center px-3 py-0 h-10">
                        <span className="font-medium text-[#6d7780] text-sm tracking-[0.28px]">
                          Phone
                        </span>
                      </div>
                      <div className="w-[120px] flex items-center justify-center px-3 py-0 h-10">
                        <span className="font-medium text-[#6d7780] text-sm tracking-[0.28px]">
                          Actions
                        </span>
                      </div>
                    </div>

                    {/* Table rows */}
                    {people.map((person, index) => (
                      <div
                        key={person.id}
                        className={`flex items-center h-16 border-b border-[#d9e3ec] ${
                          index % 2 === 0 ? 'bg-white' : 'bg-[#f7fbfe]'
                        }`}
                      >
                        <div className="w-[90px] justify-center flex items-center px-3 py-0">
                          <span className="font-paragraph-sm-mid text-[#252e38]">
                            {person.id.substring(0, 6)}
                          </span>
                        </div>
                        <div className="w-40 justify-center flex items-center px-3 py-0">
                          <span className="font-paragraph-sm-mid text-[#252e38]">
                            {person.department}
                          </span>
                        </div>
                        <div className="w-40 justify-center flex items-center px-3 py-0">
                          <span className="font-paragraph-sm-mid text-[#252e38]">
                            {person.currentLocation}
                          </span>
                        </div>
                        <div className="w-40 justify-center flex items-center px-3 py-0">
                          <span className="font-paragraph-sm-mid text-[#252e38]">
                            {person.permanentHome}
                          </span>
                        </div>
                        <div className="w-[180px] flex items-center px-3 py-0">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-3 h-3 rounded-md`}
                              style={{ backgroundColor: person.status.color }}
                            />
                            <span className="font-paragraph-sm-heavier text-[#40505c]">
                              {person.status.label}
                            </span>
                          </div>
                        </div>
                        <div className="w-[190px] flex items-center justify-center px-3 py-0">
                          <span className="font-paragraph-sm-mid text-[#252e38]">
                            {person.email}
                          </span>
                        </div>
                        <div className="w-[190px] flex items-center justify-center px-3 py-0">
                          <span className="font-paragraph-sm-mid text-[#252e38]">
                            {person.personalEmail}
                          </span>
                        </div>
                        <div className="w-[180px] flex items-center justify-center px-3 py-0">
                          <span className="font-paragraph-sm-mid text-[#252e38]">
                            {person.phone || '–'}
                          </span>
                        </div>
                        <div className="w-[120px] flex items-center justify-center px-3 py-0 gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => handleEditPerson(e, person.id)}
                            title="Edit"
                          >
                            <Edit2Icon className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={(e) => handleDeletePerson(e, person.id, person.name)}
                            title="Delete"
                          >
                            <Trash2Icon className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Progress bar */}
            <div className="flex flex-col items-start gap-2.5 px-0 py-4 w-full">
              <div className="relative self-stretch w-full h-2 bg-[#f2f5ff] rounded-[10px]">
                <div 
                  className="h-2 bg-[#c8d3de] rounded-[10px] transition-all duration-300"
                  style={{ width: `${(currentPage / totalPages) * 100}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pagination */}
        <div className="flex items-start justify-between relative self-stretch w-full">
          <Pagination>
            <PaginationContent className="gap-3">
              <PaginationItem>
                <Button
                  variant="outline"
                  className={`w-10 h-10 bg-[#f7fbfe] border-[#637684] rounded ${
                    currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeftIcon className="w-4 h-4 text-[#637684]" />
                </Button>
              </PaginationItem>
              
              {getPaginationButtons().map((page, index) => (
                <PaginationItem key={index}>
                  {page === '...' ? (
                    <Button
                      variant="outline"
                      className="w-10 h-10 bg-[#f7fbfe] border-[#637684] rounded"
                      disabled
                    >
                      <span className="text-[#637684] font-bold text-sm">...</span>
                    </Button>
                  ) : (
                    <Button
                      variant={page === currentPage ? "default" : "outline"}
                      className={`w-10 h-10 rounded border ${
                        page === currentPage 
                          ? 'bg-[#02add2] border-[#02add2]' 
                          : 'bg-[#f7fbfe] border-[#637684]'
                      }`}
                      onClick={() => handlePageChange(page as number)}
                    >
                      <span className={`font-bold text-sm ${
                        page === currentPage ? 'text-white' : 'text-[#637684]'
                      }`}>
                        {page}
                      </span>
                    </Button>
                  )}
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <Button
                  variant="outline"
                  className={`w-10 h-10 bg-[#f7fbfe] border-[#637684] rounded ${
                    currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRightIcon className="w-5 h-5 text-[#637684]" />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>

          <Button
            variant="secondary"
            className="inline-flex items-center gap-2 p-3 bg-[#eef0f6] rounded-lg"
            onClick={() => {
              const newValue = itemsPerPage === 10 ? 25 : itemsPerPage === 25 ? 50 : 10;
              handleItemsPerPageChange(newValue);
            }}
          >
            <span className="font-medium text-[#637684] text-sm tracking-[0.28px]">
              {itemsPerPage} per page
            </span>
            <ChevronsUpDownIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

