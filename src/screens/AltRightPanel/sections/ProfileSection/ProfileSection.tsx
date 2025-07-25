import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Badge } from "../../../../components/ui/badge";
import { Separator } from "../../../../components/ui/separator";
import { PersonProfile } from "../../../../types/frontend.types";
import { ProfileSectionType } from "../../AltRightPanel";
import { 
  UserIcon, 
  MapPinIcon, 
  BriefcaseIcon, 
  PhoneIcon, 
  UsersIcon, 
  FileTextIcon,
  TruckIcon,
  FolderIcon,
  MessageSquareIcon,
  ActivityIcon,
  EditIcon,
  SaveIcon,
  PlusIcon
} from "lucide-react";

interface ProfileSectionProps {
  activeSection: ProfileSectionType;
  profile: PersonProfile | null;
  onProfileUpdate: (profile: PersonProfile) => void;
}

export const ProfileSection = ({ 
  activeSection, 
  profile,
  onProfileUpdate 
}: ProfileSectionProps): JSX.Element => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editedProfile, setEditedProfile] = React.useState<PersonProfile | null>(profile);

  React.useEffect(() => {
    setEditedProfile(profile);
  }, [profile]);

  const handleSave = () => {
    if (editedProfile) {
      onProfileUpdate(editedProfile);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const updateField = (field: string, value: any) => {
    if (editedProfile) {
      setEditedProfile({
        ...editedProfile,
        [field]: value
      });
    }
  };

  const updateNestedField = (section: string, field: string, value: any) => {
    if (editedProfile) {
      setEditedProfile({
        ...editedProfile,
        [section]: {
          ...(editedProfile as any)[section],
          [field]: value
        }
      });
    }
  };

  if (!profile) {
    return (
      <section className="flex flex-col items-end gap-8 pt-4 pb-0 px-6 relative flex-1 self-stretch grow bg-[#1D252D]">
        <div className="flex items-center justify-center h-64">
          <p className="text-white">No profile data available</p>
        </div>
      </section>
    );
  }

  const renderDetailsSection = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card 
          className="border-[#40505C] shadow-[0px_6px_18px_0px_#00000026]"
          style={{
            width: '291px',
            height: '371px',
            borderRadius: '12px',
            padding: '24px',
            gap: '24px',
            background: 'var(--neutral-layer-2, #252E38)',
            opacity: 1
          }}
        >
          <CardHeader className="p-0 pb-6">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2">
                <UserIcon className="h-5 w-5" />
                Personal Details
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
                className="text-white hover:bg-[#2A3440]"
              >
                {isEditing ? <SaveIcon className="h-4 w-4" /> : <EditIcon className="h-4 w-4" />}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0 space-y-4">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-white mb-1 block">Full Name</label>
                {isEditing ? (
                  <Input
                    value={editedProfile?.name || ''}
                    onChange={(e) => updateField('name', e.target.value)}
                    className="bg-[#1D252D] border-[#40505C] text-white"
                  />
                ) : (
                  <p className="text-white">{profile.name}</p>
                )}
              </div>
              
              <div>
                <label className="text-sm font-medium text-white mb-1 block">Date of Birth</label>
                {isEditing ? (
                  <Input
                    type="date"
                    value={editedProfile?.dateOfBirth || ''}
                    onChange={(e) => updateField('dateOfBirth', e.target.value)}
                    className="bg-[#1D252D] border-[#40505C] text-white"
                  />
                ) : (
                  <p className="text-white">{profile.dateOfBirth || 'Not specified'}</p>
                )}
              </div>
              
              <div>
                <label className="text-sm font-medium text-white mb-1 block">Nationality</label>
                {isEditing ? (
                  <Input
                    value={editedProfile?.nationality || ''}
                    onChange={(e) => updateField('nationality', e.target.value)}
                    className="bg-[#1D252D] border-[#40505C] text-white"
                  />
                ) : (
                  <p className="text-white">{profile.nationality || 'Not specified'}</p>
                )}
              </div>
              
              <div>
                <label className="text-sm font-medium text-white mb-1 block">Languages</label>
                <div className="flex flex-wrap gap-2">
                  {profile.languages?.map((lang, index) => (
                    <Badge key={index} variant="secondary" className="bg-[#1D252D] text-white border-[#40505C]">
                      {lang}
                    </Badge>
                  )) || <span className="text-white">None specified</span>}
                </div>
              </div>
              
              {profile.bio && (
                <div>
                  <label className="text-sm font-medium text-white mb-1 block">Bio</label>
                  <p className="text-white text-sm">{profile.bio}</p>
                </div>
              )}
            </div>
            
            {isEditing && (
              <div className="flex gap-2 pt-4">
                <Button onClick={handleSave} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                  Save Changes
                </Button>
                <Button onClick={handleCancel} variant="outline" size="sm" className="border-[#40505C] text-white hover:bg-[#2A3440]">
                  Cancel
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderLocationSection = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-[#252E38] border-[#40505C] shadow-[0px_6px_18px_0px_#00000026]" style={{ borderRadius: '12px', padding: '24px' }}>
        <CardHeader className="p-0 pb-6">
          <CardTitle className="text-white flex items-center gap-2">
            <MapPinIcon className="h-5 w-5" />
            Current Location
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 space-y-3">
          <p className="text-white">{profile.currentLocation?.address || 'Not specified'}</p>
          {profile.currentLocation?.duration && (
            <p className="text-gray-300 text-sm">Duration: {profile.currentLocation.duration}</p>
          )}
        </CardContent>
      </Card>
      
      <Card className="bg-[#252E38] border-[#40505C] shadow-[0px_6px_18px_0px_#00000026]" style={{ borderRadius: '12px', padding: '24px' }}>
        <CardHeader className="p-0 pb-6">
          <CardTitle className="text-white flex items-center gap-2">
            <MapPinIcon className="h-5 w-5" />
            Permanent Home
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 space-y-3">
          <p className="text-white">{profile.permanentHome?.address || 'Not specified'}</p>
          {profile.permanentHome?.propertyType && (
            <Badge variant="outline" className="bg-[#1D252D] text-white border-[#40505C]">
              {profile.permanentHome.propertyType}
            </Badge>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderWorkSection = () => (
    <div className="space-y-6">
      <Card className="bg-[#252E38] border-[#40505C] shadow-[0px_6px_18px_0px_#00000026]" style={{ borderRadius: '12px', padding: '24px' }}>
        <CardHeader className="p-0 pb-6">
          <CardTitle className="text-white flex items-center gap-2">
            <BriefcaseIcon className="h-5 w-5" />
            Current Position
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 space-y-3">
          {profile.currentPosition ? (
            <>
              <div>
                <label className="text-sm font-medium text-gray-300">Job Title</label>
                <p className="text-white">{profile.currentPosition.jobTitle}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Department</label>
                <p className="text-white">{profile.currentPosition.department}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Manager</label>
                <p className="text-white">{profile.currentPosition.manager}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Employment Type</label>
                <Badge variant="secondary" className="bg-[#1D252D] text-white border-[#40505C]">
                  {profile.currentPosition.employmentType}
                </Badge>
              </div>
            </>
          ) : (
            <p className="text-white">No current position information</p>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderContactSection = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-[#252E38] border-[#40505C] shadow-[0px_6px_18px_0px_#00000026]" style={{ borderRadius: '12px', padding: '24px' }}>
        <CardHeader className="p-0 pb-6">
          <CardTitle className="text-white flex items-center gap-2">
            <PhoneIcon className="h-5 w-5" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 space-y-3">
          {profile.contact ? (
            <>
              <div>
                <label className="text-sm font-medium text-gray-300">Work Email</label>
                <p className="text-white">{profile.contact.workEmail}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Work Phone</label>
                <p className="text-white">{profile.contact.workPhone}</p>
              </div>
              {profile.contact.personalEmail && (
                <div>
                  <label className="text-sm font-medium text-gray-300">Personal Email</label>
                  <p className="text-white">{profile.contact.personalEmail}</p>
                </div>
              )}
              {profile.contact.mobilePhone && (
                <div>
                  <label className="text-sm font-medium text-gray-300">Mobile Phone</label>
                  <p className="text-white">{profile.contact.mobilePhone}</p>
                </div>
              )}
            </>
          ) : (
            <p className="text-white">No contact information available</p>
          )}
        </CardContent>
      </Card>
      
      {profile.emergencyContact && (
        <Card className="bg-[#252E38] border-[#40505C] shadow-[0px_6px_18px_0px_#00000026]" style={{ borderRadius: '12px', padding: '24px' }}>
          <CardHeader className="p-0 pb-6">
            <CardTitle className="text-white flex items-center gap-2">
              <PhoneIcon className="h-5 w-5" />
              Emergency Contact
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-300">Name</label>
              <p className="text-white">{profile.emergencyContact.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300">Relationship</label>
              <p className="text-white">{profile.emergencyContact.relationship}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300">Phone</label>
              <p className="text-white">{profile.emergencyContact.phone}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderFamilySection = () => (
    <div className="space-y-6">
      <Card className="bg-[#252E38] border-[#40505C] shadow-[0px_6px_18px_0px_#00000026]" style={{ borderRadius: '12px', padding: '24px' }}>
        <CardHeader className="p-0 pb-6">
          <CardTitle className="text-white flex items-center gap-2">
            <UsersIcon className="h-5 w-5" />
            Family Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 space-y-3">
          {profile.familySummary && (
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-300">Marital Status</label>
                <p className="text-white">{profile.familySummary.maritalStatus}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Dependents</label>
                <p className="text-white">{profile.familySummary.totalDependents}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Passports</label>
                <p className="text-white">{profile.familySummary.passportsHeld}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {profile.familyMembers && profile.familyMembers.length > 0 && (
        <Card className="bg-[#252E38] border-[#40505C] shadow-[0px_6px_18px_0px_#00000026]" style={{ borderRadius: '12px', padding: '24px' }}>
          <CardHeader className="p-0 pb-6">
            <CardTitle className="text-white flex items-center gap-2">
              <UsersIcon className="h-5 w-5" />
              Family Members
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 space-y-4">
            {profile.familyMembers.map((member, index) => (
              <div key={member.id} className="border-b border-[#40505C] pb-3 last:border-b-0">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-white font-medium">{member.name}</p>
                    <p className="text-gray-300 text-sm">{member.relationship}</p>
                    {member.age && <p className="text-gray-300 text-sm">Age: {member.age}</p>}
                  </div>
                  {member.visaRequired && (
                    <Badge variant="outline" className="bg-[#1D252D] text-white border-[#40505C]">
                      Visa Required
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderPlaceholderSection = (title: string, icon: React.ReactNode) => (
    <Card className="bg-[#252E38] border-[#40505C] shadow-[0px_6px_18px_0px_#00000026]" style={{ borderRadius: '12px', padding: '24px' }}>
      <CardHeader className="p-0 pb-6">
        <CardTitle className="text-white flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <p className="text-gray-300">This section is under development.</p>
      </CardContent>
    </Card>
  );

  const renderSectionContent = () => {
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
        return renderPlaceholderSection("Legal & Compliance", <FileTextIcon className="h-5 w-5" />);
      case "moves":
        return renderPlaceholderSection("Moves", <TruckIcon className="h-5 w-5" />);
      case "documents":
        return renderPlaceholderSection("Documents", <FolderIcon className="h-5 w-5" />);
      case "communication":
        return renderPlaceholderSection("Communication", <MessageSquareIcon className="h-5 w-5" />);
      case "activity":
        return renderPlaceholderSection("Activity", <ActivityIcon className="h-5 w-5" />);
      default:
        return renderDetailsSection();
    }
  };

  return (
    <section className="flex flex-col items-end gap-8 pt-4 pb-0 px-6 relative flex-1 self-stretch grow bg-[#1D252D]">
      <div className="flex flex-col gap-6 w-full">
        {renderSectionContent()}
      </div>
    </section>
  );
};