
import React from 'react';
import { APP_CONFIG } from '../constants';

interface SaiAvatarProps {
  gender: 'male' | 'female';
  photoURL?: string | null;
  size?: number;
  className?: string;
  isOnline?: boolean;
}

/**
 * Enhanced SaiAvatar component with premium gold ring and refined visuals.
 * Respects user's actual photo if present, otherwise uses gendered default.
 */
const SaiAvatar: React.FC<SaiAvatarProps> = ({ gender, photoURL, size = 64, className = "", isOnline = false }) => {

  // Use the uploaded photo if present, otherwise fallback
  const fallbackUrl = gender === 'male' ? APP_CONFIG.AVATAR_MALE : APP_CONFIG.AVATAR_FEMALE;
  const imageUrl = photoURL || fallbackUrl;

  return (
    <div
      className={`relative rounded-full p-1 bg-gold-gradient shadow-xl ${className}`}
      style={{ width: size, height: size }}
    >
      <div className="w-full h-full rounded-full overflow-hidden bg-white flex items-center justify-center border-2 border-white/50">
        <img
          src={imageUrl}
          alt={`${gender} avatar`}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback to DiceBear if the provided link (e.g. google photos share link) fails to load as an image
            const seed = gender === 'male' ? 'Felix' : 'Anita';
            const skinColor = "d2b48c";
            const hairColor = "000000";
            const top = gender === 'male' ? 'shortHair' : 'longHair';
            e.currentTarget.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&skinColor=${skinColor}&hairColor=${hairColor}&top=${top}`;
          }}
        />
      </div>

      {/* Online indicator */}
      {isOnline && (
        <span className="absolute bottom-1 right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full shadow-sm z-10"></span>
      )}
    </div>
  );
};

export default SaiAvatar;
