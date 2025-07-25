import React, { useState } from "react";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Textarea } from "../../../../components/ui/textarea";
import { Badge } from "../../../../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { ProfileSectionType } from "../../AltRightPanel";
import { PersonProfile } from "../../../../types/frontend.types";
import { PlusIcon, XIcon } from "lucide-react";

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
  const [isEditing, setIsEditing] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedProficiency, setSelectedProficiency] = useState("");

  const availableLanguages = [
    "English", "Spanish", "French", "German", "Italian", "Portuguese", 
    "Mandarin", "Japanese", "Korean", "Arabic", "Russian", "Dutch",
    "Swedish", "Norwegian", "Danish", "Finnish", "Polish", "Czech"
  ];

  const proficiencyLevels = [
    { value: "basic", label: "Basic" },
    { value: "conversational", label: "Conversational" },
    { value: "professional", label: "Professional" },
    { value: "native", label: "Native" }
  ];

  const handleAddLanguage = () => {
    if (!selectedLanguage || !selectedProficiency || !profile || !onProfileUpdate) return;

    const languageWithProficiency = `${selectedLanguage} (${proficiencyLevels.find(p => p.value === selectedProficiency)?.label})`;
    
    const updatedLanguages = [...(profile.languages || []), languageWithProficiency];
    
    onProfileUpdate({
      ...profile,
      languages: updatedLanguages
    });

    setSelectedLanguage("");
    setSelectedProficiency("");
    setShowLanguageModal(false);
  };

  const handleRemoveLanguage = (languageToRemove: string) => {
    if (!profile || !onProfileUpdate) return;

    const updatedLanguages = profile.languages?.filter(lang => lang !== languageToRemove) || [];
    
    onProfileUpdate({
      ...profile,
      languages: updatedLanguages
    });
  };

  const renderDetailsSection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Personal Details</h2>
        <Button
          variant="outline"
          onClick={() => setIsEditing(!isEditing)}
          className="border-gray-600 text-gray-300 hover:bg-gray-700"
        >
          {isEditing ? "Save" : "Edit"}
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Bio
          </label>
          {isEditing ? (
            <Textarea
              value={profile?.bio || ""}
              onChange={(e) => onProfileUpdate?.({
                ...profile!,
                bio: e.target.value
              })}
              className="bg-gray-800 border-gray-600 text-white"
              rows={3}
            />
          ) : (
            <p className="text-gray-300">{profile?.bio || "No bio available"}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Date of Birth
          </label>
          {isEditing ? (
            <Input
              type="date"
              value={profile?.dateOfBirth || ""}
              onChange={(e) => onProfileUpdate?.({
                ...profile!,
                dateOfBirth: e.target.value
              })}
              className="bg-gray-800 border-gray-600 text-white"
            />
          ) : (
            <p className="text-gray-300">{profile?.dateOfBirth || "Not specified"}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Nationality
          </label>
          {isEditing ? (
            <Input
              value={profile?.nationality || ""}
              onChange={(e) => onProfileUpdate?.({
                ...profile!,
                nationality: e.target.value
              })}
              className="bg-gray-800 border-gray-600 text-white"
            />
          ) : (
            <p className="text-gray-300">{profile?.nationality || "Not specified"}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Languages
          </label>
          {isEditing ? (
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  value={profile?.languages?.join(", ") || ""}
                  readOnly
                  placeholder="No languages added"
                  className="bg-gray-800 border-gray-600 text-white flex-1 h-[52px]"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowLanguageModal(true)}
                  className="h-[52px] w-[52px] border-2 border-dashed border-gray-500 hover:border-gray-400 bg-transparent"
                >
                  <PlusIcon className="h-5 w-5 text-gray-400" />
                </Button>
              </div>
              
              {profile?.languages && profile.languages.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {profile.languages.map((language, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-blue-600 text-white hover:bg-blue-700 pr-1"
                    >
                      {language}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveLanguage(language)}
                        className="ml-1 h-4 w-4 p-0 hover:bg-blue-700"
                      >
                        <XIcon className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {profile?.languages && profile.languages.length > 0 ? (
                profile.languages.map((language, index) => (
                  <Badge key={index} variant="secondary" className="bg-blue-600 text-white">
                    {language}
                  </Badge>
                ))
              ) : (
                <p className="text-gray-300">No languages specified</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Language Modal */}
      {showLanguageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-96 max-w-md">
            <h3 className="text-lg font-semibold text-white mb-4">Add Language</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Language
                </label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full bg-gray-700 border-gray-600 text-white rounded-md p-2"
                >
                  <option value="">Select a language</option>
                  {availableLanguages
                    .filter(lang => !profile?.languages?.some(existing => existing.startsWith(lang)))
                    .map(lang => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))
                  }
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Proficiency
                </label>
                <select
                  value={selectedProficiency}
                  onChange={(e) => setSelectedProficiency(e.target.value)}
                  className="w-full bg-gray-700 border-gray-600 text-white rounded-md p-2"
                >
                  <option value="">Select proficiency</option>
                  {proficiencyLevels.map(level => (
                    <option key={level.value} value={level.value}>{level.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <Button
                onClick={handleAddLanguage}
                disabled={!selectedLanguage || !selectedProficiency}
                className="flex-1"
              >
                Add Language
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowLanguageModal(false);
                  setSelectedLanguage("");
                  setSelectedProficiency("");
                }}
                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderLocationSection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Location Information</h2>
        <Button
          variant="outline"
          onClick={() => setIsEditing(!isEditing)}
          className="border-gray-600 text-gray-300 hover:bg-gray-700"
        >
          {isEditing ? "Save" : "Edit"}
        </Button>
      </div>

      <div className="space-y-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Current Location</CardTitle>
          </CardHeader>
          <CardContent>
            {profile?.currentLocation ? (
              <div className="space-y-2">
                <p className="text-gray-300">{profile.currentLocation.address}</p>
                {profile.currentLocation.duration && (
                  <p className="text-sm text-gray-400">Duration: {profile.currentLocation.duration}</p>
                )}
              </div>
            ) : (
              <p className="text-gray-400">No current location specified</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Permanent Home</CardTitle>
          </CardHeader>
          <CardContent>
            {profile?.permanentHome ? (
              <div className="space-y-2">
                <p className="text-gray-300">{profile.permanentHome.address}</p>
                {profile.permanentHome.propertyType && (
                  <p className="text-sm text-gray-400">Property: {profile.permanentHome.propertyType}</p>
                )}
              </div>
            ) : (
              <p className="text-gray-400">No permanent home specified</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderWorkSection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Work & Employment</h2>
        <Button
          variant="outline"
          onClick={() => setIsEditing(!isEditing)}
          className="border-gray-600 text-gray-300 hover:bg-gray-700"
        >
          {isEditing ? "Save" : "Edit"}
        </Button>
      </div>

      <div className="space-y-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Current Position</CardTitle>
          </CardHeader>
          <CardContent>
            {profile?.currentPosition ? (
              <div className="space-y-2">
                <p className="text-gray-300 font-medium">{profile.currentPosition.jobTitle}</p>
                <p className="text-gray-400">{profile.currentPosition.department}</p>
                <p className="text-sm text-gray-400">Manager: {profile.currentPosition.manager}</p>
                <p className="text-sm text-gray-400">Start Date: {profile.currentPosition.startDate}</p>
              </div>
            ) : (
              <p className="text-gray-400">No current position specified</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderContactSection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Contact Information</h2>
        <Button
          variant="outline"
          onClick={() => setIsEditing(!isEditing)}
          className="border-gray-600 text-gray-300 hover:bg-gray-700"
        >
          {isEditing ? "Save" : "Edit"}
        </Button>
      </div>

      <div className="space-y-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Contact Details</CardTitle>
          </CardHeader>
          <CardContent>
            {profile?.contact ? (
              <div className="space-y-2">
                <p className="text-gray-300">Work Email: {profile.contact.workEmail}</p>
                <p className="text-gray-300">Work Phone: {profile.contact.workPhone}</p>
                {profile.contact.personalEmail && (
                  <p className="text-gray-300">Personal Email: {profile.contact.personalEmail}</p>
                )}
                {profile.contact.mobilePhone && (
                  <p className="text-gray-300">Mobile: {profile.contact.mobilePhone}</p>
                )}
              </div>
            ) : (
              <p className="text-gray-400">No contact information specified</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderFamilySection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Family Information</h2>
        <Button
          variant="outline"
          onClick={() => setIsEditing(!isEditing)}
          className="border-gray-600 text-gray-300 hover:bg-gray-700"
        >
          {isEditing ? "Save" : "Edit"}
        </Button>
      </div>

      <div className="space-y-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Family Summary</CardTitle>
          </CardHeader>
          <CardContent>
            {profile?.familySummary ? (
              <div className="space-y-2">
                <p className="text-gray-300">Marital Status: {profile.familySummary.maritalStatus}</p>
                <p className="text-gray-300">Total Dependents: {profile.familySummary.totalDependents}</p>
                <p className="text-gray-300">Passports Held: {profile.familySummary.passportsHeld}</p>
              </div>
            ) : (
              <p className="text-gray-400">No family information specified</p>
            )}
          </CardContent>
        </Card>

        {profile?.familyMembers && profile.familyMembers.length > 0 && (
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Family Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {profile.familyMembers.map((member, index) => (
                  <div key={index} className="border-b border-gray-700 pb-2 last:border-b-0">
                    <p className="text-gray-300 font-medium">{member.name}</p>
                    <p className="text-sm text-gray-400">Relationship: {member.relationship}</p>
                    {member.age && <p className="text-sm text-gray-400">Age: {member.age}</p>}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );

  const renderLegalSection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Legal & Compliance</h2>
        <Button
          variant="outline"
          onClick={() => setIsEditing(!isEditing)}
          className="border-gray-600 text-gray-300 hover:bg-gray-700"
        >
          {isEditing ? "Save" : "Edit"}
        </Button>
      </div>

      <div className="space-y-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Work Authorization</CardTitle>
          </CardHeader>
          <CardContent>
            {profile?.workAuthorization ? (
              <div className="space-y-2">
                <p className="text-gray-300">Visa Type: {profile.workAuthorization.visaType}</p>
                <p className="text-gray-300">Status: {profile.workAuthorization.status}</p>
                <p className="text-gray-300">Expiry Date: {profile.workAuthorization.expiryDate}</p>
                <p className="text-gray-300">Work Countries: {profile.workAuthorization.workCountries.join(", ")}</p>
              </div>
            ) : (
              <p className="text-gray-400">No work authorization information specified</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderMovesSection = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white">Moves & Assignments</h2>
      <p className="text-gray-400">Move information will be integrated with Case Management system.</p>
    </div>
  );

  const renderDocumentsSection = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white">Documents</h2>
      <p className="text-gray-400">Document management will be integrated with Document API.</p>
    </div>
  );

  const renderCommunicationSection = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white">Communication History</h2>
      {profile?.communications && profile.communications.length > 0 ? (
        <div className="space-y-3">
          {profile.communications.map((comm, index) => (
            <Card key={index} className="bg-gray-800 border-gray-700">
              <CardContent className="pt-4">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-gray-300 font-medium">{comm.subject}</p>
                  <Badge variant="secondary">{comm.type}</Badge>
                </div>
                <p className="text-sm text-gray-400">{comm.date} at {comm.time}</p>
                <p className="text-sm text-gray-400">Participants: {comm.participants.join(", ")}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-gray-400">No communication history available</p>
      )}
    </div>
  );

  const renderActivitySection = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white">Activity Timeline</h2>
      {profile?.activities && profile.activities.length > 0 ? (
        <div className="space-y-3">
          {profile.activities.map((activity, index) => (
            <Card key={index} className="bg-gray-800 border-gray-700">
              <CardContent className="pt-4">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-gray-300 font-medium">{activity.description}</p>
                  <Badge variant="outline">{activity.type}</Badge>
                </div>
                <p className="text-sm text-gray-400">
                  {new Date(activity.timestamp).toLocaleString()} by {activity.user}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-gray-400">No activity history available</p>
      )}
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
    <main className="flex-1 p-6 bg-[#1D252D] text-white overflow-y-auto">
      {renderSection()}
    </main>
  );
};