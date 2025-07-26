import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import { Textarea } from "../../../../components/ui/textarea";
import { Badge } from "../../../../components/ui/badge";
import { LanguageEditor } from "../../../../components/ui/language-editor";
import { SaveIcon, XIcon, CameraIcon, UserIcon, SearchIcon, MapPinIcon, PlusIcon, CheckIcon, Edit2Icon, Trash2Icon, BriefcaseIcon, CalendarIcon, BuildingIcon, MapIcon, UsersIcon } from "lucide-react";
import { ProfileSectionType } from "../../AltRightPanel";
import { PersonProfile, LanguageSkill } from "../../../../types/frontend.types";

interface ProfileSectionProps {
  activeSection: ProfileSectionType;
  profile: PersonProfile;
  onProfileUpdate: (profile: PersonProfile) => void;
}

export const ProfileSection = ({ 
  activeSection, 
  profile,
  onProfileUpdate 
}: ProfileSectionProps): JSX.Element => {
  // SVG data URI for map grid pattern
  const gridPatternSvg = "data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='10' height='10' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 10 0 L 0 0 0 10' fill='none' stroke='white' stroke-width='0.5' opacity='0.3'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100' height='100' fill='url(%23grid)' /%3E%3C/svg%3E";

  // Edit states for different cards
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingCurrentLocation, setIsEditingCurrentLocation] = useState(false);
  const [isEditingAssignment, setIsEditingAssignment] = useState(false);
  const [isEditingPermanentHome, setIsEditingPermanentHome] = useState(false);
  const [isEditingPhoto, setIsEditingPhoto] = useState(false);
  const [isEditingCurrentAddress, setIsEditingCurrentAddress] = useState(false);
  const [isEditingPermanentAddress, setIsEditingPermanentAddress] = useState(false);
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAddress, setNewAddress] = useState({
    type: 'current' as 'current' | 'permanent' | 'other',
    name: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    postcode: '',
    country: '',
    setAsCurrent: false
  });
  const [useGoogleLookup, setUseGoogleLookup] = useState(true);
  const [googleSearchTerm, setGoogleSearchTerm] = useState('');
  const [googleSuggestions, setGoogleSuggestions] = useState<any[]>([]);
  const [showGoogleSuggestions, setShowGoogleSuggestions] = useState(false);
  const [editingContact, setEditingContact] = useState(false);
  const [editingEmergencyContact, setEditingEmergencyContact] = useState(false);
  const [isEditingDetails, setIsEditingDetails] = useState(false);

  // Temporary edit values
  const [editBio, setEditBio] = useState(profile.bio || "");
  const [editNationalities, setEditNationalities] = useState(profile.nationalities?.join(", ") || "");
  const [editFirstName, setEditFirstName] = useState(profile.name.split(" ")[0] || "");
  const [editLastName, setEditLastName] = useState(profile.name.split(" ").slice(1).join(" ") || "");
  const [editDateOfBirth, setEditDateOfBirth] = useState(profile.dateOfBirth || "");
  
  // Contact form states
  const [contactForm, setContactForm] = useState({
    workEmail: profile?.contact?.workEmail || '',
    personalEmail: profile?.contact?.personalEmail || '',
    workPhone: profile?.contact?.workPhone || '',
    mobilePhone: profile?.contact?.mobilePhone || ''
  });

  const [emergencyContactForm, setEmergencyContactForm] = useState({
    name: profile?.emergencyContact?.name || '',
    relationship: profile?.emergencyContact?.relationship || '',
    phone: profile?.emergencyContact?.phone || '',
    alternativePhone: '',
    email: ''
  });
  
  // Address edit states
  const [editCurrentAddress, setEditCurrentAddress] = useState({
    line1: profile.currentLocation?.address.split(", ")[0] || "",
    line2: "",
    city: "Barcelona",
    state: "Catalonia", 
    postcode: "08013",
    country: "Spain"
  });
  
  const [editPermanentAddress, setEditPermanentAddress] = useState({
    line1: "1234 Market Street",
    line2: "Unit 567",
    city: "San Francisco",
    state: "California",
    postcode: "94102", 
    country: "United States"
  });



  // Handle saving new address
  const handleSaveNewAddress = () => {
    if (!newAddress.line1 || !newAddress.city || !newAddress.state || !newAddress.postcode || !newAddress.country) {
      return; // Don't save if required fields are missing
    }

    const addressToAdd = {
      id: `addr_${Date.now()}`,
      name: newAddress.name || undefined,
      line1: newAddress.line1,
      line2: newAddress.line2 || undefined,
      city: newAddress.city,
      state: newAddress.state,
      postcode: newAddress.postcode,
      country: newAddress.country,
      startDate: new Date().toISOString().split('T')[0],
      duration: 'Just added'
    };

    // Update profile based on address type
    const updatedProfile = { ...profile };

    if (newAddress.type === 'current' || (newAddress.type === 'other' && newAddress.setAsCurrent)) {
      // Set as current location
      updatedProfile.currentLocation = {
        address: `${addressToAdd.line1}${addressToAdd.line2 ? ', ' + addressToAdd.line2 : ''}, ${addressToAdd.city}, ${addressToAdd.state} ${addressToAdd.postcode}, ${addressToAdd.country}`,
        startDate: addressToAdd.startDate,
        duration: addressToAdd.duration
      };

      // Add to location history
      if (!updatedProfile.locationHistory) {
        updatedProfile.locationHistory = [];
      }
      updatedProfile.locationHistory.unshift({
        date: new Date().toLocaleDateString(),
        location: `${addressToAdd.city}, ${addressToAdd.country}`,
        change: 'Moved to'
      });
    } else if (newAddress.type === 'permanent') {
      // Set as permanent home
      updatedProfile.permanentHome = {
        address: `${addressToAdd.line1}${addressToAdd.line2 ? ', ' + addressToAdd.line2 : ''}, ${addressToAdd.city}, ${addressToAdd.state} ${addressToAdd.postcode}, ${addressToAdd.country}`,
        propertyType: 'Owned' // Default value
      };
    } else {
      // Add as additional address (for future use)
      if (!updatedProfile.locationHistory) {
        updatedProfile.locationHistory = [];
      }
      updatedProfile.locationHistory.unshift({
        date: new Date().toLocaleDateString(),
        location: `${addressToAdd.city}, ${addressToAdd.country}`,
        change: `Added ${newAddress.name || 'address'}`
      });
    }

    // Update the profile
    onProfileUpdate?.(updatedProfile);

    // Reset form and close modal
    setNewAddress({
      type: 'current',
      name: '',
      line1: '',
      line2: '',
      city: '',
      state: '',
      postcode: '',
      country: '',
      setAsCurrent: false
    });
    setGoogleSearchTerm('');
    setGoogleSuggestions([]);
    setShowGoogleSuggestions(false);
    setShowAddModal(false);
  };

  // Mock Google Places API search
  const searchGooglePlaces = (query: string) => {
    if (!query.trim()) {
      setGoogleSuggestions([]);
      setShowGoogleSuggestions(false);
      return;
    }

    // Mock suggestions based on query
    const mockSuggestions = [
      {
        place_id: `${query}_1`,
        description: `${query}, Barcelona, Spain`,
        structured_formatting: {
          main_text: query,
          secondary_text: "Barcelona, Spain"
        }
      },
      {
        place_id: `${query}_2`,
        description: `${query}, Madrid, Spain`,
        structured_formatting: {
          main_text: query,
          secondary_text: "Madrid, Spain"
        }
      },
      {
        place_id: `${query}_3`,
        description: `${query}, Valencia, Spain`,
        structured_formatting: {
          main_text: query,
          secondary_text: "Valencia, Spain"
        }
      }
    ];

    setGoogleSuggestions(mockSuggestions);
    setShowGoogleSuggestions(true);
  };

  // Helper function to get nationality flags
  const getNationalityFlag = (nationality: string): string => {
    const flagMap: Record<string, string> = {
      'United States': '🇺🇸',
      'China': '🇨🇳',
      'United Kingdom': '🇬🇧',
      'Canada': '🇨🇦',
      'Australia': '🇦🇺',
      'Germany': '🇩🇪',
      'France': '🇫🇷',
      'Spain': '🇪🇸',
      'Italy': '🇮🇹',
      'Japan': '🇯🇵',
      'South Korea': '🇰🇷',
      'Brazil': '🇧🇷',
      'Mexico': '🇲🇽',
      'India': '🇮🇳',
      'Netherlands': '🇳🇱',
      'Sweden': '🇸🇪',
      'Norway': '🇳🇴',
      'Denmark': '🇩🇰',
      'Finland': '🇫🇮',
      'Switzerland': '🇨🇭'
    };
    return flagMap[nationality] || '🏳️';
  };

  const handleSaveBio = () => {
    onProfileUpdate({
      ...profile,
      bio: editBio,
      nationalities: editNationalities.split(",").map(nat => nat.trim()).filter(Boolean)
    });
    setIsEditingBio(false);
  };

  const handleSavePersonal = () => {
    onProfileUpdate({
      ...profile,
      name: `${editFirstName} ${editLastName}`,
      dateOfBirth: editDateOfBirth
    });
    setIsEditingPersonal(false);
  };

  const handleSaveCurrentAddress = () => {
    // Update profile with new current address
    const newAddress = `${editCurrentAddress.line1}${editCurrentAddress.line2 ? ', ' + editCurrentAddress.line2 : ''}, ${editCurrentAddress.city}, ${editCurrentAddress.state} ${editCurrentAddress.postcode}, ${editCurrentAddress.country}`;
    onProfileUpdate({
      ...profile,
      currentLocation: {
        ...profile.currentLocation,
        address: newAddress
      }
    });
    setIsEditingCurrentAddress(false);
  };

  const handleSavePermanentAddress = () => {
    // Update profile with new permanent address
    const newAddress = `${editPermanentAddress.line1}${editPermanentAddress.line2 ? ', ' + editPermanentAddress.line2 : ''}, ${editPermanentAddress.city}, ${editPermanentAddress.state} ${editPermanentAddress.postcode}, ${editPermanentAddress.country}`;
    onProfileUpdate({
      ...profile,
      permanentHome: {
        ...profile.permanentHome,
        address: newAddress,
        propertyType: profile.permanentHome?.propertyType || 'Owned'
      }
    });
    setIsEditingPermanentAddress(false);
  };

  const handleSaveContact = () => {
    if (onProfileUpdate && profile) {
      onProfileUpdate({
        ...profile,
        contact: {
          workEmail: contactForm.workEmail,
          workPhone: contactForm.workPhone,
          personalEmail: contactForm.personalEmail || undefined,
          mobilePhone: contactForm.mobilePhone || undefined
        },
        contactHistory: [
          {
            date: new Date().toLocaleDateString(),
            type: 'Contact Updated',
            details: 'Contact information updated'
          },
          ...(profile.contactHistory || [])
        ]
      });
    }
    setEditingContact(false);
  };

  const handleSaveEmergencyContact = () => {
    if (onProfileUpdate && profile) {
      onProfileUpdate({
        ...profile,
        emergencyContact: {
          name: emergencyContactForm.name,
          relationship: emergencyContactForm.relationship,
          phone: emergencyContactForm.phone,
          email: emergencyContactForm.email || undefined
        },
        contactHistory: [
          {
            date: new Date().toLocaleDateString(),
            type: 'Emergency Contact Updated',
            details: `Emergency contact set to ${emergencyContactForm.name}`
          },
          ...(profile.contactHistory || [])
        ]
      });
    }
    setEditingEmergencyContact(false);
  };

  // Mock Google Places API lookup
  const handleGoogleSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setGoogleSuggestions([]);
      return;
    }
    
    // Mock Google Places API response
    const mockSuggestions = [
      {
        place_id: "1",
        description: `${searchTerm}, Barcelona, Spain`,
        structured_formatting: {
          main_text: searchTerm,
          secondary_text: "Barcelona, Spain"
        }
      },
      {
        place_id: "2", 
        description: `${searchTerm}, Madrid, Spain`,
        structured_formatting: {
          main_text: searchTerm,
          secondary_text: "Madrid, Spain"
        }
      },
      {
        place_id: "3",
        description: `${searchTerm}, Valencia, Spain`, 
        structured_formatting: {
          main_text: searchTerm,
          secondary_text: "Valencia, Spain"
        }
      }
    ];
    
    setGoogleSuggestions(mockSuggestions);
  };

  const handleSelectGoogleSuggestion = (suggestion: any, isCurrentAddress: boolean) => {
    // Parse the suggestion and populate address fields
    const parts = suggestion.description.split(", ");
    const addressData = {
      line1: parts[0] || "",
      line2: "",
      city: parts[1] || "",
      state: parts[2] || "",
      postcode: "",
      country: parts[parts.length - 1] || ""
    };
    
    if (isCurrentAddress) {
      setEditCurrentAddress(addressData);
    } else {
      setEditPermanentAddress(addressData);
    }
    
    setGoogleSuggestions([]);
    setGoogleSearchTerm("");
  };

  const handleAddAddress = () => {
    setShowAddAddressModal(true);
    setNewAddress({
      type: 'other',
      name: '',
      line1: '',
      line2: '',
      city: '',
      state: '',
      postcode: '',
      country: '',
      setAsCurrent: false
    });
    setUseGoogleLookup(true);
    setGoogleSearchTerm('');
    setGoogleSuggestions([]);
  };

  const handleCancelAddAddress = () => {
    setShowAddAddressModal(false);
    setNewAddress({
      type: 'other',
      name: '',
      line1: '',
      line2: '',
      city: '',
      state: '',
      postcode: '',
      country: '',
      setAsCurrent: false
    });
    setGoogleSearchTerm('');
    setGoogleSuggestions([]);
  };

  const handleNewAddressGoogleSelect = (result: any) => {
    setNewAddress(prev => ({
      ...prev,
      line1: result.line1 || '',
      line2: result.line2 || '',
      city: result.city || '',
      state: result.state || '',
      postcode: result.postcode || '',
      country: result.country || ''
    }));
    setGoogleSearchTerm(result.formatted_address);
    setGoogleSuggestions([]);
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Create a URL for the uploaded file
      const photoUrl = URL.createObjectURL(file);
      onProfileUpdate({
        ...profile,
        avatarUrl: photoUrl
      });
      setIsEditingPhoto(false);
    }
  };
  const renderLocationSection = () => (
    <div className="flex-1 p-8 bg-[#1D252D] overflow-y-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search addresses"
                className="w-80 bg-[#2A3440] border-[#40505C] text-white placeholder:text-gray-400 pl-10"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
          <button
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 py-2 bg-[#732cec] hover:bg-[#5a23b8] text-white px-6"
            onClick={() => {
              setShowAddModal(true);
              setUseGoogleLookup(true);
              setGoogleSearchTerm('');
              setGoogleSuggestions([]);
              setShowGoogleSuggestions(false);
            }}
          >
            Add Address
          </button>
        </div>
        
        <div className="flex items-center gap-6 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-white mb-2">Addresses & Location History</h1>
            <p className="text-gray-400">Manage current and previous addresses</p>
          </div>
        </div>
      </div>

      {/* Current Addresses Section */}
      <div className="mb-8">
        <h2 className="text-xl font-medium text-white mb-6">Current Addresses</h2>
        
        <div className="grid gap-6">
          {/* Primary Address Card */}
          <Card className="bg-[#252E38] border-0 rounded-xl shadow-[0px_6px_18px_0px_#00000026]">
            <CardHeader className="flex flex-row items-center justify-between p-6 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <CardTitle className="text-white text-lg font-medium">Current Address</CardTitle>
                  <p className="text-gray-400 text-sm">Primary residence</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-green-500/20 text-green-400 border-0">Current</Badge>
                {!isEditingCurrentAddress ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditingCurrentAddress(true)}
                    className="text-white hover:bg-[#2A3440] p-2"
                  >
                    <Edit2Icon className="w-4 h-4" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditingCurrentAddress(false)}
                      className="text-white hover:bg-[#2A3440] p-2"
                    >
                      <XIcon className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleSaveCurrentAddress}
                      className="text-white hover:bg-[#2A3440] p-2"
                    >
                      <SaveIcon className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              {!isEditingCurrentAddress ? (
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <label className="text-gray-400 text-sm">Address Line 1</label>
                      <p className="text-white font-medium">Carrer de Mallorca, 123</p>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm">Address Line 2</label>
                      <p className="text-white font-medium">Apt 4B</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-gray-400 text-sm">City</label>
                      <p className="text-white font-medium">Barcelona</p>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm">State/Region</label>
                      <p className="text-white font-medium">Catalonia</p>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm">Postcode</label>
                      <p className="text-white font-medium">08013</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Country</label>
                    <p className="text-white font-medium">Spain 🇪🇸</p>
                  </div>
                  <div className="pt-4 border-t border-[#40505C]">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Duration at this address</span>
                      <span className="text-white">2 years, 3 months</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Google Lookup Toggle */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-white text-sm font-medium">Address Lookup</span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant={useGoogleLookup ? "default" : "outline"}
                        size="sm"
                        onClick={() => setUseGoogleLookup(true)}
                        className="text-xs"
                      >
                        <SearchIcon className="w-3 h-3 mr-1" />
                        Google
                      </Button>
                      <Button
                        variant={!useGoogleLookup ? "default" : "outline"}
                        size="sm"
                        onClick={() => setUseGoogleLookup(false)}
                        className="text-xs"
                      >
                        Manual
                      </Button>
                    </div>
                  </div>

                  {/* Google Search */}
                  {useGoogleLookup && (
                    <div className="relative">
                      <div className="relative">
                        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          value={googleSearchTerm}
                          onChange={(e) => {
                            setGoogleSearchTerm(e.target.value);
                            handleGoogleSearch(e.target.value);
                          }}
                          placeholder="Search for address..."
                          className="bg-[#2A3440] border-[#40505C] text-white placeholder:text-gray-400 pl-10"
                        />
                      </div>
                      
                      {/* Google Suggestions */}
                      {googleSuggestions.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-[#2A3440] border border-[#40505C] rounded-md shadow-lg max-h-48 overflow-y-auto">
                          {googleSuggestions.map((suggestion) => (
                            <button
                              key={suggestion.place_id}
                              onClick={() => handleSelectGoogleSuggestion(suggestion, true)}
                              className="w-full px-3 py-2 text-left hover:bg-[#1D252D] text-white text-sm flex items-center gap-2"
                            >
                              <MapPinIcon className="w-4 h-4 text-gray-400" />
                              <div>
                                <div className="font-medium">{suggestion.structured_formatting.main_text}</div>
                                <div className="text-gray-400 text-xs">{suggestion.structured_formatting.secondary_text}</div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Manual Address Fields */}
                  <div className="space-y-3">
                    <div>
                      <label className="text-white text-sm font-medium mb-2 block">Address Line 1</label>
                      <Input
                        value={editCurrentAddress.line1}
                        onChange={(e) => setEditCurrentAddress({...editCurrentAddress, line1: e.target.value})}
                        className="bg-[#2A3440] border-[#40505C] text-white placeholder:text-gray-400"
                        placeholder="Street address"
                      />
                    </div>
                    <div>
                      <label className="text-white text-sm font-medium mb-2 block">Address Line 2</label>
                      <Input
                        value={editCurrentAddress.line2}
                        onChange={(e) => setEditCurrentAddress({...editCurrentAddress, line2: e.target.value})}
                        className="bg-[#2A3440] border-[#40505C] text-white placeholder:text-gray-400"
                        placeholder="Apartment, suite, etc. (optional)"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-white text-sm font-medium mb-2 block">City</label>
                      <Input
                        value={editCurrentAddress.city}
                        onChange={(e) => setEditCurrentAddress({...editCurrentAddress, city: e.target.value})}
                        className="bg-[#2A3440] border-[#40505C] text-white placeholder:text-gray-400"
                      />
                    </div>
                    <div>
                      <label className="text-white text-sm font-medium mb-2 block">State/Region</label>
                      <Input
                        value={editCurrentAddress.state}
                        onChange={(e) => setEditCurrentAddress({...editCurrentAddress, state: e.target.value})}
                        className="bg-[#2A3440] border-[#40505C] text-white placeholder:text-gray-400"
                      />
                    </div>
                    <div>
                      <label className="text-white text-sm font-medium mb-2 block">Postcode</label>
                      <Input
                        value={editCurrentAddress.postcode}
                        onChange={(e) => setEditCurrentAddress({...editCurrentAddress, postcode: e.target.value})}
                        className="bg-[#2A3440] border-[#40505C] text-white placeholder:text-gray-400"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-white text-sm font-medium mb-2 block">Country</label>
                    <Input
                      value={editCurrentAddress.country}
                      onChange={(e) => setEditCurrentAddress({...editCurrentAddress, country: e.target.value})}
                      className="bg-[#2A3440] border-[#40505C] text-white placeholder:text-gray-400"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Permanent Home Address Card */}
          <Card className="bg-[#252E38] border-0 rounded-xl shadow-[0px_6px_18px_0px_#00000026]">
            <CardHeader className="flex flex-row items-center justify-between p-6 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                </div>
                <div>
                  <CardTitle className="text-white text-lg font-medium">Permanent Home</CardTitle>
                  <p className="text-gray-400 text-sm">Home country address</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-500/20 text-blue-400 border-0">Permanent</Badge>
                {!isEditingPermanentAddress ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditingPermanentAddress(true)}
                    className="text-white hover:bg-[#2A3440] p-2"
                  >
                    <Edit2Icon className="w-4 h-4" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditingPermanentAddress(false)}
                      className="text-white hover:bg-[#2A3440] p-2"
                    >
                      <XIcon className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleSavePermanentAddress}
                      className="text-white hover:bg-[#2A3440] p-2"
                    >
                      <SaveIcon className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              {!isEditingPermanentAddress ? (
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <label className="text-gray-400 text-sm">Address Line 1</label>
                      <p className="text-white font-medium">1234 Market Street</p>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm">Address Line 2</label>
                      <p className="text-white font-medium">Unit 567</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-gray-400 text-sm">City</label>
                      <p className="text-white font-medium">San Francisco</p>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm">State/Region</label>
                      <p className="text-white font-medium">California</p>
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm">Postcode</label>
                      <p className="text-white font-medium">94102</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Country</label>
                    <p className="text-white font-medium">United States 🇺🇸</p>
                  </div>
                  <div className="pt-4 border-t border-[#40505C]">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Property Type</span>
                      <span className="text-white">Owned</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Google Lookup Toggle */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-white text-sm font-medium">Address Lookup</span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant={useGoogleLookup ? "default" : "outline"}
                        size="sm"
                        onClick={() => setUseGoogleLookup(true)}
                        className="text-xs"
                      >
                        <SearchIcon className="w-3 h-3 mr-1" />
                        Google
                      </Button>
                      <Button
                        variant={!useGoogleLookup ? "default" : "outline"}
                        size="sm"
                        onClick={() => setUseGoogleLookup(false)}
                        className="text-xs"
                      >
                        Manual
                      </Button>
                    </div>
                  </div>

                  {/* Google Search */}
                  {useGoogleLookup && (
                    <div className="relative">
                      <div className="relative">
                        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          value={googleSearchTerm}
                          onChange={(e) => {
                            setGoogleSearchTerm(e.target.value);
                            handleGoogleSearch(e.target.value);
                          }}
                          placeholder="Search for address..."
                          className="bg-[#2A3440] border-[#40505C] text-white placeholder:text-gray-400 pl-10"
                        />
                      </div>
                      
                      {/* Google Suggestions */}
                      {googleSuggestions.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-[#2A3440] border border-[#40505C] rounded-md shadow-lg max-h-48 overflow-y-auto">
                          {googleSuggestions.map((suggestion) => (
                            <button
                              key={suggestion.place_id}
                              onClick={() => handleSelectGoogleSuggestion(suggestion, false)}
                              className="w-full px-3 py-2 text-left hover:bg-[#1D252D] text-white text-sm flex items-center gap-2"
                            >
                              <MapPinIcon className="w-4 h-4 text-gray-400" />
                              <div>
                                <div className="font-medium">{suggestion.structured_formatting.main_text}</div>
                                <div className="text-gray-400 text-xs">{suggestion.structured_formatting.secondary_text}</div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Manual Address Fields */}
                  <div className="space-y-3">
                    <div>
                      <label className="text-white text-sm font-medium mb-2 block">Address Line 1</label>
                      <Input
                        value={editPermanentAddress.line1}
                        onChange={(e) => setEditPermanentAddress({...editPermanentAddress, line1: e.target.value})}
                        className="bg-[#2A3440] border-[#40505C] text-white placeholder:text-gray-400"
                        placeholder="Street address"
                      />
                    </div>
                    <div>
                      <label className="text-white text-sm font-medium mb-2 block">Address Line 2</label>
                      <Input
                        value={editPermanentAddress.line2}
                        onChange={(e) => setEditPermanentAddress({...editPermanentAddress, line2: e.target.value})}
                        className="bg-[#2A3440] border-[#40505C] text-white placeholder:text-gray-400"
                        placeholder="Apartment, suite, etc. (optional)"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-white text-sm font-medium mb-2 block">City</label>
                      <Input
                        value={editPermanentAddress.city}
                        onChange={(e) => setEditPermanentAddress({...editPermanentAddress, city: e.target.value})}
                        className="bg-[#2A3440] border-[#40505C] text-white placeholder:text-gray-400"
                      />
                    </div>
                    <div>
                      <label className="text-white text-sm font-medium mb-2 block">State/Region</label>
                      <Input
                        value={editPermanentAddress.state}
                        onChange={(e) => setEditPermanentAddress({...editPermanentAddress, state: e.target.value})}
                        className="bg-[#2A3440] border-[#40505C] text-white placeholder:text-gray-400"
                      />
                    </div>
                    <div>
                      <label className="text-white text-sm font-medium mb-2 block">Postcode</label>
                      <Input
                        value={editPermanentAddress.postcode}
                        onChange={(e) => setEditPermanentAddress({...editPermanentAddress, postcode: e.target.value})}
                        className="bg-[#2A3440] border-[#40505C] text-white placeholder:text-gray-400"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-white text-sm font-medium mb-2 block">Country</label>
                    <Input
                      value={editPermanentAddress.country}
                      onChange={(e) => setEditPermanentAddress({...editPermanentAddress, country: e.target.value})}
                      className="bg-[#2A3440] border-[#40505C] text-white placeholder:text-gray-400"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Address History Section */}
      <div className="mb-8">
        <h2 className="text-xl font-medium text-white mb-6">Address History</h2>
        
        <Card className="bg-[#252E38] border-0 rounded-xl shadow-[0px_6px_18px_0px_#00000026]">
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Timeline Item 1 */}
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div className="w-px h-16 bg-[#40505C] mt-2"></div>
                </div>
                <div className="flex-1 pb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-white font-medium">Moved to Barcelona, Spain</h3>
                    <span className="text-gray-400 text-sm">January 15, 2022</span>
                  </div>
                  <p className="text-gray-400 text-sm mb-2">Carrer de Mallorca, 123, Apt 4B, Barcelona, Catalonia 08013</p>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-500/20 text-green-400 border-0 text-xs">Current</Badge>
                    <Badge className="bg-purple-500/20 text-purple-400 border-0 text-xs">Work Assignment</Badge>
                  </div>
                </div>
              </div>

              {/* Timeline Item 2 */}
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  <div className="w-px h-16 bg-[#40505C] mt-2"></div>
                </div>
                <div className="flex-1 pb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-white font-medium">Moved to London, UK</h3>
                    <span className="text-gray-400 text-sm">June 1, 2019</span>
                  </div>
                  <p className="text-gray-400 text-sm mb-2">45 Kensington Gardens, London, England SW7 2AP</p>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-gray-500/20 text-gray-400 border-0 text-xs">Previous</Badge>
                    <Badge className="bg-blue-500/20 text-blue-400 border-0 text-xs">Work Assignment</Badge>
                  </div>
                </div>
              </div>

              {/* Timeline Item 3 */}
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-white font-medium">Started at San Francisco, CA</h3>
                    <span className="text-gray-400 text-sm">September 1, 2015</span>
                  </div>
                  <p className="text-gray-400 text-sm mb-2">1234 Market Street, Unit 567, San Francisco, CA 94102</p>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-gray-500/20 text-gray-400 border-0 text-xs">Previous</Badge>
                    <Badge className="bg-green-500/20 text-green-400 border-0 text-xs">Permanent Home</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex gap-3 mt-6">
        <Button
          onClick={handleAddAddress}
          className="w-12 h-12 rounded-full bg-[#732cec] hover:bg-[#5a23b8] text-white shadow-lg"
        >
          <PlusIcon className="w-5 h-5" />
        </Button>
      </div>
    </div>
    </>

      {/* Add Address Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#252E38] rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Add New Address</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Address Type Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Address Type
              </label>
              <div className="flex gap-3">
                <button
                  className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    newAddress.type === 'current'
                      ? 'bg-[#732cec] text-white'
                      : 'bg-[#1D252D] text-gray-300 hover:bg-[#2A3440]'
                  }`}
                  onClick={() => setNewAddress(prev => ({ ...prev, type: 'current' }))}
                >
                  Current Address
                </button>
                <button
                  className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    newAddress.type === 'permanent'
                      ? 'bg-[#732cec] text-white'
                      : 'bg-[#1D252D] text-gray-300 hover:bg-[#2A3440]'
                  }`}
                  onClick={() => setNewAddress(prev => ({ ...prev, type: 'permanent' }))}
                >
                  Permanent Home
                </button>
                <button
                  className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    newAddress.type === 'other'
                      ? 'bg-[#732cec] text-white'
                      : 'bg-[#1D252D] text-gray-300 hover:bg-[#2A3440]'
                  }`}
                  onClick={() => setNewAddress(prev => ({ ...prev, type: 'other' }))}
                >
                  Other Address
                </button>
              </div>
            </div>

            {/* Address Name */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Address Name (Optional)
              </label>
              <input
                type="text"
                value={newAddress.name}
                onChange={(e) => setNewAddress(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Home, Work, Vacation Home"
                className="w-full px-3 py-2 bg-[#1D252D] border border-[#40505C] rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#732cec] focus:border-transparent"
              />
            </div>

            {/* Google Lookup Toggle */}
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-300">Address Entry Method</span>
                <div className="flex items-center gap-3">
                  <span className={`text-sm ${!useGoogleLookup ? 'text-white' : 'text-gray-400'}`}>
                    Manual
                  </span>
                  <button
                    onClick={() => setUseGoogleLookup(!useGoogleLookup)}
                    className={`w-12 h-6 rounded-full p-0 transition-colors ${
                      useGoogleLookup ? 'bg-[#732cec]' : 'bg-gray-600'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        useGoogleLookup ? 'translate-x-3' : 'translate-x-0'
                      }`}
                    />
                  </button>
                  <span className={`text-sm ${useGoogleLookup ? 'text-white' : 'text-gray-400'}`}>
                    Google
                  </span>
                </div>
              </div>
            </div>

            {/* Google Lookup or Manual Entry */}
            {useGoogleLookup ? (
              <div className="mb-6 relative">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Search Address
                </label>
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={googleSearchTerm}
                    onChange={(e) => {
                      setGoogleSearchTerm(e.target.value);
                      searchGooglePlaces(e.target.value);
                    }}
                    placeholder="Start typing an address..."
                    className="w-full pl-10 pr-3 py-2 bg-[#1D252D] border border-[#40505C] rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#732cec] focus:border-transparent"
                  />
                </div>
                
                {/* Search Results */}
                {showGoogleSuggestions && googleSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-[#1D252D] border border-[#40505C] rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {googleSuggestions.map((result, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          // Parse the result and populate fields
                          const parts = result.description.split(', ');
                          setNewAddress(prev => ({
                            ...prev,
                            line1: parts[0] || '',
                            city: parts[1] || '',
                            state: parts[2] || '',
                            country: parts[parts.length - 1] || ''
                          }));
                          setGoogleSearchTerm(result.description);
                          setShowGoogleSuggestions(false);
                        }}
                        className="px-4 py-3 hover:bg-[#2A3440] cursor-pointer border-b border-[#40505C] last:border-b-0"
                      >
                        <div className="text-white font-medium">{result.structured_formatting.main_text}</div>
                        <div className="text-gray-400 text-sm">{result.structured_formatting.secondary_text}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : null}

            {/* Manual Address Fields */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Address Line 1 *
                </label>
                <input
                  type="text"
                  value={newAddress.line1}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, line1: e.target.value }))}
                  placeholder="Street number and name"
                  className="w-full px-3 py-2 bg-[#1D252D] border border-[#40505C] rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#732cec] focus:border-transparent"
                  disabled={useGoogleLookup && googleSuggestions.length === 0 && !googleSearchTerm}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Address Line 2
                </label>
                <input
                  type="text"
                  value={newAddress.line2}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, line2: e.target.value }))}
                  placeholder="Apartment, suite, unit, building, floor, etc."
                  className="w-full px-3 py-2 bg-[#1D252D] border border-[#40505C] rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#732cec] focus:border-transparent"
                  disabled={useGoogleLookup && googleSuggestions.length === 0 && !googleSearchTerm}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="City"
                    className="w-full px-3 py-2 bg-[#1D252D] border border-[#40505C] rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#732cec] focus:border-transparent"
                    disabled={useGoogleLookup && googleSuggestions.length === 0 && !googleSearchTerm}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    State/Province *
                  </label>
                  <input
                    type="text"
                    value={newAddress.state}
                    onChange={(e) => setNewAddress(prev => ({ ...prev, state: e.target.value }))}
                    placeholder="State or Province"
                    className="w-full px-3 py-2 bg-[#1D252D] border border-[#40505C] rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#732cec] focus:border-transparent"
                    disabled={useGoogleLookup && googleSuggestions.length === 0 && !googleSearchTerm}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Postcode *
                  </label>
                  <input
                    type="text"
                    value={newAddress.postcode}
                    onChange={(e) => setNewAddress(prev => ({ ...prev, postcode: e.target.value }))}
                    placeholder="Postal/ZIP code"
                    className="w-full px-3 py-2 bg-[#1D252D] border border-[#40505C] rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#732cec] focus:border-transparent"
                    disabled={useGoogleLookup && googleSuggestions.length === 0 && !googleSearchTerm}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Country *
                  </label>
                  <input
                    type="text"
                    value={newAddress.country}
                    onChange={(e) => setNewAddress(prev => ({ ...prev, country: e.target.value }))}
                    placeholder="Country"
                    className="w-full px-3 py-2 bg-[#1D252D] border border-[#40505C] text-white placeholder-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Set as Current Address Option */}
            {newAddress.type === 'other' && (
              <div className="mb-6">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={newAddress.setAsCurrent}
                    onChange={(e) => setNewAddress(prev => ({ ...prev, setAsCurrent: e.target.checked }))}
                    className="w-4 h-4 text-[#732cec] bg-[#1D252D] border-[#40505C] rounded focus:ring-[#732cec]"
                  />
                  <span className="text-sm text-gray-300">Set as current address</span>
                </label>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex gap-3 pt-4 border-t border-[#40505C]">
              <button
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                onClick={() => {
                  setShowAddModal(false);
                  setNewAddress({
                    type: 'current',
                    name: '',
                    line1: '',
                    line2: '',
                    city: '',
                    state: '',
                    postcode: '',
                    country: '',
                    setAsCurrent: false
                  });
                  setGoogleSearchTerm('');
                  setGoogleSuggestions([]);
                  setShowGoogleSuggestions(false);
                }}
              >
                Cancel
              </button>
              <button
                className={`px-4 py-2 rounded-md transition-colors ${
                  newAddress.line1 && newAddress.city && newAddress.state && newAddress.postcode && newAddress.country
                    ? 'bg-[#732cec] hover:bg-[#5a23b8] text-white'
                    : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                }`}
                disabled={!newAddress.line1 || !newAddress.city || !newAddress.state || !newAddress.postcode || !newAddress.country}
                onClick={handleSaveNewAddress}
              >
                Save Address
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Address Modal */}
      {showAddAddressModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#252E38] rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Add New Address</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCancelAddAddress}
                className="text-gray-400 hover:text-white"
              >
                <XIcon className="w-5 h-5" />
              </Button>
            </div>

            {/* Address Type Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Address Type
              </label>
              <div className="flex gap-3">
                <Button
                  variant={newAddress.type === 'current' ? 'default' : 'outline'}
                  onClick={() => setNewAddress(prev => ({ ...prev, type: 'current' }))}
                  className="flex-1"
                >
                  Current Address
                </Button>
                <Button
                  variant={newAddress.type === 'permanent' ? 'default' : 'outline'}
                  onClick={() => setNewAddress(prev => ({ ...prev, type: 'permanent' }))}
                  className="flex-1"
                >
                  Permanent Home
                </Button>
                <Button
                  variant={newAddress.type === 'other' ? 'default' : 'outline'}
                  onClick={() => setNewAddress(prev => ({ ...prev, type: 'other' }))}
                  className="flex-1"
                >
                  Other Address
                </Button>
              </div>
            </div>

            {/* Address Name */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Address Name (Optional)
              </label>
              <Input
                value={newAddress.name}
                onChange={(e) => setNewAddress(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Home, Work, Vacation Home"
                className="bg-[#1D252D] border-[#40505C] text-white"
              />
            </div>

            {/* Google Lookup Toggle */}
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-300">Address Entry Method</span>
                <div className="flex items-center gap-3">
                  <span className={`text-sm ${!useGoogleLookup ? 'text-white' : 'text-gray-400'}`}>
                    Manual
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setUseGoogleLookup(!useGoogleLookup)}
                    className={`w-12 h-6 rounded-full p-0 ${
                      useGoogleLookup ? 'bg-[#732cec]' : 'bg-gray-600'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        useGoogleLookup ? 'translate-x-3' : 'translate-x-0'
                      }`}
                    />
                  </Button>
                  <span className={`text-sm ${useGoogleLookup ? 'text-white' : 'text-gray-400'}`}>
                    Google
                  </span>
                </div>
              </div>
            </div>

            {/* Google Lookup or Manual Entry */}
            {useGoogleLookup ? (
              <div className="mb-6 relative">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Search Address
                </label>
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    value={googleSearchTerm}
                    onChange={(e) => {
                      setGoogleSearchTerm(e.target.value);
                      handleGoogleSearch(e.target.value);
                    }}
                    placeholder="Start typing an address..."
                    className="pl-10 bg-[#1D252D] border-[#40505C] text-white"
                  />
                </div>
                
                {/* Search Results */}
                {googleSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-[#1D252D] border border-[#40505C] rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {googleSuggestions.map((result, index) => (
                      <div
                        key={index}
                        onClick={() => handleNewAddressGoogleSelect(result)}
                        className="px-4 py-3 hover:bg-[#2A3440] cursor-pointer border-b border-[#40505C] last:border-b-0"
                      >
                        <div className="text-white font-medium">{result.main_text}</div>
                        <div className="text-gray-400 text-sm">{result.secondary_text}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : null}

            {/* Manual Address Fields */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Address Line 1 *
                </label>
                <Input
                  value={newAddress.line1}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, line1: e.target.value }))}
                  placeholder="Street number and name"
                  className="bg-[#1D252D] border-[#40505C] text-white"
                  disabled={useGoogleLookup && googleSuggestions.length === 0 && !googleSearchTerm}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Address Line 2
                </label>
                <Input
                  value={newAddress.line2}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, line2: e.target.value }))}
                  placeholder="Apartment, suite, unit, building, floor, etc."
                  className="bg-[#1D252D] border-[#40505C] text-white"
                  disabled={useGoogleLookup && googleSuggestions.length === 0 && !googleSearchTerm}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    City *
                  </label>
                  <Input
                    value={newAddress.city}
                    onChange={(e) => setNewAddress(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="City"
                    className="bg-[#1D252D] border-[#40505C] text-white"
                    disabled={useGoogleLookup && googleSuggestions.length === 0 && !googleSearchTerm}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    State/Province *
                  </label>
                  <Input
                    value={newAddress.state}
                    onChange={(e) => setNewAddress(prev => ({ ...prev, state: e.target.value }))}
                    placeholder="State or Province"
                    className="bg-[#1D252D] border-[#40505C] text-white"
                    disabled={useGoogleLookup && googleSuggestions.length === 0 && !googleSearchTerm}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Postcode *
                  </label>
                  <Input
                    value={newAddress.postcode}
                    onChange={(e) => setNewAddress(prev => ({ ...prev, postcode: e.target.value }))}
                    placeholder="Postal/ZIP code"
                    className="bg-[#1D252D] border-[#40505C] text-white"
                    disabled={useGoogleLookup && googleSuggestions.length === 0 && !googleSearchTerm}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Country *
                  </label>
                  <Input
                    value={newAddress.country}
                    onChange={(e) => setNewAddress(prev => ({ ...prev, country: e.target.value }))}
                    placeholder="Country"
                    className="bg-[#1D252D] border-[#40505C] text-white"
                    disabled={useGoogleLookup && googleSuggestions.length === 0 && !googleSearchTerm}
                  />
                </div>
              </div>
            </div>

            {/* Set as Current Address Option */}
            {newAddress.type === 'other' && (
              <div className="mb-6">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={newAddress.setAsCurrent}
                    onChange={(e) => setNewAddress(prev => ({ ...prev, setAsCurrent: e.target.checked }))}
                    className="w-4 h-4 text-[#732cec] bg-[#1D252D] border-[#40505C] rounded focus:ring-[#732cec]"
                  />
                  <span className="text-sm text-gray-300">Set as current address</span>
                </label>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex gap-3 pt-4 border-t border-[#40505C]">
              <Button
                variant="outline"
                onClick={handleCancelAddAddress}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveNewAddress}
                className="flex-1 bg-[#732cec] hover:bg-[#5a23b8]"
                disabled={!newAddress.line1 || !newAddress.city || !newAddress.state || !newAddress.postcode || !newAddress.country}
              >
                Add Address
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderContactSection = () => (
    <div className="flex-1 p-8 bg-[#1D252D] overflow-y-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Contact Information</h2>
        <p className="text-gray-400">Phone numbers, email addresses, and emergency contacts</p>
      </div>

      {/* Contact Details */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Contact Details</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setEditingContact(!editingContact)}
            className="text-blue-400 hover:text-blue-300"
          >
            {editingContact ? 'Cancel' : 'Edit'}
          </Button>
        </div>

        {editingContact ? (
          <div className="bg-[#252E38] rounded-lg p-6 border border-[#40505C]">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Work Email *</label>
                  <Input
                    type="email"
                    value={contactForm.workEmail}
                    onChange={(e) => setContactForm(prev => ({ ...prev, workEmail: e.target.value }))}
                    className="bg-[#1D252D] border-[#40505C] text-white"
                    placeholder="work@company.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Personal Email</label>
                  <Input
                    type="email"
                    value={contactForm.personalEmail}
                    onChange={(e) => setContactForm(prev => ({ ...prev, personalEmail: e.target.value }))}
                    className="bg-[#1D252D] border-[#40505C] text-white"
                    placeholder="personal@email.com"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Work Phone</label>
                  <Input
                    type="tel"
                    value={contactForm.workPhone}
                    onChange={(e) => setContactForm(prev => ({ ...prev, workPhone: e.target.value }))}
                    className="bg-[#1D252D] border-[#40505C] text-white"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Mobile Phone</label>
                  <Input
                    type="tel"
                    value={contactForm.mobilePhone}
                    onChange={(e) => setContactForm(prev => ({ ...prev, mobilePhone: e.target.value }))}
                    className="bg-[#1D252D] border-[#40505C] text-white"
                    placeholder="+1 (555) 987-6543"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={handleSaveContact}
                disabled={!contactForm.workEmail.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Save Changes
              </Button>
              <Button
                variant="outline"
                onClick={() => setEditingContact(false)}
                className="border-[#40505C] text-gray-300 hover:bg-[#2A3440]"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-[#252E38] rounded-lg p-6 border border-[#40505C]">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400">Work Email</label>
                  <p className="text-white font-medium">
                    {profile?.contact?.workEmail || 'Not provided'}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Work Phone</label>
                  <p className="text-white font-medium">
                    {profile?.contact?.workPhone || 'Not provided'}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400">Personal Email</label>
                  <p className="text-white font-medium">
                    {profile?.contact?.personalEmail || 'Not provided'}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Mobile Phone</label>
                  <p className="text-white font-medium">
                    {profile?.contact?.mobilePhone || 'Not provided'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Emergency Contact */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Emergency Contact</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setEditingEmergencyContact(!editingEmergencyContact)}
            className="text-blue-400 hover:text-blue-300"
          >
            {editingEmergencyContact ? 'Cancel' : 'Edit'}
          </Button>
        </div>

        {editingEmergencyContact ? (
          <div className="bg-[#252E38] rounded-lg p-6 border border-[#40505C]">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Full Name *</label>
                  <Input
                    value={emergencyContactForm.name}
                    onChange={(e) => setEmergencyContactForm(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-[#1D252D] border-[#40505C] text-white"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Relationship *</label>
                  <Input
                    value={emergencyContactForm.relationship}
                    onChange={(e) => setEmergencyContactForm(prev => ({ ...prev, relationship: e.target.value }))}
                    className="bg-[#1D252D] border-[#40505C] text-white"
                    placeholder="Spouse, Parent, Sibling, etc."
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Primary Phone *</label>
                  <Input
                    type="tel"
                    value={emergencyContactForm.phone}
                    onChange={(e) => setEmergencyContactForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="bg-[#1D252D] border-[#40505C] text-white"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Alternative Phone</label>
                  <Input
                    type="tel"
                    value={emergencyContactForm.alternativePhone}
                    onChange={(e) => setEmergencyContactForm(prev => ({ ...prev, alternativePhone: e.target.value }))}
                    className="bg-[#1D252D] border-[#40505C] text-white"
                    placeholder="+1 (555) 987-6543"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                <Input
                  type="email"
                  value={emergencyContactForm.email}
                  onChange={(e) => setEmergencyContactForm(prev => ({ ...prev, email: e.target.value }))}
                  className="bg-[#1D252D] border-[#40505C] text-white"
                  placeholder="emergency@email.com"
                />
              </div>
            </div>
          </div>
          </Card>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={handleSaveEmergencyContact}
                disabled={!emergencyContactForm.name.trim() || !emergencyContactForm.relationship || !emergencyContactForm.phone.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Save Changes
              </Button>
              <Button
                variant="outline"
                onClick={() => setEditingEmergencyContact(false)}
                className="border-[#40505C] text-gray-300 hover:bg-[#2A3440]"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-[#252E38] rounded-lg p-6 border border-[#40505C]">
            {profile?.emergencyContact ? (
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400">Name</label>
                    <p className="text-white font-medium">{profile.emergencyContact.name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Relationship</label>
                    <p className="text-white font-medium">{profile.emergencyContact.relationship}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400">Phone</label>
                    <p className="text-white font-medium">{profile.emergencyContact.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Email</label>
                    <p className="text-white font-medium">{profile.emergencyContact.email || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400 mb-4">No emergency contact information available</p>
                <Button
                  onClick={() => setEditingEmergencyContact(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Add Emergency Contact
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Contact History */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">Contact History</h3>
        <div className="bg-[#252E38] rounded-lg border border-[#40505C]">
          {profile?.contactHistory && profile.contactHistory.length > 0 ? (
            <div className="divide-y divide-[#40505C]">
              {profile.contactHistory.map((item, index) => (
                <div key={index} className="p-4 flex items-center gap-4">
                  <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">{item.type}</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-300">{item.details}</span>
                    </div>
                    <p className="text-gray-400 text-sm">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-gray-400">
              No contact history available
            </div>
          )}
        </div>
      </div>
    </div>
  );
  const renderDetailsSection = () => (
    <div className="flex-1 p-8 bg-[#1D252D] overflow-y-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search employee details"
                className="w-80 bg-[#2A3440] border-[#40505C] text-white placeholder:text-gray-400 pl-10"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
          <Button className="bg-[#732cec] hover:bg-[#5a23b8] text-white px-6">
            Onboard
          </Button>
        </div>
        
        {/* Photo Section */}
        <div className="flex items-center gap-6 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-white mb-2">{profile.name}</h1>
            <p className="text-gray-400">Job title | Department</p>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column - Wider */}
        <div className="col-span-7 space-y-6">
          {/* Bio Card */}
          <Card className="bg-[#252E38] border-0 rounded-xl shadow-[0px_6px_18px_0px_#00000026]">
            <CardHeader className="flex flex-row items-center justify-between p-6 pb-4">
              <CardTitle className="text-white text-lg font-medium">Bio</CardTitle>
              {!isEditingBio ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditingBio(true)}
                  className="text-white hover:bg-[#2A3440] p-2"
                >
                  <Edit2Icon className="w-4 h-4" />
                  Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditingBio(false)}
                    className="text-white hover:bg-[#2A3440] p-2"
                  >
                    <XIcon className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSaveBio}
                    className="text-white hover:bg-[#2A3440] p-2"
                  >
                    <SaveIcon className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-6">
              {!isEditingBio ? (
                <div>
                  <p className="text-white leading-relaxed text-sm">
                    {profile.bio || "No bio available"}
                  </p>
                  
                  <div>
                    <h3 className="text-white font-medium mb-3">Languages</h3>
                    <div className="flex gap-2">
                      {profile.languages?.length ? (
                        profile.languages.map((lang) => {
                          const proficiencyColors = {
                            'Basic': 'bg-gray-500',
                            'Conversational': 'bg-blue-500', 
                            'Professional': 'bg-green-500',
                            'Native': 'bg-amber-500'
                          };
                          return (
                            <div
                              key={lang.id}
                              className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium ${
                                lang.isPrimary 
                                  ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 text-amber-900'
                                  : 'bg-[#40505C] text-white border-[#40505C]'
                              }`}
                            >
                              <span className="font-semibold">{lang.language}</span>
                              <div className="flex items-center gap-1">
                                <div className={`w-2 h-2 rounded-full ${proficiencyColors[lang.proficiency]}`} />
                                <span className="text-xs opacity-75">{lang.proficiency}</span>
                              </div>
                              {lang.isPrimary && (
                                <Badge variant="default" className="text-xs px-1.5 py-0.5 bg-amber-100 text-amber-800 border-amber-300">
                                  Primary
                                </Badge>
                              )}
                            </div>
                          );
                        })
                      ) : (
                        <span className="text-gray-400">Not specified</span>
                      )}
                      {isEditingDetails && (
                        <Button
                          onClick={() => {}}
                          className="mt-3 w-full bg-[#732cec] hover:bg-[#5a23b8] text-white"
                        >
                          Add Language
                        </Button>
                      )}
                    </div>
                    
                    {/* Add Language Button */}
                    {isEditingBio && (
                      <Button
                        onClick={() => {}}
                        className="mt-3 w-full bg-[#732cec] hover:bg-[#5a23b8] text-white"
                      >
                        Add Language
                      </Button>
                    )}
                  </div>

                  <div>
                    <h3 className="text-white font-medium mb-3">Nationalities</h3>
                    <div className="flex gap-2 flex-wrap">
                      {(profile.nationalities || ["United States", "China"]).map((nationality, index) => (
                        <div key={index} className="relative group">
                          <Badge variant="secondary" className="bg-[#2A3440] text-white border-0 text-xs flex items-center gap-1">
                            <span className="text-lg">{getNationalityFlag(nationality)}</span>
                            <span>{nationality}</span>
                          </Badge>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                            {nationality}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="text-white text-sm font-medium mb-2 block">Bio</label>
                    <Textarea
                      value={editBio}
                      onChange={(e) => setEditBio(e.target.value)}
                      className="bg-[#2A3440] border-[#40505C] text-white placeholder:text-gray-400 min-h-[120px]"
                      placeholder="Enter bio..."
                    />
                  </div>
                  <div>
                    <label className="text-white text-sm font-medium mb-3 block">Languages</label>
                    <div className="bg-[#2A3440] border border-[#40505C] rounded-md p-4">
                      <LanguageEditor
                        languages={profile.languages || []}
                        onLanguagesChange={(languages) => {
                          onProfileUpdate({ ...profile, languages });
                        }}
                        className="language-editor-dark"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-white text-sm font-medium mb-2 block">Nationalities (comma separated)</label>
                    <Input
                      value={editNationalities}
                      onChange={(e) => setEditNationalities(e.target.value)}
                      className="bg-[#2A3440] border-[#40505C] text-white placeholder:text-gray-400"
                      placeholder="United States, China"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Personal Card */}
          <Card className="bg-[#252E38] border-0 rounded-xl shadow-[0px_6px_18px_0px_#00000026]">
            <CardHeader className="flex flex-row items-center justify-between p-6 pb-4">
              <CardTitle className="text-white text-lg font-medium">Personal</CardTitle>
              {!isEditingPersonal ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditingPersonal(true)}
                  className="text-white hover:bg-[#2A3440] p-2"
                >
                  <Edit2Icon className="w-4 h-4" />
                  Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditingPersonal(false)}
                    className="text-white hover:bg-[#2A3440] p-2"
                  >
                    <XIcon className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSavePersonal}
                    className="text-white hover:bg-[#2A3440] p-2"
                  >
                    <SaveIcon className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent className="p-6 pt-0">
              {!isEditingPersonal ? (
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Title</span>
                    <span className="text-white">Mr.</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">First name</span>
                    <span className="text-white">{profile.name.split(" ")[0] || "Hannah"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Middle name</span>
                    <span className="text-white">Naomi</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Last name</span>
                    <span className="text-white">{profile.name.split(" ").slice(1).join(" ") || "Williams"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Preferred name</span>
                    <span className="text-white">{profile.name.split(" ")[0] || "Hannah"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Gender at birth</span>
                    <span className="text-white">Male</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Gender identity</span>
                    <span className="text-white">Male</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Pronouns</span>
                    <span className="text-white">She/her/hers</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Date of birth</span>
                    <span className="text-white">{profile.dateOfBirth || "01 December 1980"}</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Date of Birth
                    </label>
                    <Input
                      type="date"
                      value={profile?.dateOfBirth || ''}
                      onChange={(e) => onProfileUpdate?.({
                        ...profile!,
                        dateOfBirth: e.target.value
                      })}
                      className="bg-[#2A3440] border-[#40505C] text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Languages
                    </label>
                    <div className="flex gap-2">
                      <Input
                        value={profile?.languages?.join(', ') || ''}
                        readOnly
                        className="h-[52px] bg-gray-50 flex-1"
                        placeholder="No languages specified"
                      />
                      <Button
                        type="button"
                        onClick={() => {}}
                        className="h-[52px] w-[52px] border-2 border-dashed border-gray-300 bg-white hover:bg-gray-50 text-gray-600 hover:text-gray-800 flex items-center justify-center"
                        variant="outline"
                      >
                        <PlusIcon className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <label className="text-white text-sm font-medium mb-2 block">Title</label>
                    <Input
                      value="Mr."
                      className="bg-[#2A3440] border-[#40505C] text-white placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="text-white text-sm font-medium mb-2 block">First name</label>
                    <Input
                      value={editFirstName}
                      onChange={(e) => setEditFirstName(e.target.value)}
                      className="bg-[#2A3440] border-[#40505C] text-white placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="text-white text-sm font-medium mb-2 block">Last name</label>
                    <Input
                      value={editLastName}
                      onChange={(e) => setEditLastName(e.target.value)}
                      className="bg-[#2A3440] border-[#40505C] text-white placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="text-white text-sm font-medium mb-2 block">Gender at birth</label>
                    <Input
                      value="Male"
                      className="bg-[#2A3440] border-[#40505C] text-white placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="text-white text-sm font-medium mb-2 block">Gender identity</label>
                    <Input
                      value="Male"
                      className="bg-[#2A3440] border-[#40505C] text-white placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="text-white text-sm font-medium mb-2 block">Date of birth</label>
                    <Input
                      type="date"
                      value={editDateOfBirth}
                      onChange={(e) => setEditDateOfBirth(e.target.value)}
                      className="bg-[#2A3440] border-[#40505C] text-white placeholder:text-gray-400"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Work & Employment Card */}
          <Card className="bg-[#252E38] border-0 rounded-xl shadow-[0px_6px_18px_0px_#00000026]">
            <CardHeader className="flex flex-row items-center justify-between p-6 pb-4">
              <CardTitle className="text-white text-lg font-medium">Work & Employment</CardTitle>
              <Button
                type="button"
                size="sm"
                className="gap-2"
              >
                <PlusIcon className="w-4 h-4" />
                Add Employment
              </Button>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              {/* Employment Records */}
              <div className="space-y-4">
                {profile?.employmentRecords && profile.employmentRecords.length > 0 ? (
                  profile.employmentRecords
                    .sort((a, b) => {
                      // Sort by active status first, then by start date
                      if (a.isActive && !b.isActive) return -1;
                      if (!a.isActive && b.isActive) return 1;
                      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
                    })
                    .map((record) => (
                      <Card key={record.id} className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div>
                              <h3 className="text-lg font-medium">
                                {record.jobTitle || 'Untitled Position'}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {record.employerName || 'Unknown Company'}
                                {record.department && ` • ${record.department}`}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              {record.isActive && (
                                <Badge className="bg-green-100 text-green-800 border-green-200">
                                  Active
                                </Badge>
                              )}
                              {record.isSecondaryContract && (
                                <Badge variant="outline" className="border-blue-200 text-blue-800">
                                  Secondary Contract
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                            >
                              <Edit2Icon className="w-4 h-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2Icon className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-muted-foreground">Employment Period:</span>
                            <p>
                              {new Date(record.startDate).toLocaleDateString()} - {' '}
                              {record.endDate 
                                ? new Date(record.endDate).toLocaleDateString() 
                                : 'Present'
                              }
                            </p>
                          </div>
                          <div>
                            <span className="font-medium text-muted-foreground">Employment Type:</span>
                            <p>{record.employmentType || 'Not specified'}</p>
                          </div>
                          {record.jobGrade && (
                            <div>
                              <span className="font-medium text-muted-foreground">Job Grade:</span>
                              <p>{record.jobGrade}</p>
                            </div>
                          )}
                          {record.employerLocation && (
                            <div>
                              <span className="font-medium text-muted-foreground">Location:</span>
                              <p>{record.employerLocation}</p>
                            </div>
                          )}
                          {record.managers && record.managers.length > 0 && (
                            <div className="col-span-2">
                              <span className="font-medium text-muted-foreground">Managers:</span>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {record.managers.map((manager, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {manager.name}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          {record.roleDescription && (
                            <div className="col-span-2">
                              <span className="font-medium text-muted-foreground">Role Description:</span>
                              <p className="mt-1 text-sm">{record.roleDescription}</p>
                            </div>
                          )}
                        </div>
                      </Card>
                    ))
                ) : (
                  <Card className="p-8 text-center">
                    <div className="text-muted-foreground">
                      <BriefcaseIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-medium mb-2">No Employment Records</h3>
                      <p className="text-sm mb-4">
                        Add employment records to track job history and current positions.
                      </p>
                      <Button
                        type="button"
                        className="gap-2"
                      >
                        <PlusIcon className="w-4 h-4" />
                        Add First Employment Record
                      </Button>
                    </div>
                  </Card>
                )}
              </div>
              
              {/* Employment Change History */}
              <Card className="p-6">
                <h3 className="text-lg font-medium mb-4">Employment Change History</h3>
                <div className="space-y-3">
                  {profile?.activities
                    ?.filter(activity => 
                      activity.type.includes('Employment') || 
                      activity.description.toLowerCase().includes('employment')
                    )
                    .slice(0, 10)
                    .map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3 py-2 border-b border-gray-100 last:border-0">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">{activity.description}</p>
                            <span className="text-xs text-muted-foreground">
                              {new Date(activity.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            by {activity.user} • {activity.type}
                          </p>
                        </div>
                      </div>
                    ))}
                  {(!profile?.activities || 
                    profile.activities.filter(activity => 
                      activity.type.includes('Employment') || 
                      activity.description.toLowerCase().includes('employment')
                    ).length === 0
                  ) && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No employment history available
                    </p>
                  )}
                </div>
              </Card>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Narrower */}
        <div className="col-span-5 space-y-6">
          {/* Current Location Card */}
          <Card className="bg-[#732cec] border-0 rounded-xl shadow-[0px_6px_18px_0px_#00000026]">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-white text-sm">Current location</p>
                  <p className="text-white font-semibold text-lg">Paris</p>
                </div>
              </div>
              <Badge className="bg-white/20 text-white border-0 text-xs">
                Business trip
              </Badge>
            </CardContent>
          </Card>

          {/* On Assignment Card */}
          <Card className="bg-[#00ceba] border-0 rounded-xl shadow-[0px_6px_18px_0px_#00000026]">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white text-sm">On assignment</p>
                  <p className="text-white font-semibold text-lg">Dublin</p>
                </div>
              </div>
              <p className="text-white/80 text-sm">Until May 2026</p>
            </CardContent>
          </Card>

          {/* Permanent Home Card */}
          <Card className="bg-[#f04e98] border-0 rounded-xl shadow-[0px_6px_18px_0px_#00000026]">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-white text-sm">Permanent home</p>
                  <p className="text-white font-semibold text-lg">Manchester</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Map Placeholder */}
          <Card className="bg-[#252E38] border-0 rounded-xl shadow-[0px_6px_18px_0px_#00000026] relative overflow-hidden">
            <CardContent className="p-0 h-48 relative">
              {/* Map background with grid pattern */}
              <div 
                className="absolute inset-0 bg-gray-700"
                style={{
                  backgroundImage: `url("${gridPatternSvg}")`,
                  backgroundSize: '20px 20px'
                }}
              >
              </div>
              
              {/* Location markers */}
              <div className="absolute top-1/4 left-1/3 w-3 h-3 bg-blue-600 rounded-full border-2 border-white shadow-lg"></div>
              <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-green-600 rounded-full border-2 border-white shadow-lg"></div>
              <div className="absolute bottom-1/3 right-1/3 w-3 h-3 bg-pink-600 rounded-full border-2 border-white shadow-lg"></div>
              
              {/* Expand button */}
              <Button
                size="sm"
                className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white border-0 p-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </Button>
            </CardContent>
          </Card>

          {/* Quick Contact Details Card */}
          <Card className="bg-[#252E38] border-0 rounded-xl shadow-[0px_6px_18px_0px_#00000026]">
            <CardHeader className="flex flex-row items-center justify-between p-6 pb-4">
              <CardTitle className="text-white text-lg font-medium">Quick Contact</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-[#2A3440] p-2"
              >
                <Edit2Icon className="w-4 h-4" />
                Edit
              </Button>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">Email</p>
                  <p className="text-gray-300 text-sm">{profile.contact?.workEmail || 'Not provided'}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">Phone</p>
                  <p className="text-gray-300 text-sm">{profile.contact?.workPhone || 'Not provided'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

    </div>
  );

  // Render different sections based on activeSection
  switch (activeSection) {
    case "details":
      return renderDetailsSection();
    case "location":
      return (
        renderLocationSection()
      );
    case "contact":
      return renderContactSection();
    case "work":
      return (
        <div className="flex-1 p-8 bg-[#1D252D] flex items-center justify-center">
          <p className="text-white text-lg">Work & Employment section coming soon...</p>
        </div>
      );
    case "family":
      return (
        <div className="flex-1 p-8 bg-[#1D252D] flex items-center justify-center">
          <p className="text-white text-lg">Family section coming soon...</p>
        </div>
      );
    case "legal":
      return (
        <div className="flex-1 p-8 bg-[#1D252D] flex items-center justify-center">
          <p className="text-white text-lg">Legal & Compliance section coming soon...</p>
        </div>
      );
    case "moves":
      return (
        <div className="flex-1 p-8 bg-[#1D252D] flex items-center justify-center">
          <p className="text-white text-lg">Moves section coming soon...</p>
        </div>
      );
    case "documents":
      return (
        <div className="flex-1 p-8 bg-[#1D252D] flex items-center justify-center">
          <p className="text-white text-lg">Documents section coming soon...</p>
        </div>
      );
    case "communication":
      return (
        <div className="flex-1 p-8 bg-[#1D252D] flex items-center justify-center">
          <p className="text-white text-lg">Communication section coming soon...</p>
        </div>
      );
    case "activity":
      return (
        <div className="flex-1 p-8 bg-[#1D252D] flex items-center justify-center">
          <p className="text-white text-lg">Activity section coming soon...</p>
        </div>
      );
    default:
      return (
        <div className="flex flex-col flex-1 bg-[#1D252D] overflow-y-auto">
          {renderDetailsSection()}
        </div>
      );
  }
};