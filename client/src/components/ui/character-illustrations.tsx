import React from 'react';
import { cn } from '@/lib/utils';

interface IllustrationProps {
  className?: string;
  width?: number;
  height?: number;
}

export const EmiliaIllustration: React.FC<IllustrationProps> = ({ 
  className, 
  width = 120, 
  height = 120 
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("", className)}
    >
      <circle cx="60" cy="60" r="60" fill="#F9A8D4" fillOpacity="0.3" />
      <circle cx="60" cy="40" r="20" fill="#F9A8D4" />
      <circle cx="53" cy="35" r="3" fill="#FFFFFF" />
      <circle cx="67" cy="35" r="3" fill="#FFFFFF" />
      <circle cx="53" cy="35" r="1.5" fill="#000000" />
      <circle cx="67" cy="35" r="1.5" fill="#000000" />
      <path d="M54 47C57.3333 50.3333 62.6667 50.3333 66 47" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M60 60V80" stroke="#F9A8D4" strokeWidth="3" strokeLinecap="round" />
      <path d="M60 80L45 95" stroke="#F9A8D4" strokeWidth="3" strokeLinecap="round" />
      <path d="M60 80L75 95" stroke="#F9A8D4" strokeWidth="3" strokeLinecap="round" />
      <path d="M40 60H80" stroke="#F9A8D4" strokeWidth="3" strokeLinecap="round" />
      <path d="M40 40H45" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M75 40H80" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
};

export const MentorIllustration: React.FC<IllustrationProps> = ({ 
  className, 
  width = 120, 
  height = 120 
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("", className)}
    >
      <circle cx="60" cy="60" r="60" fill="#93C5FD" fillOpacity="0.3" />
      <path d="M40 40L80 40L60 20L40 40Z" fill="#93C5FD" />
      <circle cx="60" cy="50" r="15" fill="#93C5FD" />
      <circle cx="54" cy="47" r="2.5" fill="#FFFFFF" />
      <circle cx="66" cy="47" r="2.5" fill="#FFFFFF" />
      <circle cx="54" cy="47" r="1" fill="#000000" />
      <circle cx="66" cy="47" r="1" fill="#000000" />
      <path d="M54 55C56.6667 58 63.3333 58 66 55" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M45 85C45 74.5 52 66.5 60 66.5C68 66.5 75 74.5 75 85" stroke="#93C5FD" strokeWidth="3" strokeLinecap="round" />
      <path d="M35 95C35 77 46.5 65 60 65C73.5 65 85 77 85 95" stroke="#93C5FD" strokeWidth="3" strokeLinecap="round" />
      <path d="M60 20L60 30" stroke="#93C5FD" strokeWidth="3" strokeLinecap="round" />
      <circle cx="60" cy="35" r="2" fill="#93C5FD" />
    </svg>
  );
};

export const AnalystIllustration: React.FC<IllustrationProps> = ({ 
  className, 
  width = 120, 
  height = 120 
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("", className)}
    >
      <circle cx="60" cy="60" r="60" fill="#6EE7B7" fillOpacity="0.3" />
      <path d="M35 40H85V80H35V40Z" fill="#6EE7B7" />
      <path d="M45 50L55 70" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
      <path d="M55 70L65 55" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
      <path d="M65 55L75 65" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
      <circle cx="45" cy="50" r="4" fill="#FFFFFF" stroke="#6EE7B7" strokeWidth="1" />
      <circle cx="55" cy="70" r="4" fill="#FFFFFF" stroke="#6EE7B7" strokeWidth="1" />
      <circle cx="65" cy="55" r="4" fill="#FFFFFF" stroke="#6EE7B7" strokeWidth="1" />
      <circle cx="75" cy="65" r="4" fill="#FFFFFF" stroke="#6EE7B7" strokeWidth="1" />
      <path d="M35 90L45 80" stroke="#6EE7B7" strokeWidth="3" strokeLinecap="round" />
      <path d="M85 90L75 80" stroke="#6EE7B7" strokeWidth="3" strokeLinecap="round" />
      <path d="M35 30L45 40" stroke="#6EE7B7" strokeWidth="3" strokeLinecap="round" />
      <path d="M85 30L75 40" stroke="#6EE7B7" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
};

export const CoachIllustration: React.FC<IllustrationProps> = ({ 
  className, 
  width = 120, 
  height = 120 
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("", className)}
    >
      <circle cx="60" cy="60" r="60" fill="#FCD34D" fillOpacity="0.3" />
      <path d="M50 25L70 25L75 45H45L50 25Z" fill="#FCD34D" />
      <circle cx="60" cy="55" r="15" fill="#FCD34D" />
      <circle cx="54" cy="52" r="2.5" fill="#FFFFFF" />
      <circle cx="66" cy="52" r="2.5" fill="#FFFFFF" />
      <circle cx="54" cy="52" r="1" fill="#000000" />
      <circle cx="66" cy="52" r="1" fill="#000000" />
      <path d="M54 60C57.3333 63 62.6667 63 66 60" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M45 75C49 72.5 55 70 60 70C65 70 71 72.5 75 75" stroke="#FCD34D" strokeWidth="3" strokeLinecap="round" />
      <path d="M40 85C46 80 55 75 60 75C65 75 74 80 80 85" stroke="#FCD34D" strokeWidth="3" strokeLinecap="round" />
      <path d="M35 95C43 88 55 80 60 80C65 80 77 88 85 95" stroke="#FCD34D" strokeWidth="3" strokeLinecap="round" />
      <path d="M60 45V25" stroke="#FCD34D" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
};