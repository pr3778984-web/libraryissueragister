import React from 'react';
import { getStudentDefaultAvatar } from '../utils/photoHelpers';

interface StudentAvatarProps {
  photoUrl?: string;
  name: string;
  rollNo?: number;
  standard?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
  title?: string;
}

export const StudentAvatar: React.FC<StudentAvatarProps> = ({
  photoUrl,
  name,
  rollNo = 1,
  standard = '1',
  size = 'md',
  className = '',
  onClick,
  title,
}) => {
  const sizeClasses = {
    xs: 'w-7 h-7 text-[10px]',
    sm: 'w-9 h-9 text-xs',
    md: 'w-11 h-11 text-sm',
    lg: 'w-16 h-16 text-base',
    xl: 'w-24 h-24 text-xl',
  };

  const effectivePhoto = photoUrl || getStudentDefaultAvatar(name, rollNo, standard);

  return (
    <div
      onClick={onClick}
      title={title || name}
      className={`relative inline-block shrink-0 rounded-full overflow-hidden border border-slate-200 shadow-2xs bg-slate-100 ${
        sizeClasses[size]
      } ${onClick ? 'cursor-pointer hover:ring-2 hover:ring-amber-500 transition-all' : ''} ${className}`}
    >
      <img
        src={effectivePhoto}
        alt={name}
        className="w-full h-full object-cover"
        referrerPolicy="no-referrer"
        onError={e => {
          // Fallback to vector avatar if user uploaded broken image
          (e.target as HTMLImageElement).src = getStudentDefaultAvatar(name, rollNo, standard);
        }}
      />
    </div>
  );
};
