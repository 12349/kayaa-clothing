import React, { useState, useEffect } from 'react';
import { MeasurementProfile } from '../../types';
import { inToCm } from '../../config/brand';
import { Scissors, Bookmark, Check, HelpCircle, Sparkles } from 'lucide-react';

interface MeasurementFormProps {
  category: string;
  measurements: MeasurementProfile;
  onChange: (updated: MeasurementProfile) => void;
  customNote: string;
  onCustomNoteChange: (note: string) => void;
}

export const MeasurementForm: React.FC<MeasurementFormProps> = ({
  category,
  measurements,
  onChange,
  customNote,
  onCustomNoteChange,
}) => {
  const [savedProfiles, setSavedProfiles] = useState<MeasurementProfile[]>([]);
  const [saveProfileName, setSaveProfileName] = useState('');
  const [saveSuccessMessage, setSaveSuccessMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    try {
      const stored = localStorage.getItem('kayaa_saved_profiles');
      if (stored) {
        setSavedProfiles(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleUnitToggle = (newUnit: 'in' | 'cm') => {
    if (newUnit === measurements.unit) return;
    
    // Convert values
    const factor = newUnit === 'cm' ? 2.54 : 1 / 2.54;
    const round = (val: number | undefined) =>
      val ? Math.round(val * factor * 10) / 10 : undefined;

    onChange({
      ...measurements,
      unit: newUnit,
      bust: round(measurements.bust) || 0,
      waist: round(measurements.waist) || 0,
      hips: round(measurements.hips) || 0,
      height: round(measurements.height) || 0,
      shoulder: round(measurements.shoulder),
      blouseSleeveLength: round(measurements.blouseSleeveLength),
      lehengaWaistToFloor: round(measurements.lehengaWaistToFloor),
    });
  };

  const handleFieldChange = (field: keyof MeasurementProfile, value: any) => {
    const updated = { ...measurements, [field]: value };
    onChange(updated);

    // Validate ranges
    const isCm = measurements.unit === 'cm';
    const minVal = isCm ? 50 : 20;
    const maxVal = isCm ? 180 : 70;

    if (['bust', 'waist', 'hips'].includes(field)) {
      const num = Number(value);
      if (num && (num < minVal || num > maxVal)) {
        setErrors((prev) => ({
          ...prev,
          [field]: `Please enter a realistic ${measurements.unit} measurement (${minVal}–${maxVal}).`,
        }));
      } else {
        setErrors((prev) => {
          const c = { ...prev };
          delete c[field];
          return c;
        });
      }
    }
  };

  const handleSaveProfile = () => {
    if (!saveProfileName.trim()) return;
    const profileToSave: MeasurementProfile = {
      ...measurements,
      profileName: saveProfileName.trim(),
    };
    const updated = [...savedProfiles, profileToSave];
    setSavedProfiles(updated);
    localStorage.setItem('kayaa_saved_profiles', JSON.stringify(updated));
    setSaveSuccessMessage(`Profile "${saveProfileName}" saved!`);
    setSaveProfileName('');
    setTimeout(() => setSaveSuccessMessage(''), 3000);
  };

  const handleLoadProfile = (profile: MeasurementProfile) => {
    onChange(profile);
  };

  return (
    <div className="bg-chalk-subtle dark:bg-chalk-dark/70 border-2 border-gulab/40 p-5 rounded-lg space-y-5 animate-in fade-in duration-300">
      {/* Header & Unit Switch */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-chalk-border dark:border-chalk-dark">
        <div className="flex items-center gap-2">
          <Scissors className="w-4 h-4 text-gulab" />
          <h4 className="font-display font-semibold text-sm text-jamun dark:text-kora">
            Bespoke Atelier Measurements
          </h4>
        </div>

        {/* Inches / CM Toggle */}
        <div className="inline-flex rounded border border-chalk-border dark:border-chalk-dark overflow-hidden text-xs">
          <button
            type="button"
            onClick={() => handleUnitToggle('in')}
            className={`px-3 py-1 font-semibold transition-colors ${
              measurements.unit === 'in'
                ? 'bg-jamun text-kora'
                : 'bg-white dark:bg-jamun-surface text-jamun dark:text-kora hover:bg-chalk'
            }`}
          >
            Inches
          </button>
          <button
            type="button"
            onClick={() => handleUnitToggle('cm')}
            className={`px-3 py-1 font-semibold transition-colors ${
              measurements.unit === 'cm'
                ? 'bg-jamun text-kora'
                : 'bg-white dark:bg-jamun-surface text-jamun dark:text-kora hover:bg-chalk'
            }`}
          >
            Centimetres
          </button>
        </div>
      </div>

      {/* Saved Profiles Quick Select */}
      {savedProfiles.length > 0 && (
        <div className="bg-white/80 dark:bg-jamun-surface/80 p-3 rounded border border-chalk-border dark:border-chalk-dark flex items-center justify-between flex-wrap gap-2 text-xs">
          <span className="text-jamun/70 dark:text-kora/70 flex items-center gap-1">
            <Bookmark className="w-3.5 h-3.5 text-gulab" />
            <span>Load saved profile:</span>
          </span>
          <div className="flex flex-wrap gap-1.5">
            {savedProfiles.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleLoadProfile(p)}
                className="px-2.5 py-1 rounded bg-chalk dark:bg-jamun text-jamun dark:text-kora font-medium hover:border-gulab border border-transparent transition-colors"
              >
                {p.profileName || `Profile #${idx + 1}`} ({p.bust}-{p.waist}-{p.hips})
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Core Body Measurements Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Bust */}
        <div>
          <label htmlFor="m-bust" className="block text-xs font-semibold text-jamun dark:text-kora mb-1">
            Bust ({measurements.unit}) *
          </label>
          <input
            id="m-bust"
            type="number"
            step="0.5"
            placeholder={measurements.unit === 'in' ? 'e.g. 36' : 'e.g. 91'}
            value={measurements.bust || ''}
            onChange={(e) => handleFieldChange('bust', parseFloat(e.target.value) || 0)}
            className="w-full p-2 text-sm rounded bg-white dark:bg-jamun-surface border border-chalk-border dark:border-chalk-dark text-jamun dark:text-kora focus:ring-1 focus:ring-gulab"
          />
          {errors.bust && <p className="text-[10px] text-rose-600 mt-0.5">{errors.bust}</p>}
        </div>

        {/* Waist */}
        <div>
          <label htmlFor="m-waist" className="block text-xs font-semibold text-jamun dark:text-kora mb-1">
            Waist ({measurements.unit}) *
          </label>
          <input
            id="m-waist"
            type="number"
            step="0.5"
            placeholder={measurements.unit === 'in' ? 'e.g. 30' : 'e.g. 76'}
            value={measurements.waist || ''}
            onChange={(e) => handleFieldChange('waist', parseFloat(e.target.value) || 0)}
            className="w-full p-2 text-sm rounded bg-white dark:bg-jamun-surface border border-chalk-border dark:border-chalk-dark text-jamun dark:text-kora focus:ring-1 focus:ring-gulab"
          />
          {errors.waist && <p className="text-[10px] text-rose-600 mt-0.5">{errors.waist}</p>}
        </div>

        {/* Hips */}
        <div>
          <label htmlFor="m-hips" className="block text-xs font-semibold text-jamun dark:text-kora mb-1">
            Hips ({measurements.unit}) *
          </label>
          <input
            id="m-hips"
            type="number"
            step="0.5"
            placeholder={measurements.unit === 'in' ? 'e.g. 40' : 'e.g. 102'}
            value={measurements.hips || ''}
            onChange={(e) => handleFieldChange('hips', parseFloat(e.target.value) || 0)}
            className="w-full p-2 text-sm rounded bg-white dark:bg-jamun-surface border border-chalk-border dark:border-chalk-dark text-jamun dark:text-kora focus:ring-1 focus:ring-gulab"
          />
          {errors.hips && <p className="text-[10px] text-rose-600 mt-0.5">{errors.hips}</p>}
        </div>

        {/* Height */}
        <div>
          <label htmlFor="m-height" className="block text-xs font-semibold text-jamun dark:text-kora mb-1">
            Height ({measurements.unit}) *
          </label>
          <input
            id="m-height"
            type="number"
            step="0.5"
            placeholder={measurements.unit === 'in' ? 'e.g. 65' : 'e.g. 165'}
            value={measurements.height || ''}
            onChange={(e) => handleFieldChange('height', parseFloat(e.target.value) || 0)}
            className="w-full p-2 text-sm rounded bg-white dark:bg-jamun-surface border border-chalk-border dark:border-chalk-dark text-jamun dark:text-kora focus:ring-1 focus:ring-gulab"
          />
        </div>
      </div>

      {/* Indian Couture Specific Additions */}
      <div className="pt-2 border-t border-chalk-border/60 dark:border-chalk-dark space-y-3">
        <div className="text-xs font-semibold text-jamun dark:text-kora uppercase tracking-wider">
          Garment Details & Finishing
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="m-sleeve" className="block text-xs text-jamun/80 dark:text-kora/80 mb-1">
              Blouse Sleeve Length ({measurements.unit})
            </label>
            <input
              id="m-sleeve"
              type="number"
              step="0.5"
              placeholder="e.g. 17 (elbow length) or 22 (full)"
              value={measurements.blouseSleeveLength || ''}
              onChange={(e) =>
                handleFieldChange('blouseSleeveLength', parseFloat(e.target.value) || undefined)
              }
              className="w-full p-2 text-xs rounded bg-white dark:bg-jamun-surface border border-chalk-border dark:border-chalk-dark text-jamun dark:text-kora"
            />
          </div>

          <div>
            <label htmlFor="m-floor" className="block text-xs text-jamun/80 dark:text-kora/80 mb-1">
              Waist-to-Floor Length with Heels ({measurements.unit})
            </label>
            <input
              id="m-floor"
              type="number"
              step="0.5"
              placeholder="e.g. 42 (measured with event footwear)"
              value={measurements.lehengaWaistToFloor || ''}
              onChange={(e) =>
                handleFieldChange('lehengaWaistToFloor', parseFloat(e.target.value) || undefined)
              }
              className="w-full p-2 text-xs rounded bg-white dark:bg-jamun-surface border border-chalk-border dark:border-chalk-dark text-jamun dark:text-kora"
            />
          </div>
        </div>

        {/* Toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
          <label className="flex items-center gap-2 p-2 rounded bg-white dark:bg-jamun-surface border border-chalk-border dark:border-chalk-dark cursor-pointer">
            <input
              type="checkbox"
              checked={measurements.blousePadding || false}
              onChange={(e) => handleFieldChange('blousePadding', e.target.checked)}
              className="rounded text-gulab focus:ring-gulab w-4 h-4"
            />
            <span className="text-jamun dark:text-kora font-medium">Blouse Cup Padding</span>
          </label>

          <label className="flex items-center gap-2 p-2 rounded bg-white dark:bg-jamun-surface border border-chalk-border dark:border-chalk-dark cursor-pointer">
            <input
              type="checkbox"
              checked={measurements.fallAndPico || false}
              onChange={(e) => handleFieldChange('fallAndPico', e.target.checked)}
              className="rounded text-gulab focus:ring-gulab w-4 h-4"
            />
            <span className="text-jamun dark:text-kora font-medium">Fall & Pico Finish</span>
          </label>

          <label className="flex items-center gap-2 p-2 rounded bg-white dark:bg-jamun-surface border border-chalk-border dark:border-chalk-dark cursor-pointer">
            <input
              type="checkbox"
              checked={measurements.petticoatNeeded || false}
              onChange={(e) => handleFieldChange('petticoatNeeded', e.target.checked)}
              className="rounded text-gulab focus:ring-gulab w-4 h-4"
            />
            <span className="text-jamun dark:text-kora font-medium">Matching Inskirt</span>
          </label>
        </div>
      </div>

      {/* Note per piece */}
      <div>
        <label htmlFor="custom-item-note" className="block text-xs font-semibold text-jamun dark:text-kora mb-1">
          Custom Note for Kayaa's Workbench
        </label>
        <textarea
          id="custom-item-note"
          rows={2}
          value={customNote}
          onChange={(e) => onCustomNoteChange(e.target.value)}
          placeholder="E.g. 'I am wearing 3-inch heels. Please make the neck 1 inch higher than the sample, needed for my brother’s reception on Nov 12th.'"
          className="w-full p-2 text-xs rounded bg-white dark:bg-jamun-surface border border-chalk-border dark:border-chalk-dark text-jamun dark:text-kora focus:ring-1 focus:ring-gulab placeholder:text-jamun/40 dark:placeholder:text-kora/40"
        />
      </div>

      {/* Save to profile tool */}
      <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <input
          type="text"
          placeholder="Save profile name (e.g. Diya Lehenga Fit)"
          value={saveProfileName}
          onChange={(e) => setSaveProfileName(e.target.value)}
          className="p-1.5 px-2.5 text-xs rounded bg-white dark:bg-jamun-surface border border-chalk-border dark:border-chalk-dark text-jamun dark:text-kora flex-1"
        />
        <button
          type="button"
          onClick={handleSaveProfile}
          disabled={!saveProfileName.trim()}
          className="px-3 py-1.5 bg-jamun dark:bg-kora text-kora dark:text-jamun rounded text-xs font-semibold disabled:opacity-40 flex items-center justify-center gap-1.5"
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>Save Profile</span>
        </button>
      </div>

      {saveSuccessMessage && (
        <p className="text-xs text-panna font-medium flex items-center gap-1">
          <Check className="w-3.5 h-3.5" />
          <span>{saveSuccessMessage}</span>
        </p>
      )}
    </div>
  );
};
