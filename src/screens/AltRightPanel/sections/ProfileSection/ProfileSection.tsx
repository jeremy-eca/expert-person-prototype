import React, { useState } from "react";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import { Textarea } from "../../../../components/ui/textarea";
import { Badge } from "../../../../components/ui/badge";
import { Edit2Icon, SaveIcon, XIcon, CameraIcon, UserIcon } from "lucide-react";
import { ProfileSectionType } from "../../AltRightPanel";
import { PersonProfile } from "../../../../types/frontend.types";

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

  // Temporary edit values
  const [editBio, setEditBio] = useState(profile.bio || "");
  const [editLanguages, setEditLanguages] = useState(profile.languages?.join(", ") || "");
  const [editNationalities, setEditNationalities] = useState(profile.nationalities?.join(", ") || "");
  const [editFirstName, setEditFirstName] = useState(profile.name.split(" ")[0] || "");
  const [editLastName, setEditLastName] = useState(profile.name.split(" ").slice(1).join(" ") || "");
  const [editDateOfBirth, setEditDateOfBirth] = useState(profile.dateOfBirth || "");

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
      languages: editLanguages.split(",").map(lang => lang.trim()).filter(Boolean),
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
                      {(profile.languages || ["English (Native)", "Mandarin (Professional)", "Spanish (Conversational)"]).map((language, index) => (
                        <Badge key={index} variant="secondary" className="bg-[#2A3440] text-white border-0 text-xs">
                          {language.includes('(') ? language : `${language} (Fluent)`}
                        </Badge>
                      ))}
                    </div>
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
                    <label className="text-white text-sm font-medium mb-2 block">Languages with proficiency (e.g., English (Native), Spanish (Conversational))</label>
                    <Input
                      value={editLanguages}
                      onChange={(e) => setEditLanguages(e.target.value)}
                      className="bg-[#2A3440] border-[#40505C] text-white placeholder:text-gray-400"
                      placeholder="English (Native), Spanish (Conversational), French (Basic)"
                    />
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

          {/* Map Placeholder */}
          <div className="bg-[#252E38] rounded-xl shadow-[0px_6px_18px_0px_#00000026] overflow-hidden">
            <div className="h-64 bg-gradient-to-br from-blue-400 to-green-400 relative">
              <div className={`absolute inset-0 bg-[url('${gridPatternSvg}')] opacity-20`}></div>
              
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
            </div>
          </div>
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
        <div className="flex-1 p-8 bg-[#1D252D] flex items-center justify-center">
          <p className="text-white text-lg">Location section coming soon...</p>
        </div>
      );
    case "work":
      return (
        <div className="flex-1 p-8 bg-[#1D252D] flex items-center justify-center">
          <p className="text-white text-lg">Work & Employment section coming soon...</p>
        </div>
      );
    case "contact":
      return (
        <div className="flex-1 p-8 bg-[#1D252D] flex items-center justify-center">
          <p className="text-white text-lg">Contact section coming soon...</p>
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
      return renderDetailsSection();
  }
};