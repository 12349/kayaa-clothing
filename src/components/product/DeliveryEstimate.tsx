import React, { useState } from 'react';
import { BRAND_CONFIG } from '../../config/brand';
import { Calendar, Truck, Clock, Sparkles } from 'lucide-react';

interface DeliveryEstimateProps {
  isMadeToMeasure: boolean;
  readyLeadDays: number;
  customLeadDays: number;
  capacityPerWeek: number;
}

export const DeliveryEstimate: React.FC<DeliveryEstimateProps> = ({
  isMadeToMeasure,
  readyLeadDays,
  customLeadDays,
  capacityPerWeek,
}) => {
  const [selectedZone, setSelectedZone] = useState<keyof typeof BRAND_CONFIG.shippingZones>('IN');

  const zone = BRAND_CONFIG.shippingZones[selectedZone];
  const leadDays = isMadeToMeasure ? customLeadDays : readyLeadDays;

  // Compute actual calendar dates
  const today = new Date();
  
  // Dispatch Date
  const dispatchDate = new Date(today);
  dispatchDate.setDate(today.getDate() + leadDays);

  // Delivery Max Date
  const deliveryDate = new Date(dispatchDate);
  deliveryDate.setDate(dispatchDate.getDate() + zone.transitMaxDays);

  const formatDate = (d: Date) =>
    new Intl.DateTimeFormat('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    }).format(d);

  return (
    <div className="bg-chalk/50 dark:bg-chalk-dark/40 border border-chalk-border dark:border-chalk-dark rounded p-3.5 space-y-2.5 text-xs">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-jamun dark:text-kora flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
          <Truck className="w-3.5 h-3.5 text-gulab" />
          <span>Estimated Delivery Date</span>
        </span>

        {/* Destination country select */}
        <select
          value={selectedZone}
          onChange={(e) => setSelectedZone(e.target.value as any)}
          aria-label="Select delivery destination"
          className="bg-white dark:bg-jamun-surface text-jamun dark:text-kora text-[11px] font-medium px-2 py-0.5 rounded border border-chalk-border dark:border-chalk-dark"
        >
          <option value="IN">Delivery to India</option>
          <option value="AE">UAE & Gulf</option>
          <option value="US">United States</option>
          <option value="GB">United Kingdom</option>
          <option value="CA">Canada</option>
          <option value="AU">Australia</option>
          <option value="ROW">Rest of World</option>
        </select>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="font-display text-base font-bold text-jamun dark:text-kora">
          {formatDate(deliveryDate)}
        </span>
        <span className="text-jamun/70 dark:text-kora/70 text-[11px]">
          (if ordered today)
        </span>
      </div>

      <div className="text-[11px] text-jamun/75 dark:text-kora/75 space-y-1 pt-1 border-t border-chalk-border/50 dark:border-chalk-dark">
        <div className="flex items-center justify-between">
          <span>Studio dispatch by:</span>
          <strong className="text-jamun dark:text-kora">{formatDate(dispatchDate)}</strong>
        </div>
        <div className="flex items-center justify-between text-jamun/60 dark:text-kora/60">
          <span>{zone.name} transit time:</span>
          <span>{zone.transitMinDays}–{zone.transitMaxDays} days via express courier</span>
        </div>
        {isMadeToMeasure && (
          <div className="text-[10px] text-panna dark:text-panna-light flex items-center gap-1 mt-1 font-medium">
            <Sparkles className="w-3 h-3 flex-shrink-0" />
            <span>Honest slot guarantee: Studio capacity is {capacityPerWeek} custom pieces this week.</span>
          </div>
        )}
      </div>
    </div>
  );
};
