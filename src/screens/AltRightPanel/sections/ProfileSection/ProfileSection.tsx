import React, { useState } from "react";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Textarea } from "../../../../components/ui/textarea";
import { Badge } from "../../../../components/ui/badge";
import { Edit2, Save, X, Camera, User, Search, MapPin, Plus, Trash2 } from "lucide-react";
import { ProfileSectionType } from "../../AltRightPanel";
import { PersonProfile } from "../../../../types/frontend.types";
import { LanguageModal } from "./components/LanguageModal";

interface ProfileSectionProps {
  activeSection: ProfileSectionType;
  profile: PersonProfile;
  onProfileUpdate: (updatedProfile: PersonProfile) => void;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({
  activeSection,
  profile,
  onProfileUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<PersonProfile>(profile);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedProfile(profile);
  };

  const handleSave = () => {
    onProfileUpdate(editedProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof PersonProfile, value: any) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddLanguage = (language: string, proficiency: string) => {
    const newLanguage = { language, proficiency };
    const updatedLanguages = [...(editedProfile.languages || []), newLanguage];
    handleInputChange('languages', updatedLanguages);
  };

  const handleRemoveLanguage = (index: number) => {
    const updatedLanguages = editedProfile.languages?.filter((_, i) => i !== index) || [];
    handleInputChange('languages', updatedLanguages);
  };

  return (
    <div className="p-6 bg-[#252E38] text-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Profile</h2>
        {!isEditing ? (
          <Button
            onClick={handleEdit}
            variant="outline"
            size="sm"
            className="bg-transparent border-gray-600 text-white hover:bg-gray-700"
          >
            <Edit2 className="w-4 h-4 mr-2" />
            Edit
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button
              onClick={handleCancel}
              variant="outline"
              size="sm"
              className="bg-transparent border-gray-600 text-white hover:bg-gray-700"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* Profile Picture */}
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 bg-gray-600 rounded-full flex items-center justify-center">
            {profile.profilePicture ? (
              <img
                src={profile.profilePicture}
                alt="Profile"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User className="w-8 h-8 text-gray-400" />
            )}
          </div>
          {isEditing && (
            <Button
              variant="outline"
              size="sm"
              className="bg-transparent border-gray-600 text-white hover:bg-gray-700"
            >
              <Camera className="w-4 h-4 mr-2" />
              Change Photo
            </Button>
          )}
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">First Name</label>
            {isEditing ? (
              <Input
                value={editedProfile.firstName || ''}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className="bg-[#1D252D] border-gray-600 text-white"
              />
            ) : (
              <p className="text-gray-300">{profile.firstName || 'Not specified'}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Last Name</label>
            {isEditing ? (
              <Input
                value={editedProfile.lastName || ''}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className="bg-[#1D252D] border-gray-600 text-white"
              />
            ) : (
              <p className="text-gray-300">{profile.lastName || 'Not specified'}</p>
            )}
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          {isEditing ? (
            <Input
              type="email"
              value={editedProfile.email || ''}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="bg-[#1D252D] border-gray-600 text-white"
            />
          ) : (
            <p className="text-gray-300">{profile.email || 'Not specified'}</p>
          )}
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium mb-2">
            <MapPin className="w-4 h-4 inline mr-1" />
            Location
          </label>
          {isEditing ? (
            <Input
              value={editedProfile.location || ''}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="bg-[#1D252D] border-gray-600 text-white"
              placeholder="City, Country"
            />
          ) : (
            <p className="text-gray-300">{profile.location || 'Not specified'}</p>
          )}
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium mb-2">Bio</label>
          {isEditing ? (
            <Textarea
              value={editedProfile.bio || ''}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              className="bg-[#1D252D] border-gray-600 text-white"
              rows={4}
              placeholder="Tell us about yourself..."
            />
          ) : (
            <p className="text-gray-300">{profile.bio || 'No bio available'}</p>
          )}
        </div>

        {/* Languages */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="block text-sm font-medium">Languages</label>
            {isEditing && (
              <Button
                onClick={() => setIsLanguageModalOpen(true)}
                size="sm"
                variant="outline"
                className="bg-transparent border-gray-600 text-white hover:bg-gray-700"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Language
              </Button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {editedProfile.languages && editedProfile.languages.length > 0 ? (
              editedProfile.languages.map((lang, index) => (
                <div
                  key={index}
                  className="flex items-center bg-[#1D252D] px-3 py-1 rounded-full text-sm"
                >
                  <span className="text-white">
                    {lang.language} ({lang.proficiency})
                  </span>
                  {isEditing && (
                    <button
                      onClick={() => handleRemoveLanguage(index)}
                      className="ml-2 text-gray-400 hover:text-red-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm">No languages specified</p>
            )}
          </div>
        </div>
      </div>

      {/* Language Modal */}
      <LanguageModal
        isOpen={isLanguageModalOpen}
        onClose={() => setIsLanguageModalOpen(false)}
        onAddLanguage={handleAddLanguage}
      />
    </div>
  );
};