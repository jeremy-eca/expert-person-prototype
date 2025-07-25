import React, { useState } from 'react';
import { Button } from '../../../../../components/ui/button';
import { XIcon } from 'lucide-react';

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (language: string, proficiency: string) => void;
}

const LANGUAGES = [
  'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese',
  'Chinese (Mandarin)', 'Chinese (Cantonese)', 'Japanese', 'Korean',
  'Arabic', 'Hindi', 'Russian', 'Turkish', 'Dutch', 'Swedish',
  'Norwegian', 'Danish', 'Finnish', 'Polish', 'Czech', 'Hungarian',
  'Greek', 'Hebrew', 'Thai', 'Vietnamese', 'Indonesian', 'Malay',
  'Tagalog', 'Swahili', 'Other'
];

const PROFICIENCY_LEVELS = [
  { value: 'basic', label: 'Basic' },
  { value: 'conversational', label: 'Conversational' },
  { value: 'professional', label: 'Professional' },
  { value: 'native', label: 'Native' }
];

export const LanguageModal: React.FC<LanguageModalProps> = ({ isOpen, onClose, onSave }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedProficiency, setSelectedProficiency] = useState('');

  const handleSave = () => {
    if (selectedLanguage && selectedProficiency) {
      onSave(selectedLanguage, selectedProficiency);
      setSelectedLanguage('');
      setSelectedProficiency('');
      onClose();
    }
  };

  const handleCancel = () => {
    setSelectedLanguage('');
    setSelectedProficiency('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#252E38] rounded-lg p-6 w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Add Language</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCancel}
            className="text-gray-400 hover:text-white"
          >
            <XIcon className="w-4 h-4" />
          </Button>
        </div>

        {/* Language Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Language
          </label>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="w-full px-3 py-2 bg-[#1D252D] border border-[#40505C] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a language</option>
            {LANGUAGES.map((language) => (
              <option key={language} value={language}>
                {language}
              </option>
            ))}
          </select>
        </div>

        {/* Proficiency Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Proficiency Level
          </label>
          <select
            value={selectedProficiency}
            onChange={(e) => setSelectedProficiency(e.target.value)}
            className="w-full px-3 py-2 bg-[#1D252D] border border-[#40505C] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select proficiency level</option>
            {PROFICIENCY_LEVELS.map((level) => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="border-[#40505C] text-gray-300 hover:bg-[#2A3440]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!selectedLanguage || !selectedProficiency}
            className="bg-[#732cec] hover:bg-[#5a23b8] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Language
          </Button>
        </div>
      </div>
    </div>
  );
};