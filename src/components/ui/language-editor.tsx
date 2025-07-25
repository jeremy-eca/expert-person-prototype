import React, { useState, useRef, useEffect } from 'react';
import { Button } from './button';
import { Input } from './input';
import { Badge } from './badge';
import { LanguageSkill } from '../../types/frontend.types';
import { cn } from '@/lib/utils';

interface LanguageEditorProps {
  languages: LanguageSkill[];
  onLanguagesChange: (languages: LanguageSkill[]) => void;
  className?: string;
}

const PROFICIENCY_LEVELS = [
  { 
    value: 'Basic' as const, 
    label: 'Basic', 
    description: 'Simple phrases & greetings',
    color: 'bg-gray-500',
    progress: 25
  },
  { 
    value: 'Conversational' as const, 
    label: 'Conversational', 
    description: 'Daily communication',
    color: 'bg-blue-500',
    progress: 50
  },
  { 
    value: 'Professional' as const, 
    label: 'Professional', 
    description: 'Work environment fluency',
    color: 'bg-green-500',
    progress: 75
  },
  { 
    value: 'Native' as const, 
    label: 'Native', 
    description: 'Mother tongue level',
    color: 'bg-amber-500',
    progress: 100
  }
];

const POPULAR_LANGUAGES = [
  'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 
  'Dutch', 'Russian', 'Chinese', 'Japanese', 'Korean', 'Arabic',
  'Hindi', 'Swedish', 'Norwegian', 'Danish', 'Finnish', 'Polish',
  'Czech', 'Hungarian', 'Romanian', 'Bulgarian', 'Greek', 'Turkish',
  'Hebrew', 'Thai', 'Vietnamese', 'Indonesian', 'Malay', 'Tagalog'
];

export function LanguageEditor({ languages, onLanguagesChange, className }: LanguageEditorProps) {
  const isDarkTheme = className?.includes('language-editor-dark');
  const [isAddingLanguage, setIsAddingLanguage] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedProficiency, setSelectedProficiency] = useState<LanguageSkill['proficiency']>('Conversational');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredLanguages = POPULAR_LANGUAGES.filter(lang => 
    lang.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !languages.some(existing => existing.language.toLowerCase() === lang.toLowerCase())
  );

  const getProficiencyConfig = (proficiency: LanguageSkill['proficiency']) => {
    return PROFICIENCY_LEVELS.find(level => level.value === proficiency) || PROFICIENCY_LEVELS[1];
  };

  const addLanguage = () => {
    if (!selectedLanguage.trim()) return;

    const newLanguage: LanguageSkill = {
      id: `lang_${Date.now()}`,
      language: selectedLanguage,
      proficiency: selectedProficiency,
      isPrimary: languages.length === 0, // First language is primary by default
      dateAdded: new Date().toISOString()
    };

    onLanguagesChange([...languages, newLanguage]);
    
    // Reset form
    setSelectedLanguage('');
    setSearchTerm('');
    setSelectedProficiency('Conversational');
    setIsAddingLanguage(false);
  };

  const removeLanguage = (languageId: string) => {
    const updatedLanguages = languages.filter(lang => lang.id !== languageId);
    
    // If we removed the primary language, make the first remaining one primary
    if (updatedLanguages.length > 0 && !updatedLanguages.some(lang => lang.isPrimary)) {
      updatedLanguages[0].isPrimary = true;
    }
    
    onLanguagesChange(updatedLanguages);
  };

  const togglePrimary = (languageId: string) => {
    const updatedLanguages = languages.map(lang => ({
      ...lang,
      isPrimary: lang.id === languageId
    }));
    onLanguagesChange(updatedLanguages);
  };

  const selectLanguageFromSuggestion = (language: string) => {
    setSelectedLanguage(language);
    setSearchTerm(language);
    setShowSuggestions(false);
  };

  useEffect(() => {
    if (searchTerm) {
      setSelectedLanguage(searchTerm);
    }
  }, [searchTerm]);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Current Languages */}
      <div className="flex flex-wrap gap-2">
        {languages.map((lang) => {
          const config = getProficiencyConfig(lang.proficiency);
          return (
            <div
              key={lang.id}
              className={cn(
                "inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all hover:shadow-md",
                lang.isPrimary 
                  ? "bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200 text-amber-800"
                  : isDarkTheme 
                    ? "bg-[#40505C] border-[#40505C] text-white"
                    : "bg-white border-gray-200 text-gray-700"
              )}
            >
              {/* Language name */}
              <span className="font-semibold">{lang.language}</span>
              
              {/* Proficiency indicator */}
              <div className="flex items-center gap-1">
                <div className={cn("w-2 h-2 rounded-full", config.color)} />
                <span className="text-xs opacity-75">{lang.proficiency}</span>
              </div>
              
              {/* Primary indicator */}
              {lang.isPrimary && (
                <Badge 
                  variant="default" 
                  className="text-xs px-1.5 py-0.5 bg-amber-100 text-amber-800 border-amber-300"
                >
                  Primary
                </Badge>
              )}
              
              {/* Actions */}
              <div className="flex items-center gap-1 ml-1">
                {!lang.isPrimary && (
                  <button
                    onClick={() => togglePrimary(lang.id)}
                    className="text-xs text-gray-500 hover:text-amber-600 transition-colors"
                    title="Set as primary language"
                  >
                    ⭐
                  </button>
                )}
                <button
                  onClick={() => removeLanguage(lang.id)}
                  className="text-xs text-gray-400 hover:text-red-500 transition-colors ml-1"
                  title="Remove language"
                >
                  ×
                </button>
              </div>
            </div>
          );
        })}
        
        {/* Add Language Button */}
        {!isAddingLanguage && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAddingLanguage(true)}
            className="h-10 border-dashed border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-700"
          >
            + Add Language
          </Button>
        )}
      </div>

      {/* Add Language Form */}
      {isAddingLanguage && (
        <div className={cn(
          "rounded-lg p-4 space-y-4",
          isDarkTheme 
            ? "bg-[#1D252D] border border-[#40505C]"
            : "bg-gray-50 border border-gray-200"
        )}>
          {/* Language Selection */}
          <div className="relative">
            <label className={cn(
              "block text-sm font-medium mb-2",
              isDarkTheme ? "text-white" : "text-gray-700"
            )}>
              Language *
            </label>
            <Input
              ref={inputRef}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              placeholder="Type to search languages..."
              className="w-full"
            />
            
            {/* Suggestions Dropdown */}
            {showSuggestions && filteredLanguages.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                {filteredLanguages.slice(0, 8).map((language) => (
                  <button
                    key={language}
                    onClick={() => selectLanguageFromSuggestion(language)}
                    className="w-full px-3 py-2 text-left hover:bg-gray-50 text-sm border-b border-gray-100 last:border-b-0"
                  >
                    {language}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Proficiency Selection */}
          <div>
            <label className={cn(
              "block text-sm font-medium mb-3",
              isDarkTheme ? "text-white" : "text-gray-700"  
            )}>
              Proficiency Level *
            </label>
            <div className="grid grid-cols-2 gap-3">
              {PROFICIENCY_LEVELS.map((level) => {
                const isSelected = selectedProficiency === level.value;
                return (
                  <button
                    key={level.value}
                    onClick={() => setSelectedProficiency(level.value)}
                    className={cn(
                      "p-3 rounded-lg border text-left transition-all hover:shadow-sm",
                      isSelected
                        ? isDarkTheme 
                          ? "border-[#732cec] bg-[#732cec]/20 text-white"
                          : "border-blue-500 bg-blue-50 text-blue-900"
                        : isDarkTheme
                          ? "border-[#40505C] bg-[#2A3440] text-white hover:border-[#5A6570]"
                          : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{level.label}</span>
                      <div className={cn("w-3 h-3 rounded-full", level.color)} />
                    </div>
                    <p className="text-xs opacity-75">{level.description}</p>
                    
                    {/* Progress bar */}
                    <div className={cn(
                      "mt-2 w-full rounded-full h-1",
                      isDarkTheme ? "bg-[#40505C]" : "bg-gray-200"
                    )}>
                      <div 
                        className={cn("h-1 rounded-full transition-all", level.color)}
                        style={{ width: `${level.progress}%` }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsAddingLanguage(false);
                setSearchTerm('');
                setSelectedLanguage('');
                setSelectedProficiency('Conversational');
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={addLanguage}
              disabled={!selectedLanguage.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Add Language
            </Button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {languages.length === 0 && !isAddingLanguage && (
        <div className="text-center py-8 text-gray-500">
          <div className="mb-3">🗣️</div>
          <p className="text-sm mb-3">No languages added yet</p>
          <Button
            variant="outline"
            onClick={() => setIsAddingLanguage(true)}
            className="border-dashed"
          >
            Add Your First Language
          </Button>
        </div>
      )}
    </div>
  );
}