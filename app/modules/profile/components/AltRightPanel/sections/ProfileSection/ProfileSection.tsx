import {
  ArrowUpRightIcon,
  BellIcon,
  CalendarIcon,
  ClockIcon,
  DownloadIcon,
  EditIcon,
  EyeIcon,
  FileTextIcon,
  FilterIcon,
  MailIcon,
  MapPinIcon,
  MessageSquareIcon,
  MoveIcon,
  PhoneIcon,
  PencilIcon,
  PlusIcon,
  SaveIcon,
  SearchIcon,
  SettingsIcon,
  SortAscIcon,
  TrashIcon,
  UserIcon,
  UserPlusIcon,
  XIcon,
} from "lucide-react";
import React, { useState } from "react";
import { ProfileSectionType } from "../../AltRightPanel";
import { Avatar } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "~/components/ui/breadcrumb";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";

import { PersonProfile } from "../../../../types/frontend.types";

interface ProfileSectionProps {
  activeSection: ProfileSectionType;
  profile?: PersonProfile | null;
}

export const ProfileSection = ({ activeSection, profile }: ProfileSectionProps): JSX.Element => {
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioText, setBioText] = useState(
    profile?.bio || 
    "Hannah is a senior product manager with over 8 years of experience in tech. " +
    "She specializes in user experience design and has led multiple successful " +
    "product launches. Hannah is passionate about creating products that make a " +
    "real difference in people's lives."
  );
  const [tempBioText, setTempBioText] = useState(bioText);

  // Update bio when profile changes
  React.useEffect(() => {
    if (profile?.bio) {
      setBioText(profile.bio);
    }
  }, [profile?.bio]);

  const handleEditBio = () => {
    setIsEditingBio(true);
    setTempBioText(bioText);
  };

  const handleSaveBio = () => {
    setBioText(tempBioText);
    setIsEditingBio(false);
  };

  const handleCancelBio = () => {
    setTempBioText(bioText);
    setIsEditingBio(false);
  };

  const renderDetailsContent = () => (
    <div className="flex flex-col gap-6 w-full">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#" className="text-muted-foreground font-label-xs-mid">
              Talent
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="#" className="text-muted-foreground font-label-xs-mid">
              People
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="#" className="text-foreground font-label-xs-mid">
              {profile?.name || "Loading..."}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header with actions */}
      <div className="flex items-center justify-between w-full">
        <h1 className="text-2xl font-semibold text-foreground">{profile?.name || "Loading..."}</h1>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon">
            <BellIcon className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <SettingsIcon className="h-4 w-4" />
          </Button>
          <Button>
            <EditIcon className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Bio and Personal Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Bio Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Bio</span>
                {!isEditingBio ? (
                  <Button variant="ghost" size="icon" onClick={handleEditBio}>
                    <EditIcon className="h-4 w-4" />
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={handleCancelBio}>
                      Cancel
                    </Button>
                    <Button size="sm" onClick={handleSaveBio}>
                      <SaveIcon className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!isEditingBio ? (
                <p className="text-muted-foreground leading-relaxed">
                  {bioText}
                </p>
              ) : (
                <div className="space-y-2">
                  <Textarea
                    value={tempBioText}
                    onChange={(e) => setTempBioText(e.target.value)}
                    className="min-h-[120px] resize-none"
                    placeholder="Enter bio..."
                    maxLength={500}
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    {tempBioText.length}/500 characters
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Personal Information Card */}
          <Card style={{ backgroundColor: '#252E38', borderColor: '#40505C', boxShadow: '0px 6px 18px 0px #00000026' }}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Personal Information</span>
                <Button variant="ghost" size="icon">
                  <EditIcon className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Date of Birth</label>
                  <p className="text-foreground">{profile?.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Nationality</label>
                  <p className="text-foreground">{profile?.nationality || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Emergency Contact</label>
                  <p className="text-foreground">{profile?.emergencyContact ? `${profile.emergencyContact.name} (${profile.emergencyContact.relationship})` : "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Languages</label>
                  <p className="text-foreground">{profile?.languages?.join(", ") || "N/A"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column - Location and Quick Actions */}
        <div className="space-y-6">
          {/* Location Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPinIcon className="h-4 w-4" />
                Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Current Location</label>
                  <p className="text-foreground">{profile?.currentLocation?.address || "N/A"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Permanent Home</label>
                  <p className="text-foreground">{profile?.permanentHome?.address || "N/A"}</p>
                </div>
                {/* Map placeholder */}
                <div className="w-full h-32 bg-muted rounded-lg flex items-center justify-center">
                  <MapPinIcon className="h-8 w-8 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Contact Card - NEW */}
          {profile?.contact && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PhoneIcon className="h-4 w-4" />
                  Quick Contact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <MailIcon className="h-4 w-4 text-muted-foreground" />
                    <a 
                      href={`mailto:${profile.contact.workEmail}`}
                      className="text-primary hover:underline text-sm"
                    >
                      {profile.contact.workEmail}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <PhoneIcon className="h-4 w-4 text-muted-foreground" />
                    <a 
                      href={`tel:${profile.contact.workPhone}`}
                      className="text-primary hover:underline text-sm"
                    >
                      {profile.contact.workPhone}
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Schedule Meeting
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <UserPlusIcon className="h-4 w-4 mr-2" />
                  Add to Team
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <ArrowUpRightIcon className="h-4 w-4 mr-2" />
                  View Full Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderLocationContent = () => (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Location Information</h2>
        <Button>
          <EditIcon className="h-4 w-4 mr-2" />
          Edit Location
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Current Location</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {profile?.currentLocation ? (
                <>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Address</label>
                    <p className="text-foreground">{profile.currentLocation.address}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Duration</label>
                    <p className="text-foreground">
                      {profile.currentLocation.duration}
                      {profile.currentLocation.startDate && 
                        ` (Started ${new Date(profile.currentLocation.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })})`
                      }
                    </p>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <MapPinIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No current location data available</p>
                </div>
              )}
              <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center">
                <MapPinIcon className="h-12 w-12 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Permanent Home</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {profile?.permanentHome ? (
                <>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Address</label>
                    <p className="text-foreground">{profile.permanentHome.address}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Property Type</label>
                    <p className="text-foreground">{profile.permanentHome.propertyType || 'Not specified'}</p>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <MapPinIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No permanent home data available</p>
                </div>
              )}
              <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center">
                <MapPinIcon className="h-12 w-12 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Location History Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClockIcon className="h-4 w-4" />
            Location History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {profile?.locationHistory && profile.locationHistory.length > 0 ? (
            <div className="space-y-4">
              {profile.locationHistory.map((item, index) => (
                <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <MapPinIcon className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-foreground">{item.change}</h4>
                      <span className="text-sm text-muted-foreground">{item.date}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {item.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <ClockIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No location history available</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderWorkContent = () => (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Work & Employment</h2>
        <Button>
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Position
        </Button>
      </div>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Current Position</CardTitle>
          </CardHeader>
          <CardContent>
            {profile?.currentPosition ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Job Title</label>
                  <p className="text-foreground">{profile.currentPosition.jobTitle}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Department</label>
                  <p className="text-foreground">{profile.currentPosition.department}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Start Date</label>
                  <p className="text-foreground">
                    {profile.currentPosition.startDate ? 
                      new Date(profile.currentPosition.startDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 
                      'N/A'
                    }
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Manager</label>
                  <p className="text-foreground">{profile.currentPosition.manager || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Employment Type</label>
                  <p className="text-foreground">{profile.currentPosition.employmentType}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Work Location</label>
                  <p className="text-foreground">{profile.currentPosition.workLocation}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No current position data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Employment History</CardTitle>
          </CardHeader>
          <CardContent>
            {profile?.employmentHistory && profile.employmentHistory.length > 0 ? (
              <div className="space-y-4">
                {profile.employmentHistory.map((job, index) => (
                  <div key={index} className={`border-l-2 ${index === 0 ? 'border-primary' : 'border-border'} pl-4`}>
                    <h4 className="font-medium text-foreground">{job.position}</h4>
                    <p className="text-sm text-muted-foreground">{job.period}</p>
                    {job.department && (
                      <p className="text-sm text-muted-foreground">Department: {job.department}</p>
                    )}
                    {job.description && (
                      <p className="text-sm text-muted-foreground mt-1">{job.description}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No employment history available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderContactContent = () => (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Contact Information</h2>
        <Button>
          <EditIcon className="h-4 w-4 mr-2" />
          Edit Contact
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Primary Contact</CardTitle>
          </CardHeader>
          <CardContent>
            {profile?.contact ? (
              <div className="space-y-4">
                {profile.contact.workEmail && (
                  <div className="flex items-center gap-3">
                    <MailIcon className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Work Email</label>
                      <p className="text-foreground">{profile.contact.workEmail}</p>
                    </div>
                  </div>
                )}
                {profile.contact.workPhone && (
                  <div className="flex items-center gap-3">
                    <PhoneIcon className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Work Phone</label>
                      <p className="text-foreground">{profile.contact.workPhone}</p>
                    </div>
                  </div>
                )}
                {profile.contact.personalEmail && (
                  <div className="flex items-center gap-3">
                    <MailIcon className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Personal Email</label>
                      <p className="text-foreground">{profile.contact.personalEmail}</p>
                    </div>
                  </div>
                )}
                {profile.contact.mobilePhone && (
                  <div className="flex items-center gap-3">
                    <PhoneIcon className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Mobile Phone</label>
                      <p className="text-foreground">{profile.contact.mobilePhone}</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No contact information available</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Emergency Contact</CardTitle>
          </CardHeader>
          <CardContent>
            {profile?.emergencyContact ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Name</label>
                  <p className="text-foreground">{profile.emergencyContact.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Relationship</label>
                  <p className="text-foreground">{profile.emergencyContact.relationship}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Phone</label>
                  <p className="text-foreground">{profile.emergencyContact.phone}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No emergency contact information available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Contact History Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClockIcon className="h-4 w-4" />
            Contact History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {profile?.contactHistory && profile.contactHistory.length > 0 ? (
            <div className="space-y-4">
              {profile.contactHistory.map((item, index) => (
                <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <EditIcon className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-foreground">{item.type}</h4>
                      <span className="text-sm text-muted-foreground">{item.date}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {item.details}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <ClockIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No contact history available</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderFamilyContent = () => (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Family Information</h2>
        <Button>
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Family Member
        </Button>
      </div>
      
      <div className="space-y-6">
        {/* Current Family Members */}
        <Card>
          <CardHeader>
            <CardTitle>Current Family Members</CardTitle>
          </CardHeader>
          <CardContent>
            {profile?.familyMembers && profile.familyMembers.length > 0 ? (
              <div className="space-y-4">
                {profile.familyMembers.map((member) => {
                  const initials = member.name.split(' ').map(n => n[0]).join('').toUpperCase();
                  const avatarColors = {
                    'Spouse': 'bg-primary',
                    'Partner': 'bg-primary',
                    'Child': member.age && member.age < 10 ? 'bg-pink-500' : 'bg-violet-600',
                    'Other': 'bg-gray-500'
                  };
                  const bgColor = avatarColors[member.relationship] || 'bg-gray-500';
                  
                  return (
                    <div key={member.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <Avatar className="h-12 w-12">
                        <div className={`w-full h-full ${bgColor} rounded-full flex items-center justify-center`}>
                          <span className="text-white font-medium">{initials}</span>
                        </div>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">{member.name}</h4>
                        <p className="text-sm text-muted-foreground">{member.relationship}</p>
                        {member.dateOfBirth && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Born: {new Date(member.dateOfBirth).toLocaleDateString('en-US', { 
                              month: 'long', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}
                            {member.age && ` (Age ${member.age})`}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                          {member.passportStatus && (
                            <Badge className={`${
                              member.passportStatus === 'Valid' ? 'bg-green-100 text-green-800' :
                              member.passportStatus === 'Expired' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {member.passportStatus === 'None' ? 'No Passport' : `Passport ${member.passportStatus}`}
                            </Badge>
                          )}
                          {member.visaRequired && (
                            <Badge className="bg-blue-100 text-blue-800">Visa Required</Badge>
                          )}
                          {member.relationship === 'Child' && member.age && member.age < 18 && (
                            <Badge className="bg-orange-100 text-orange-800">Minor</Badge>
                          )}
                        </div>
                        <Button variant="ghost" size="icon">
                          <EditIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <UserIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No family members data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Family Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Family Summary</CardTitle>
          </CardHeader>
          <CardContent>
            {profile?.familySummary ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Marital Status</label>
                  <p className="text-foreground">{profile.familySummary.maritalStatus}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Total Dependents</label>
                  <p className="text-foreground">
                    {profile.familySummary.totalDependents}
                    {profile.familyMembers && profile.familyMembers.length > 0 && (
                      <span className="text-sm text-muted-foreground ml-1">
                        ({profile.familyMembers.filter(m => m.relationship === 'Spouse' || m.relationship === 'Partner').length} spouse/partner, 
                        {profile.familyMembers.filter(m => m.relationship === 'Child').length} children)
                      </span>
                    )}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Passports Held</label>
                  <p className="text-foreground">
                    {profile.familySummary.passportsHeld}
                    {profile.familyMembers && (
                      <span className="text-sm text-muted-foreground ml-1">
                        of {profile.familyMembers.length} family members
                      </span>
                    )}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-muted-foreground">No family summary data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Family History Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClockIcon className="h-4 w-4" />
              Family History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 border rounded-lg">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <XIcon className="h-4 w-4 text-red-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-foreground">Passport Application - Lucas Williams</h4>
                    <span className="text-sm text-muted-foreground">1 week ago</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Passport application submitted for Lucas Williams (Son, Age 5)
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                    <span className="text-xs text-muted-foreground">Application #PP-2024-0892</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 border rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <EditIcon className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-foreground">Marital Status Updated</h4>
                    <span className="text-sm text-muted-foreground">6 months ago</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Relationship status changed from "Partner" to "Spouse" for John Williams
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className="bg-green-100 text-green-800">Marriage</Badge>
                    <span className="text-xs text-muted-foreground">Updated by Hannah Williams</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 border rounded-lg">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <UserPlusIcon className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-foreground">New Family Member Added</h4>
                    <span className="text-sm text-muted-foreground">5 years ago</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Lucas Williams added as dependent (Son, born September 3, 2019)
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className="bg-green-100 text-green-800">Birth</Badge>
                    <span className="text-xs text-muted-foreground">Added by HR System</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 border rounded-lg">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <SaveIcon className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-foreground">Passport Received - Emma Williams</h4>
                    <span className="text-sm text-muted-foreground">1 year ago</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    British passport received for Emma Williams (Daughter, Age 7 at time)
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className="bg-purple-100 text-purple-800">Passport</Badge>
                    <span className="text-xs text-muted-foreground">Document #GB123456789</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 border rounded-lg">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <UserPlusIcon className="h-4 w-4 text-orange-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-foreground">Partner Added to Profile</h4>
                    <span className="text-sm text-muted-foreground">2 years ago</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    John Williams added as partner (relationship status: Partner)
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className="bg-orange-100 text-orange-800">Relationship</Badge>
                    <span className="text-xs text-muted-foreground">Added by Hannah Williams</span>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <EditIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderLegalContent = () => (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Legal & Compliance</h2>
        <Button>
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Document
        </Button>
      </div>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Work Authorization</CardTitle>
          </CardHeader>
          <CardContent>
            {profile?.workAuthorization ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Visa Type</label>
                  <p className="text-foreground">{profile.workAuthorization.visaType}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <Badge className={`${
                    profile.workAuthorization.status.toLowerCase() === 'valid' || 
                    profile.workAuthorization.status.toLowerCase() === 'active' ? 
                    'bg-green-100 text-green-800' : 
                    'bg-red-100 text-red-800'
                  }`}>
                    {profile.workAuthorization.status}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Expiry Date</label>
                  <p className="text-foreground">
                    {profile.workAuthorization.expiryDate ? 
                      new Date(profile.workAuthorization.expiryDate).toLocaleDateString() : 
                      'N/A'
                    }
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Work Countries</label>
                  <p className="text-foreground">
                    {profile.workAuthorization.workCountries.join(', ') || 'Not specified'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No work authorization data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Compliance Documents</CardTitle>
          </CardHeader>
          <CardContent>
            {profile?.complianceDocuments && profile.complianceDocuments.length > 0 ? (
              <div className="space-y-3">
                {profile.complianceDocuments.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                        <span className="text-xs font-medium">
                          {doc.type.substring(0, 3).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{doc.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {doc.type} • Updated {new Date(doc.uploadDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`${
                        doc.status === 'Verified' ? 'bg-green-100 text-green-800' :
                        doc.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {doc.status}
                      </Badge>
                      <Button variant="ghost" size="icon">
                        <EyeIcon className="h-4 w-4" />
                      </Button>
                      {doc.downloadUrl && (
                        <Button variant="ghost" size="icon">
                          <DownloadIcon className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileTextIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No compliance documents available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderMovesContent = () => (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Moves & Assignments</h2>
        <Button>
          <PlusIcon className="h-4 w-4 mr-2" />
          New Move Request
        </Button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        <Button variant="default" size="sm">All Moves</Button>
        <Button variant="outline" size="sm">Long-term</Button>
        <Button variant="outline" size="sm">Business Trips</Button>
        <Button variant="outline" size="sm">Remote Work</Button>
      </div>
      
      {profile?.moves && profile.moves.length > 0 ? (
        <div className="space-y-4">
          {profile.moves.map((move) => {
            const statusColors = {
              'Active': { dot: 'bg-green-500', badge: 'bg-green-100 text-green-800' },
              'Upcoming': { dot: 'bg-blue-500', badge: 'bg-blue-100 text-blue-800' },
              'Completed': { dot: 'bg-gray-500', badge: 'bg-gray-100 text-gray-800' }
            };
            const colors = statusColors[move.status] || statusColors['Active'];
            
            return (
              <Card key={move.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 ${colors.dot} rounded-full`}></div>
                      <div>
                        <h4 className="font-medium text-foreground">{move.location}</h4>
                        <p className="text-sm text-muted-foreground">
                          {move.type} • 
                          {new Date(move.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          {move.endDate && ` - ${new Date(move.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
                        </p>
                        {move.details && (
                          <p className="text-xs text-muted-foreground mt-1">{move.details}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={colors.badge}>{move.status}</Badge>
                      <Button variant="ghost" size="icon">
                        {move.status === 'Upcoming' ? (
                          <EditIcon className="h-4 w-4" />
                        ) : (
                          <EyeIcon className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8">
            <div className="text-center">
              <MoveIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No moves or assignments data available</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderDocumentsContent = () => (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Documents</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <SearchIcon className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <FilterIcon className="h-4 w-4" />
          </Button>
          <Button>
            <PlusIcon className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
        </div>
      </div>

      {/* Document categories */}
      <div className="flex gap-2 flex-wrap">
        <Button variant="default" size="sm">All Documents</Button>
        <Button variant="outline" size="sm">Personal</Button>
        <Button variant="outline" size="sm">Work</Button>
        <Button variant="outline" size="sm">Legal</Button>
        <Button variant="outline" size="sm">Medical</Button>
      </div>
      
      {profile?.documents && profile.documents.length > 0 ? (
        <div className="space-y-3">
          {profile.documents.map((doc) => {
            const fileTypeColors = {
              'PDF': { bg: 'bg-red-100', text: 'text-red-700' },
              'IMG': { bg: 'bg-blue-100', text: 'text-blue-700' },
              'DOC': { bg: 'bg-blue-100', text: 'text-blue-700' },
              'DOCX': { bg: 'bg-blue-100', text: 'text-blue-700' },
              'XLS': { bg: 'bg-green-100', text: 'text-green-700' },
              'XLSX': { bg: 'bg-green-100', text: 'text-green-700' }
            };
            const fileExt = doc.fileType.toUpperCase();
            const colors = fileTypeColors[fileExt] || { bg: 'bg-gray-100', text: 'text-gray-700' };
            
            return (
              <Card key={doc.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${colors.bg} rounded flex items-center justify-center`}>
                        <span className={`text-xs font-medium ${colors.text}`}>
                          {fileExt.substring(0, 3)}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium text-foreground">{doc.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {doc.type} • Uploaded {new Date(doc.uploadDate).toLocaleDateString()}
                          {doc.size && ` • ${doc.size}`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`${
                        doc.verificationStatus === 'Verified' ? 'bg-green-100 text-green-800' :
                        doc.verificationStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {doc.verificationStatus}
                      </Badge>
                      <Button variant="ghost" size="icon">
                        <EyeIcon className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <DownloadIcon className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8">
            <div className="text-center">
              <FileTextIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No documents available</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderCommunicationContent = () => (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Communication History</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <SearchIcon className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <FilterIcon className="h-4 w-4" />
          </Button>
          <Button>
            <PlusIcon className="h-4 w-4 mr-2" />
            New Communication
          </Button>
        </div>
      </div>

      {/* Communication type filters */}
      <div className="flex gap-2 flex-wrap">
        <Button variant="default" size="sm">All Communications</Button>
        <Button variant="outline" size="sm">Email</Button>
        <Button variant="outline" size="sm">Calls</Button>
        <Button variant="outline" size="sm">Meetings</Button>
        <Button variant="outline" size="sm">SMS</Button>
      </div>
      
      {profile?.communications && profile.communications.length > 0 ? (
        <div className="space-y-4">
          {profile.communications.map((comm) => {
            const typeIcons = {
              'Email': { icon: MailIcon, bg: 'bg-blue-100', color: 'text-blue-600' },
              'Call': { icon: PhoneIcon, bg: 'bg-green-100', color: 'text-green-600' },
              'Meeting': { icon: CalendarIcon, bg: 'bg-purple-100', color: 'text-purple-600' },
              'SMS': { icon: MessageSquareIcon, bg: 'bg-orange-100', color: 'text-orange-600' }
            };
            const iconData = typeIcons[comm.type] || typeIcons['Email'];
            const Icon = iconData.icon;
            
            const statusColors = {
              'Responded': 'bg-green-100 text-green-800',
              'Pending': 'bg-yellow-100 text-yellow-800',
              'No Response Needed': 'bg-blue-100 text-blue-800'
            };
            
            return (
              <Card key={comm.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-8 h-8 ${iconData.bg} rounded-full flex items-center justify-center`}>
                      <Icon className={`h-4 w-4 ${iconData.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-foreground">{comm.subject}</h4>
                        <span className="text-sm text-muted-foreground">
                          {comm.date} at {comm.time}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {comm.type} • {comm.participants.join(', ')}
                      </p>
                      {comm.notes && (
                        <p className="text-sm text-muted-foreground mt-2">
                          {comm.notes.length > 100 ? comm.notes.substring(0, 100) + '...' : comm.notes}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-3">
                        <Badge className={statusColors[comm.status] || 'bg-gray-100 text-gray-800'}>
                          {comm.status}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <EyeIcon className="h-3 w-3 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8">
            <div className="text-center">
              <MessageSquareIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No communication history available</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderActivityContent = () => (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Activity Timeline</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <SearchIcon className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <FilterIcon className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <SortAscIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Activity category filters */}
      <div className="flex gap-2 flex-wrap">
        <Button variant="default" size="sm">All Activity</Button>
        <Button variant="outline" size="sm">Profile Changes</Button>
        <Button variant="outline" size="sm">Moves</Button>
        <Button variant="outline" size="sm">Documents</Button>
        <Button variant="outline" size="sm">Communications</Button>
      </div>
      
      {profile?.activities && profile.activities.length > 0 ? (
        <div className="space-y-4">
          {profile.activities.map((activity) => {
            // Map activity types to icons and colors
            const typeConfig: Record<string, { icon: any; bg: string; color: string; badgeColor: string }> = {
              'Profile Created': { icon: PlusIcon, bg: 'bg-purple-100', color: 'text-purple-600', badgeColor: 'bg-purple-100 text-purple-800' },
              'Profile Updated': { icon: EditIcon, bg: 'bg-blue-100', color: 'text-blue-600', badgeColor: 'bg-blue-100 text-blue-800' },
              'Document Uploaded': { icon: SaveIcon, bg: 'bg-green-100', color: 'text-green-600', badgeColor: 'bg-green-100 text-green-800' },
              'Move Request': { icon: MapPinIcon, bg: 'bg-purple-100', color: 'text-purple-600', badgeColor: 'bg-purple-100 text-purple-800' },
              'Contact Updated': { icon: UserIcon, bg: 'bg-orange-100', color: 'text-orange-600', badgeColor: 'bg-orange-100 text-orange-800' },
              'Family Update': { icon: UserPlusIcon, bg: 'bg-pink-100', color: 'text-pink-600', badgeColor: 'bg-pink-100 text-pink-800' }
            };
            
            const config = typeConfig[activity.type] || {
              icon: EditIcon,
              bg: 'bg-gray-100',
              color: 'text-gray-600',
              badgeColor: 'bg-gray-100 text-gray-800'
            };
            const Icon = config.icon;
            
            // Format timestamp
            const formatTimestamp = (timestamp: string) => {
              const date = new Date(timestamp);
              const now = new Date();
              const diff = now.getTime() - date.getTime();
              const hours = Math.floor(diff / (1000 * 60 * 60));
              const days = Math.floor(diff / (1000 * 60 * 60 * 24));
              
              if (hours < 1) return 'Just now';
              if (hours < 24) return `${hours} hours ago`;
              if (days < 7) return `${days} days ago`;
              return date.toLocaleDateString();
            };
            
            // Determine badge category
            const getBadgeCategory = (type: string) => {
              if (type.includes('Profile')) return 'Profile';
              if (type.includes('Document')) return 'Documents';
              if (type.includes('Move')) return 'Moves';
              if (type.includes('Contact')) return 'Contact';
              if (type.includes('Family')) return 'Family';
              return 'Activity';
            };
            
            return (
              <Card key={activity.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-8 h-8 ${config.bg} rounded-full flex items-center justify-center`}>
                      <Icon className={`h-4 w-4 ${config.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-foreground">{activity.type}</h4>
                        <span className="text-sm text-muted-foreground">
                          {formatTimestamp(activity.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {activity.description} by {activity.user}
                      </p>
                      {activity.details && Object.keys(activity.details).length > 0 && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {JSON.stringify(activity.details).substring(0, 100)}...
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-3">
                        <Badge className={config.badgeColor}>
                          {getBadgeCategory(activity.type)}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <EyeIcon className="h-3 w-3 mr-1" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8">
            <div className="text-center">
              <ClockIcon className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No activity history available</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "details":
        return renderDetailsContent();
      case "location":
        return renderLocationContent();
      case "work":
        return renderWorkContent();
      case "contact":
        return renderContactContent();
      case "family":
        return renderFamilyContent();
      case "legal":
        return renderLegalContent();
      case "moves":
        return renderMovesContent();
      case "documents":
        return renderDocumentsContent();
      case "communication":
        return renderCommunicationContent();
      case "activity":
        return renderActivityContent();
      default:
        return renderDetailsContent();
    }
  };

  return (
    <section className="flex flex-col items-end gap-8 pt-4 pb-0 px-6 relative flex-1 self-stretch grow">
      {renderContent()}
    </section>
  );
};