"use client";

import { useState, useEffect } from 'react';

export type ActivationState = 'new' | 'activated';

export interface Session {
  id: string;
  type: string;
  subtype?: string;
  date: string;
  status: 'completed' | 'aborted';
  score?: number;
  focus?: string;
}

export interface TrainingFocus {
  title: string;
  tags: string[];
  agendaTemplate: string;
}

export interface UserProfile {
  activationState: ActivationState;
  preparationType: string;
  meetingSubtype: string;
  agenda: string;
  tone: string;
  cvText: string;
  sessions: Session[];
  improvements: string[];
  trainingFocus?: TrainingFocus;
}

const DEFAULT_PROFILE: UserProfile = {
  activationState: 'new',
  preparationType: 'Interview',
  meetingSubtype: '',
  agenda: '',
  tone: 'Professional',
  cvText: '',
  sessions: [],
  improvements: []
};

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('prapp_profile');
    if (saved) {
      try {
        setProfile(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse profile', e);
      }
    }
    setIsLoaded(true);
  }, []);

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => {
      const newProfile = { ...prev, ...updates };
      localStorage.setItem('prapp_profile', JSON.stringify(newProfile));
      return newProfile;
    });
  };

  const resetProfile = () => {
    setProfile(DEFAULT_PROFILE);
    localStorage.setItem('prapp_profile', JSON.stringify(DEFAULT_PROFILE));
  };

  return { profile, updateProfile, resetProfile, isLoaded };
}

