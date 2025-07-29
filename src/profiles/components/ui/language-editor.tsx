import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../../../shared/components/ui/button';
import { Input } from '../../../shared/components/ui/input';
import { Badge } from '../../../shared/components/ui/badge';
import { LanguageSkill } from '../../types/frontend.types';
import { cn } from '../../../shared/lib/utils';

interface LanguageEditorProps {
  languages: LanguageSkill[];
  onLanguagesChange: (languages: LanguageSkill[]) => void;
  className?: string;
}

const PROFICIENCY_LEVELS = [
  { 
    value: 'Basic' as const, 
    label: 'Beginner', 
    description: 'Simple phrases & greetings',
    color: 'bg-gray-500',
    dotColor: '#6B7280'
  },
  { 
    value: 'Conversational' as const, 
    label: 'Intermediate', 
    description: 'Daily communication',
    color: 'bg-blue-500',
    dotColor: '#3B82F6'
  },
  { 
    value: 'Professional' as const, 
    label: 'Advanced', 
    description: 'Work environment fluency',
    color: 'bg-emerald-500',
    dotColor: '#10B981'
  },
  { 
    value: 'Native' as const, 
    label: 'Native', 
    description: 'Mother tongue level',
    color: 'bg-amber-500',
    dotColor: '#F59E0B'
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
  const [showProficiencySelector, setShowProficiencySelector] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const proficiencyRef = useRef<HTMLDivElement>(null);

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
    resetAddLanguageForm();
  };

  const resetAddLanguageForm = () => {
    setSelectedLanguage('');
    setSearchTerm('');
    setSelectedProficiency('Conversational');
    setIsAddingLanguage(false);
    setShowSuggestions(false);
    setShowProficiencySelector(false);
  };

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
    setSearchTerm(language);
    setShowSuggestions(false);
    setShowProficiencySelector(true);
    // Focus on proficiency selector after language is selected
    setTimeout(() => proficiencyRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
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
    handleLanguageSelect(language);
  };

  useEffect(() => {
    if (searchTerm) {
      setSelectedLanguage(searchTerm);
    }
  }, [searchTerm]);

  // Auto-focus input when adding language
  useEffect(() => {
    if (isAddingLanguage && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAddingLanguage]);

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
                "group inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-sm font-medium transition-all duration-200 hover:shadow-sm relative",
                lang.isPrimary 
                  ? "bg-amber-50 border border-amber-200 text-amber-900 shadow-sm"
                  : isDarkTheme 
                    ? "bg-[#2A3440] border border-[#40505C] text-white hover:border-[#5A6570] hover:bg-[#2E3A48]"
                    : "bg-gray-50 border border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-100"
              )}
            >
              {/* Language name */}
              <span className="text-[12px] font-medium leading-tight">{lang.language}</span>
              
              {/* Proficiency dot with hover tooltip */}
              <div 
                className="w-1.5 h-1.5 rounded-full ring-1 ring-white/30"
                style={{ backgroundColor: config.dotColor }}
                title={`${config.label} proficiency`}
              />
              
              {/* Primary indicator - more subtle */}
              {lang.isPrimary && (
                <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-amber-500 rounded-full shadow-sm" />
              )}
              
              {/* Actions - compact and elegant */}
              <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-all duration-200 ml-0.5">
                {!lang.isPrimary && (
                  <button
                    onClick={() => togglePrimary(lang.id)}
                    className={cn(
                      "w-3.5 h-3.5 flex items-center justify-center rounded transition-colors",
                      isDarkTheme
                        ? "text-gray-500 hover:text-amber-400 hover:bg-amber-400/10"
                        : "text-gray-400 hover:text-amber-500 hover:bg-amber-50"
                    )}
                    title="Set as primary language"
                  >
                    <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                )}
                <button
                  onClick={() => removeLanguage(lang.id)}
                  className={cn(
                    "w-3.5 h-3.5 flex items-center justify-center rounded transition-colors",
                    isDarkTheme
                      ? "text-gray-500 hover:text-red-400 hover:bg-red-400/10"
                      : "text-gray-400 hover:text-red-500 hover:bg-red-50"
                  )}
                  title="Remove language"
                >
                  <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
        
        {/* Inline Add Language Flow */}
        {!isAddingLanguage ? (
          <button
            onClick={() => setIsAddingLanguage(true)}
            className={cn(
              "inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[12px] font-medium transition-all duration-200",
              "border border-dashed hover:shadow-sm group",
              isDarkTheme 
                ? "border-[#40505C] text-gray-400 hover:border-[#5A6570] hover:text-gray-300 hover:bg-[#2E3A48]"
                : "border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-700 hover:bg-gray-50"
            )}
          >
            <svg className="w-3 h-3 transition-transform duration-200 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Add Language
          </button>
        ) : (
          /* Inline Language Input */
          <div className="inline-flex items-center gap-2 animate-in fade-in-0 slide-in-from-left-2 duration-200">
            {/* Language Input */}
            <div className="relative">
              <Input
                ref={inputRef}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowSuggestions(true);
                  setShowProficiencySelector(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && filteredLanguages.length > 0) {
                    handleLanguageSelect(filteredLanguages[0]);
                  } else if (e.key === 'Escape') {
                    resetAddLanguageForm();
                  }
                }}
                placeholder="Type language..."
                className={cn(
                  "w-32 h-8 text-[12px] px-2 py-1 rounded-md transition-all duration-200",
                  isDarkTheme 
                    ? "bg-[#2A3440] border-[#40505C] text-white placeholder:text-gray-500"
                    : "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                )}
              />
              
              {/* Suggestions Dropdown - Compact */}
              {showSuggestions && filteredLanguages.length > 0 && (
                <div className={cn(
                  "absolute z-50 w-40 mt-1 rounded-md shadow-lg max-h-32 overflow-y-auto",
                  "border animate-in fade-in-0 slide-in-from-top-2 duration-200",
                  isDarkTheme 
                    ? "bg-[#2A3440] border-[#40505C]"
                    : "bg-white border-gray-200"
                )}>
                  {filteredLanguages.slice(0, 6).map((language, index) => (
                    <button
                      key={language}
                      onClick={() => handleLanguageSelect(language)}
                      className={cn(
                        "w-full px-2 py-1.5 text-left text-[11px] transition-colors duration-150",
                        "border-b last:border-b-0",
                        index === 0 ? "bg-blue-50 text-blue-900" : "",
                        isDarkTheme
                          ? "border-[#40505C] text-white hover:bg-[#2E3A48]"
                          : "border-gray-100 text-gray-900 hover:bg-gray-50"
                      )}
                    >
                      {language}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Proficiency Selector - Appears after language selection */}
            {showProficiencySelector && (
              <div ref={proficiencyRef} className="inline-flex items-center gap-1 animate-in fade-in-0 slide-in-from-left-2 duration-300">
                <span className={cn(
                  "text-[10px] font-medium",
                  isDarkTheme ? "text-gray-400" : "text-gray-500"
                )}>
                  Level:
                </span>
                <div className="flex gap-1">
                  {PROFICIENCY_LEVELS.map((level) => {
                    const isSelected = selectedProficiency === level.value;
                    return (
                      <button
                        key={level.value}
                        onClick={() => setSelectedProficiency(level.value)}
                        className={cn(
                          "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium transition-all duration-150",
                          isSelected
                            ? "shadow-sm ring-1"
                            : "opacity-60 hover:opacity-100",
                          isDarkTheme
                            ? isSelected 
                              ? "bg-blue-500/20 text-white ring-blue-500"
                              : "bg-[#2A3440] text-gray-300 hover:bg-[#2E3A48]"
                            : isSelected
                              ? "bg-blue-50 text-blue-900 ring-blue-200"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        )}
                        title={level.description}
                      >
                        <div 
                          className="w-1 h-1 rounded-full"
                          style={{ backgroundColor: level.dotColor }}
                        />
                        {level.label.slice(0, 3)}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            
            {/* Action Buttons - Inline */}
            <div className="inline-flex items-center gap-1">
              {selectedLanguage.trim() && (
                <button
                  onClick={addLanguage}
                  className={cn(
                    "w-6 h-6 flex items-center justify-center rounded transition-all duration-200",
                    "bg-green-500 hover:bg-green-600 text-white shadow-sm hover:shadow-md"
                  )}
                  title="Add language"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </button>
              )}
              <button
                onClick={resetAddLanguageForm}
                className={cn(
                  "w-6 h-6 flex items-center justify-center rounded transition-all duration-200",
                  isDarkTheme
                    ? "text-gray-400 hover:text-gray-300 hover:bg-[#2E3A48]"
                    : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                )}
                title="Cancel"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>


      {/* Empty State - Compact */}
      {languages.length === 0 && !isAddingLanguage && (
        <div className={cn(
          "text-center py-6 rounded-lg border border-dashed transition-colors duration-200",
          isDarkTheme 
            ? "border-[#40505C] text-gray-400"
            : "border-gray-300 text-gray-500"
        )}>
          <div className="mb-2 text-lg opacity-60">🗣️</div>
          <p className="text-[13px] mb-3 font-medium">No languages added yet</p>
          <button
            onClick={() => setIsAddingLanguage(true)}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-medium transition-all duration-200",
              "border border-dashed hover:shadow-sm group",
              isDarkTheme 
                ? "border-[#5A6570] text-gray-300 hover:border-[#6A7580] hover:text-white hover:bg-[#2E3A48]"
                : "border-gray-400 text-gray-700 hover:border-gray-500 hover:text-gray-800 hover:bg-gray-50"
            )}
          >
            <svg className="w-3 h-3 transition-transform duration-200 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Add Your First Language
          </button>
        </div>
      )}
    </div>
  );
}