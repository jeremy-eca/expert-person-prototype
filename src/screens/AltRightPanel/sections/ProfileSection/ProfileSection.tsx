import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import { Textarea } from "../../../../components/ui/textarea";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import { Edit2Icon, SaveIcon, XIcon, CameraIcon, UserIcon, SearchIcon, MapPinIcon, PlusIcon } from "lucide-react";
import { ProfileSectionType } from "../../AltRightPanel";
import { PersonProfile } from "../../../../types/frontend.types";

interface ProfileSectionProps {
  activeSection: ProfileSectionType;
  profile?: PersonProfile | null;
  onProfileUpdate?: (profile: PersonProfile) => void;
}

export const ProfileSection = ({ 
  activeSection, 
  profile,
  onProfileUpdate 
}: ProfileSectionProps): JSX.Element => {
  // Edit states for different sections
  const [editingCurrentAddress, setEditingCurrentAddress] = useState(false);
  const [editingPermanentAddress, setEditingPermanentAddress] = useState(false);
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  
  // Form states for address editing
  const [currentAddressForm, setCurrentAddressForm] = useState({
    line1: '',
    line2: '',
    city: '',
    state: '',
    postcode: '',
    country: ''
  });
  
  const [permanentAddressForm, setPermanentAddressForm] = useState({
    line1: '',
    line2: '',
    city: '',
    state: '',
    postcode: '',
    country: ''
  });

  // Add address form state
  const [addAddressForm, setAddAddressForm] = useState({
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

  // Google lookup states
  const [useGoogleLookup, setUseGoogleLookup] = useState(true);
  const [googleSearchTerm, setGoogleSearchTerm] = useState('');
  const [googleSuggestions, setGoogleSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Mock Google Places API suggestions
  const mockGoogleSuggestions = [
    {
      place_id: '1',
      description: '123 Main Street, Barcelona, Spain',
      structured_formatting: {
        main_text: '123 Main Street',
        secondary_text: 'Barcelona, Spain'
      },
      address_components: {
        line1: '123 Main Street',
        city: 'Barcelona',
        state: 'Catalonia',
        postcode: '08013',
        country: 'Spain'
      }
    },
    {
      place_id: '2',
      description: '456 Oak Avenue, Madrid, Spain',
      structured_formatting: {
        main_text: '456 Oak Avenue',
        secondary_text: 'Madrid, Spain'
      },
      address_components: {
        line1: '456 Oak Avenue',
        city: 'Madrid',
        state: 'Madrid',
        postcode: '28001',
        country: 'Spain'
      }
    },
    {
      place_id: '3',
      description: '789 Pine Road, Valencia, Spain',
      structured_formatting: {
        main_text: '789 Pine Road',
        secondary_text: 'Valencia, Spain'
      },
      address_components: {
        line1: '789 Pine Road',
        city: 'Valencia',
        state: 'Valencia',
        postcode: '46001',
        country: 'Spain'
      }
    }
  ];

  // Handle Google search
  const handleGoogleSearch = (searchTerm: string) => {
    setGoogleSearchTerm(searchTerm);
    if (searchTerm.length > 2) {
      // Filter mock suggestions based on search term
      const filtered = mockGoogleSuggestions.filter(suggestion =>
        suggestion.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setGoogleSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  // Handle Google suggestion selection
  const handleGoogleSuggestionSelect = (suggestion: any, formType: 'current' | 'permanent' | 'add') => {
    const addressData = {
      line1: suggestion.address_components.line1,
      line2: '',
      city: suggestion.address_components.city,
      state: suggestion.address_components.state,
      postcode: suggestion.address_components.postcode,
      country: suggestion.address_components.country
    };

    if (formType === 'current') {
      setCurrentAddressForm(addressData);
    } else if (formType === 'permanent') {
      setPermanentAddressForm(addressData);
    } else if (formType === 'add') {
      setAddAddressForm(prev => ({ ...prev, ...addressData }));
    }

    setGoogleSearchTerm(suggestion.description);
    setShowSuggestions(false);
  };

  // Initialize form data when editing starts
  const startEditingCurrentAddress = () => {
    if (profile?.currentLocation) {
      const addressParts = profile.currentLocation.address.split(', ');
      setCurrentAddressForm({
        line1: addressParts[0] || '',
        line2: addressParts[1] || '',
        city: addressParts[2] || '',
        state: addressParts[3] || '',
        postcode: addressParts[4] || '',
        country: addressParts[5] || ''
      });
    }
    setEditingCurrentAddress(true);
  };

  const startEditingPermanentAddress = () => {
    if (profile?.permanentHome) {
      const addressParts = profile.permanentHome.address.split(', ');
      setPermanentAddressForm({
        line1: addressParts[0] || '',
        line2: addressParts[1] || '',
        city: addressParts[2] || '',
        state: addressParts[3] || '',
        postcode: addressParts[4] || '',
        country: addressParts[5] || ''
      });
    }
    setEditingPermanentAddress(true);
  };

  // Save address changes
  const saveCurrentAddress = () => {
    if (!profile || !onProfileUpdate) return;
    
    const addressString = [
      currentAddressForm.line1,
      currentAddressForm.line2,
      currentAddressForm.city,
      currentAddressForm.state,
      currentAddressForm.postcode,
      currentAddressForm.country
    ].filter(Boolean).join(', ');

    const updatedProfile = {
      ...profile,
      currentLocation: {
        ...profile.currentLocation,
        address: addressString
      }
    };

    onProfileUpdate(updatedProfile);
    setEditingCurrentAddress(false);
  };

  const savePermanentAddress = () => {
    if (!profile || !onProfileUpdate) return;
    
    const addressString = [
      permanentAddressForm.line1,
      permanentAddressForm.line2,
      permanentAddressForm.city,
      permanentAddressForm.state,
      permanentAddressForm.postcode,
      permanentAddressForm.country
    ].filter(Boolean).join(', ');

    const updatedProfile = {
      ...profile,
      permanentHome: {
        ...profile.permanentHome,
        address: addressString,
        propertyType: profile.permanentHome?.propertyType || 'Owned'
      }
    };

    onProfileUpdate(updatedProfile);
    setEditingPermanentAddress(false);
  };

  // Add new address
  const saveNewAddress = () => {
    if (!profile || !onProfileUpdate) return;
    
    const addressString = [
      addAddressForm.line1,
      addAddressForm.line2,
      addAddressForm.city,
      addAddressForm.state,
      addAddressForm.postcode,
      addAddressForm.country
    ].filter(Boolean).join(', ');

    let updatedProfile = { ...profile };

    if (addAddressForm.type === 'current' || addAddressForm.setAsCurrent) {
      updatedProfile.currentLocation = {
        address: addressString,
        startDate: new Date().toISOString().split('T')[0],
        duration: '0 months'
      };
      
      // Add to location history
      const newHistoryItem = {
        date: new Date().toLocaleDateString(),
        location: addAddressForm.city,
        change: 'Moved to'
      };
      updatedProfile.locationHistory = [newHistoryItem, ...(profile.locationHistory || [])];
    }

    if (addAddressForm.type === 'permanent') {
      updatedProfile.permanentHome = {
        address: addressString,
        propertyType: 'Owned'
      };
    }

    onProfileUpdate(updatedProfile);
    setShowAddAddressModal(false);
    setAddAddressForm({
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
  };

  // Cancel editing
  const cancelCurrentAddressEdit = () => {
    setEditingCurrentAddress(false);
    setCurrentAddressForm({
      line1: '',
      line2: '',
      city: '',
      state: '',
      postcode: '',
      country: ''
    });
  };

  const cancelPermanentAddressEdit = () => {
    setEditingPermanentAddress(false);
    setPermanentAddressForm({
      line1: '',
      line2: '',
      city: '',
      state: '',
      postcode: '',
      country: ''
    });
  };

  const cancelAddAddress = () => {
    setShowAddAddressModal(false);
    setAddAddressForm({
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
  };

  // Check if form is valid
  const isCurrentAddressFormValid = currentAddressForm.line1 && currentAddressForm.city && currentAddressForm.state && currentAddressForm.postcode && currentAddressForm.country;
  const isPermanentAddressFormValid = permanentAddressForm.line1 && permanentAddressForm.city && permanentAddressForm.state && permanentAddressForm.postcode && permanentAddressForm.country;
  const isAddAddressFormValid = addAddressForm.line1 && addAddressForm.city && addAddressForm.state && addAddressForm.postcode && addAddressForm.country;

  const renderDetailsSection = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-sm font-medium text-gray-300 mb-2 block">Bio</label>
          <Textarea
            value={profile?.bio || ''}
            className="bg-[#1D252D] border-[#40505C] text-white min-h-[100px]"
            placeholder="Enter bio..."
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-300 mb-2 block">Date of Birth</label>
          <Input
            type="date"
            value={profile?.dateOfBirth || ''}
            className="bg-[#1D252D] border-[#40505C] text-white"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-sm font-medium text-gray-300 mb-2 block">Nationality</label>
          <Input
            value={profile?.nationality || ''}
            className="bg-[#1D252D] border-[#40505C] text-white"
            placeholder="Enter nationality..."
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-300 mb-2 block">Languages</label>
          <div className="flex flex-wrap gap-2">
            {profile?.languages?.map((lang, index) => (
              <Badge key={index} variant="secondary" className="bg-[#1D252D] text-gray-300">
                {lang}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderLocationSection = () => (
    <div className="space-y-6">
      {/* Current Location */}
      <Card className="bg-[#1D252D] border-[#40505C]">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <MapPinIcon className="w-5 h-5" />
            Current Location
          </CardTitle>
          {!editingCurrentAddress && (
            <Button
              variant="ghost"
              size="sm"
              onClick={startEditingCurrentAddress}
              className="text-gray-300 hover:text-white"
            >
              <Edit2Icon className="w-4 h-4" />
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {editingCurrentAddress ? (
            <div className="space-y-4">
              {/* Google/Manual Toggle */}
              <div className="flex items-center gap-4 mb-4">
                <Button
                  variant={useGoogleLookup ? "default" : "outline"}
                  size="sm"
                  onClick={() => setUseGoogleLookup(true)}
                  className="text-xs"
                >
                  Google Lookup
                </Button>
                <Button
                  variant={!useGoogleLookup ? "default" : "outline"}
                  size="sm"
                  onClick={() => setUseGoogleLookup(false)}
                  className="text-xs"
                >
                  Manual Entry
                </Button>
              </div>

              {useGoogleLookup && (
                <div className="relative">
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      value={googleSearchTerm}
                      onChange={(e) => handleGoogleSearch(e.target.value)}
                      placeholder="Search for an address..."
                      className="bg-[#2A3440] border-[#40505C] text-white pl-10"
                    />
                  </div>
                  
                  {showSuggestions && googleSuggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-[#2A3440] border border-[#40505C] rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {googleSuggestions.map((suggestion) => (
                        <div
                          key={suggestion.place_id}
                          className="px-4 py-3 hover:bg-[#1D252D] cursor-pointer border-b border-[#40505C] last:border-b-0"
                          onClick={() => handleGoogleSuggestionSelect(suggestion, 'current')}
                        >
                          <div className="text-white font-medium">
                            {suggestion.structured_formatting.main_text}
                          </div>
                          <div className="text-gray-400 text-sm">
                            {suggestion.structured_formatting.secondary_text}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-1 block">Address Line 1</label>
                  <Input
                    value={currentAddressForm.line1}
                    onChange={(e) => setCurrentAddressForm(prev => ({ ...prev, line1: e.target.value }))}
                    className="bg-[#2A3440] border-[#40505C] text-white"
                    placeholder="Street address"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-1 block">Address Line 2</label>
                  <Input
                    value={currentAddressForm.line2}
                    onChange={(e) => setCurrentAddressForm(prev => ({ ...prev, line2: e.target.value }))}
                    className="bg-[#2A3440] border-[#40505C] text-white"
                    placeholder="Apartment, suite, etc. (optional)"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-1 block">City</label>
                    <Input
                      value={currentAddressForm.city}
                      onChange={(e) => setCurrentAddressForm(prev => ({ ...prev, city: e.target.value }))}
                      className="bg-[#2A3440] border-[#40505C] text-white"
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-1 block">State</label>
                    <Input
                      value={currentAddressForm.state}
                      onChange={(e) => setCurrentAddressForm(prev => ({ ...prev, state: e.target.value }))}
                      className="bg-[#2A3440] border-[#40505C] text-white"
                      placeholder="State/Province"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-1 block">Postcode</label>
                    <Input
                      value={currentAddressForm.postcode}
                      onChange={(e) => setCurrentAddressForm(prev => ({ ...prev, postcode: e.target.value }))}
                      className="bg-[#2A3440] border-[#40505C] text-white"
                      placeholder="Postcode"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-1 block">Country</label>
                    <Input
                      value={currentAddressForm.country}
                      onChange={(e) => setCurrentAddressForm(prev => ({ ...prev, country: e.target.value }))}
                      className="bg-[#2A3440] border-[#40505C] text-white"
                      placeholder="Country"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={saveCurrentAddress}
                  disabled={!isCurrentAddressFormValid}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <SaveIcon className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button
                  variant="outline"
                  onClick={cancelCurrentAddressEdit}
                  className="border-[#40505C] text-gray-300 hover:text-white"
                >
                  <XIcon className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-gray-300">
              <p>{profile?.currentLocation?.address || 'No current location set'}</p>
              {profile?.currentLocation?.duration && (
                <p className="text-sm text-gray-400 mt-1">
                  Duration: {profile.currentLocation.duration}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Permanent Home */}
      <Card className="bg-[#1D252D] border-[#40505C]">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <UserIcon className="w-5 h-5" />
            Permanent Home
          </CardTitle>
          {!editingPermanentAddress && (
            <Button
              variant="ghost"
              size="sm"
              onClick={startEditingPermanentAddress}
              className="text-gray-300 hover:text-white"
            >
              <Edit2Icon className="w-4 h-4" />
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {editingPermanentAddress ? (
            <div className="space-y-4">
              {/* Google/Manual Toggle */}
              <div className="flex items-center gap-4 mb-4">
                <Button
                  variant={useGoogleLookup ? "default" : "outline"}
                  size="sm"
                  onClick={() => setUseGoogleLookup(true)}
                  className="text-xs"
                >
                  Google Lookup
                </Button>
                <Button
                  variant={!useGoogleLookup ? "default" : "outline"}
                  size="sm"
                  onClick={() => setUseGoogleLookup(false)}
                  className="text-xs"
                >
                  Manual Entry
                </Button>
              </div>

              {useGoogleLookup && (
                <div className="relative">
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      value={googleSearchTerm}
                      onChange={(e) => handleGoogleSearch(e.target.value)}
                      placeholder="Search for an address..."
                      className="bg-[#2A3440] border-[#40505C] text-white pl-10"
                    />
                  </div>
                  
                  {showSuggestions && googleSuggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-[#2A3440] border border-[#40505C] rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {googleSuggestions.map((suggestion) => (
                        <div
                          key={suggestion.place_id}
                          className="px-4 py-3 hover:bg-[#1D252D] cursor-pointer border-b border-[#40505C] last:border-b-0"
                          onClick={() => handleGoogleSuggestionSelect(suggestion, 'permanent')}
                        >
                          <div className="text-white font-medium">
                            {suggestion.structured_formatting.main_text}
                          </div>
                          <div className="text-gray-400 text-sm">
                            {suggestion.structured_formatting.secondary_text}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-1 block">Address Line 1</label>
                  <Input
                    value={permanentAddressForm.line1}
                    onChange={(e) => setPermanentAddressForm(prev => ({ ...prev, line1: e.target.value }))}
                    className="bg-[#2A3440] border-[#40505C] text-white"
                    placeholder="Street address"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-1 block">Address Line 2</label>
                  <Input
                    value={permanentAddressForm.line2}
                    onChange={(e) => setPermanentAddressForm(prev => ({ ...prev, line2: e.target.value }))}
                    className="bg-[#2A3440] border-[#40505C] text-white"
                    placeholder="Apartment, suite, etc. (optional)"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-1 block">City</label>
                    <Input
                      value={permanentAddressForm.city}
                      onChange={(e) => setPermanentAddressForm(prev => ({ ...prev, city: e.target.value }))}
                      className="bg-[#2A3440] border-[#40505C] text-white"
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-1 block">State</label>
                    <Input
                      value={permanentAddressForm.state}
                      onChange={(e) => setPermanentAddressForm(prev => ({ ...prev, state: e.target.value }))}
                      className="bg-[#2A3440] border-[#40505C] text-white"
                      placeholder="State/Province"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-1 block">Postcode</label>
                    <Input
                      value={permanentAddressForm.postcode}
                      onChange={(e) => setPermanentAddressForm(prev => ({ ...prev, postcode: e.target.value }))}
                      className="bg-[#2A3440] border-[#40505C] text-white"
                      placeholder="Postcode"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-1 block">Country</label>
                    <Input
                      value={permanentAddressForm.country}
                      onChange={(e) => setPermanentAddressForm(prev => ({ ...prev, country: e.target.value }))}
                      className="bg-[#2A3440] border-[#40505C] text-white"
                      placeholder="Country"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={savePermanentAddress}
                  disabled={!isPermanentAddressFormValid}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <SaveIcon className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button
                  variant="outline"
                  onClick={cancelPermanentAddressEdit}
                  className="border-[#40505C] text-gray-300 hover:text-white"
                >
                  <XIcon className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-gray-300">
              <p>{profile?.permanentHome?.address || 'No permanent home set'}</p>
              {profile?.permanentHome?.propertyType && (
                <p className="text-sm text-gray-400 mt-1">
                  Property Type: {profile.permanentHome.propertyType}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Location History */}
      <Card className="bg-[#1D252D] border-[#40505C]">
        <CardHeader>
          <CardTitle className="text-white">Location History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {profile?.locationHistory?.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-[#40505C] last:border-b-0">
                <div>
                  <p className="text-white font-medium">{item.location}</p>
                  <p className="text-gray-400 text-sm">{item.change}</p>
                </div>
                <p className="text-gray-400 text-sm">{item.date}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Floating Add Button */}
      <Button
        onClick={() => setShowAddAddressModal(true)}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-[#732cec] hover:bg-[#5a23b8] shadow-lg z-50"
        size="icon"
      >
        <PlusIcon className="w-6 h-6" />
      </Button>

      {/* Add Address Modal */}
      {showAddAddressModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1D252D] border border-[#40505C] rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Add New Address</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={cancelAddAddress}
                  className="text-gray-400 hover:text-white"
                >
                  <XIcon className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-4">
                {/* Address Type Selection */}
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Address Type</label>
                  <div className="flex gap-2">
                    <Button
                      variant={addAddressForm.type === 'current' ? "default" : "outline"}
                      size="sm"
                      onClick={() => setAddAddressForm(prev => ({ ...prev, type: 'current' }))}
                      className="text-xs"
                    >
                      Current Address
                    </Button>
                    <Button
                      variant={addAddressForm.type === 'permanent' ? "default" : "outline"}
                      size="sm"
                      onClick={() => setAddAddressForm(prev => ({ ...prev, type: 'permanent' }))}
                      className="text-xs"
                    >
                      Permanent Home
                    </Button>
                    <Button
                      variant={addAddressForm.type === 'other' ? "default" : "outline"}
                      size="sm"
                      onClick={() => setAddAddressForm(prev => ({ ...prev, type: 'other' }))}
                      className="text-xs"
                    >
                      Other Address
                    </Button>
                  </div>
                </div>

                {/* Address Name (Optional) */}
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-1 block">Address Name (Optional)</label>
                  <Input
                    value={addAddressForm.name}
                    onChange={(e) => setAddAddressForm(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-[#2A3440] border-[#40505C] text-white"
                    placeholder="e.g., Home, Work, Vacation Home"
                  />
                </div>

                {/* Google/Manual Toggle */}
                <div className="flex items-center gap-4">
                  <Button
                    variant={useGoogleLookup ? "default" : "outline"}
                    size="sm"
                    onClick={() => setUseGoogleLookup(true)}
                    className="text-xs"
                  >
                    Google Lookup
                  </Button>
                  <Button
                    variant={!useGoogleLookup ? "default" : "outline"}
                    size="sm"
                    onClick={() => setUseGoogleLookup(false)}
                    className="text-xs"
                  >
                    Manual Entry
                  </Button>
                </div>

                {/* Google Search */}
                {useGoogleLookup && (
                  <div className="relative">
                    <div className="relative">
                      <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        value={googleSearchTerm}
                        onChange={(e) => handleGoogleSearch(e.target.value)}
                        placeholder="Search for an address..."
                        className="bg-[#2A3440] border-[#40505C] text-white pl-10"
                      />
                    </div>
                    
                    {showSuggestions && googleSuggestions.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-[#2A3440] border border-[#40505C] rounded-md shadow-lg max-h-60 overflow-y-auto">
                        {googleSuggestions.map((suggestion) => (
                          <div
                            key={suggestion.place_id}
                            className="px-4 py-3 hover:bg-[#1D252D] cursor-pointer border-b border-[#40505C] last:border-b-0"
                            onClick={() => handleGoogleSuggestionSelect(suggestion, 'add')}
                          >
                            <div className="text-white font-medium">
                              {suggestion.structured_formatting.main_text}
                            </div>
                            <div className="text-gray-400 text-sm">
                              {suggestion.structured_formatting.secondary_text}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Address Form Fields */}
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-1 block">Address Line 1 *</label>
                    <Input
                      value={addAddressForm.line1}
                      onChange={(e) => setAddAddressForm(prev => ({ ...prev, line1: e.target.value }))}
                      className="bg-[#2A3440] border-[#40505C] text-white"
                      placeholder="Street address"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-1 block">Address Line 2</label>
                    <Input
                      value={addAddressForm.line2}
                      onChange={(e) => setAddAddressForm(prev => ({ ...prev, line2: e.target.value }))}
                      className="bg-[#2A3440] border-[#40505C] text-white"
                      placeholder="Apartment, suite, etc. (optional)"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-1 block">City *</label>
                      <Input
                        value={addAddressForm.city}
                        onChange={(e) => setAddAddressForm(prev => ({ ...prev, city: e.target.value }))}
                        className="bg-[#2A3440] border-[#40505C] text-white"
                        placeholder="City"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-1 block">State *</label>
                      <Input
                        value={addAddressForm.state}
                        onChange={(e) => setAddAddressForm(prev => ({ ...prev, state: e.target.value }))}
                        className="bg-[#2A3440] border-[#40505C] text-white"
                        placeholder="State/Province"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-1 block">Postcode *</label>
                      <Input
                        value={addAddressForm.postcode}
                        onChange={(e) => setAddAddressForm(prev => ({ ...prev, postcode: e.target.value }))}
                        className="bg-[#2A3440] border-[#40505C] text-white"
                        placeholder="Postcode"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-1 block">Country *</label>
                      <Input
                        value={addAddressForm.country}
                        onChange={(e) => setAddAddressForm(prev => ({ ...prev, country: e.target.value }))}
                        className="bg-[#2A3440] border-[#40505C] text-white"
                        placeholder="Country"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Set as Current Address (for Other type) */}
                {addAddressForm.type === 'other' && (
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="setAsCurrent"
                      checked={addAddressForm.setAsCurrent}
                      onChange={(e) => setAddAddressForm(prev => ({ ...prev, setAsCurrent: e.target.checked }))}
                      className="rounded border-[#40505C] bg-[#2A3440]"
                    />
                    <label htmlFor="setAsCurrent" className="text-sm text-gray-300">
                      Set as current address
                    </label>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={saveNewAddress}
                    disabled={!isAddAddressFormValid}
                    className="bg-green-600 hover:bg-green-700 flex-1"
                  >
                    <SaveIcon className="w-4 h-4 mr-2" />
                    Save Address
                  </Button>
                  <Button
                    variant="outline"
                    onClick={cancelAddAddress}
                    className="border-[#40505C] text-gray-300 hover:text-white flex-1"
                  >
                    <XIcon className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderWorkSection = () => (
    <div className="space-y-6">
      <Card className="bg-[#1D252D] border-[#40505C]">
        <CardHeader>
          <CardTitle className="text-white">Current Position</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Job Title</label>
              <Input
                value={profile?.currentPosition?.jobTitle || ''}
                className="bg-[#2A3440] border-[#40505C] text-white"
                placeholder="Enter job title..."
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Department</label>
              <Input
                value={profile?.currentPosition?.department || ''}
                className="bg-[#2A3440] border-[#40505C] text-white"
                placeholder="Enter department..."
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Start Date</label>
              <Input
                type="date"
                value={profile?.currentPosition?.startDate || ''}
                className="bg-[#2A3440] border-[#40505C] text-white"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Manager</label>
              <Input
                value={profile?.currentPosition?.manager || ''}
                className="bg-[#2A3440] border-[#40505C] text-white"
                placeholder="Enter manager name..."
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContactSection = () => (
    <div className="space-y-6">
      <Card className="bg-[#1D252D] border-[#40505C]">
        <CardHeader>
          <CardTitle className="text-white">Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Work Email</label>
              <Input
                type="email"
                value={profile?.contact?.workEmail || ''}
                className="bg-[#2A3440] border-[#40505C] text-white"
                placeholder="Enter work email..."
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Work Phone</label>
              <Input
                type="tel"
                value={profile?.contact?.workPhone || ''}
                className="bg-[#2A3440] border-[#40505C] text-white"
                placeholder="Enter work phone..."
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Personal Email</label>
              <Input
                type="email"
                value={profile?.contact?.personalEmail || ''}
                className="bg-[#2A3440] border-[#40505C] text-white"
                placeholder="Enter personal email..."
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">Mobile Phone</label>
              <Input
                type="tel"
                value={profile?.contact?.mobilePhone || ''}
                className="bg-[#2A3440] border-[#40505C] text-white"
                placeholder="Enter mobile phone..."
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderFamilySection = () => (
    <div className="space-y-6">
      <Card className="bg-[#1D252D] border-[#40505C]">
        <CardHeader>
          <CardTitle className="text-white">Family Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-white">{profile?.familySummary?.totalDependents || 0}</p>
              <p className="text-sm text-gray-400">Dependents</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{profile?.familySummary?.passportsHeld || 0}</p>
              <p className="text-sm text-gray-400">Passports</p>
            </div>
            <div>
              <p className="text-sm text-white">{profile?.familySummary?.maritalStatus || 'Unknown'}</p>
              <p className="text-sm text-gray-400">Status</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#1D252D] border-[#40505C]">
        <CardHeader>
          <CardTitle className="text-white">Family Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {profile?.familyMembers?.map((member, index) => (
              <div key={member.id} className="flex justify-between items-center p-3 bg-[#2A3440] rounded-lg">
                <div>
                  <p className="text-white font-medium">{member.name}</p>
                  <p className="text-gray-400 text-sm">{member.relationship}</p>
                </div>
                <div className="text-right">
                  <p className="text-white">{member.age ? `${member.age} years` : 'Age unknown'}</p>
                  {member.visaRequired && (
                    <Badge variant="secondary" className="bg-yellow-600 text-white text-xs">
                      Visa Required
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderLegalSection = () => (
    <div className="space-y-6">
      <Card className="bg-[#1D252D] border-[#40505C]">
        <CardHeader>
          <CardTitle className="text-white">Work Authorization</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {profile?.workAuthorization ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">Visa Type</label>
                <p className="text-white">{profile.workAuthorization.visaType}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">Status</label>
                <Badge className="bg-green-600 text-white">
                  {profile.workAuthorization.status}
                </Badge>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">Expiry Date</label>
                <p className="text-white">{profile.workAuthorization.expiryDate}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">Work Countries</label>
                <div className="flex flex-wrap gap-2">
                  {profile.workAuthorization.workCountries.map((country, index) => (
                    <Badge key={index} variant="secondary" className="bg-[#2A3440] text-gray-300">
                      {country}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-400">No work authorization information available</p>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderMovesSection = () => (
    <div className="space-y-6">
      <Card className="bg-[#1D252D] border-[#40505C]">
        <CardHeader>
          <CardTitle className="text-white">Moves & Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400">No moves or assignments recorded</p>
        </CardContent>
      </Card>
    </div>
  );

  const renderDocumentsSection = () => (
    <div className="space-y-6">
      <Card className="bg-[#1D252D] border-[#40505C]">
        <CardHeader>
          <CardTitle className="text-white">Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400">No documents uploaded</p>
        </CardContent>
      </Card>
    </div>
  );

  const renderCommunicationSection = () => (
    <div className="space-y-6">
      <Card className="bg-[#1D252D] border-[#40505C]">
        <CardHeader>
          <CardTitle className="text-white">Communication History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {profile?.communications?.map((comm, index) => (
              <div key={comm.id} className="p-3 bg-[#2A3440] rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-white font-medium">{comm.subject}</h4>
                  <Badge variant="secondary" className="bg-[#1D252D] text-gray-300">
                    {comm.type}
                  </Badge>
                </div>
                <p className="text-gray-400 text-sm mb-2">
                  {comm.date} at {comm.time}
                </p>
                <p className="text-gray-300 text-sm">
                  Participants: {comm.participants.join(', ')}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderActivitySection = () => (
    <div className="space-y-6">
      <Card className="bg-[#1D252D] border-[#40505C]">
        <CardHeader>
          <CardTitle className="text-white">Activity Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {profile?.activities?.map((activity, index) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 bg-[#2A3440] rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-white font-medium">{activity.description}</p>
                  <p className="text-gray-400 text-sm">
                    {activity.type} • {new Date(activity.timestamp).toLocaleDateString()} • {activity.user}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSection = () => {
    switch (activeSection) {
      case "details":
        return renderDetailsSection();
      case "location":
        return renderLocationSection();
      case "work":
        return renderWorkSection();
      case "contact":
        return renderContactSection();
      case "family":
        return renderFamilySection();
      case "legal":
        return renderLegalSection();
      case "moves":
        return renderMovesSection();
      case "documents":
        return renderDocumentsSection();
      case "communication":
        return renderCommunicationSection();
      case "activity":
        return renderActivitySection();
      default:
        return renderDetailsSection();
    }
  };

  return (
    <main className="flex-1 bg-[#252E38] p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        {renderSection()}
      </div>
    </main>
  );
};