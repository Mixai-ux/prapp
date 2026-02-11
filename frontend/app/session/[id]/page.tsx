"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useProfile } from '../../../hooks/useProfile';
import { Loader2, CheckCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function SessionPage() {
  const router = useRouter();
  const params = useParams();
  const { profile, updateProfile } = useProfile();
  const [status, setStatus] = useState<'initializing' | 'active' | 'completed'>('initializing');

  useEffect(() => {
    // Simulate session initialization
    const timer = setTimeout(() => {
      setStatus('active');
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const completeSession = () => {
    // Update profile to activated state and add a dummy session
    const newSession = {
      id: params.id as string,
      type: profile.preparationType,
      subtype: profile.meetingSubtype,
      date: new Date().toISOString(),
      status: 'completed' as const,
      score: 85
    };

    const newImprovements = [
      "Structure your answers using the STAR method more consistently.",
      "Pause briefly before answering complex questions to gather your thoughts.",
      "Use more specific metrics when describing your past achievements."
    ];

    updateProfile({
      activationState: 'activated',
      sessions: [newSession, ...profile.sessions],
      improvements: newImprovements
    });

    setStatus('completed');
  };

  if (status === 'initializing') {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <Loader2 className="w-12 h-12 text-amber-400 animate-spin mb-4" />
        <h2 className="text-xl font-bold">Initializing AI Session...</h2>
        <p className="text-slate-400 mt-2">Preparing your {profile.preparationType.toLowerCase()} scenario</p>
      </div>
    );
  }

  if (status === 'completed') {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white p-6 text-center">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        <h2 className="text-3xl font-bold mb-2">Session Completed!</h2>
        <p className="text-slate-400 max-w-md mb-8">
          Great job! We've analyzed your performance and generated some personalized improvements for you.
        </p>
        <Link 
          href="/profile"
          className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold py-3 px-8 rounded-lg transition-colors"
        >
          View Results & Profile
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* Header */}
      <div className="border-b border-white/10 p-4 flex items-center justify-between bg-slate-900/50">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="font-mono text-sm text-slate-300">LIVE SESSION • 00:42</span>
        </div>
        <button 
          onClick={() => router.push('/profile')}
          className="text-slate-400 hover:text-white text-sm"
        >
          Exit
        </button>
      </div>

      {/* Chat Area Placeholder */}
      <div className="flex-1 p-6 overflow-y-auto space-y-6 max-w-3xl mx-auto w-full">
        {/* AI Message */}
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-amber-400/20 flex items-center justify-center flex-shrink-0 border border-amber-400/30">
            <span className="font-bold text-amber-400 text-xs">AI</span>
          </div>
          <div className="bg-slate-900 border border-white/10 rounded-2xl rounded-tl-none p-4 max-w-[80%]">
            <p className="text-slate-200 leading-relaxed">
              Hello! I'm ready to help you prepare for your <strong>{profile.preparationType}</strong>. 
              Based on your agenda, we'll focus on <strong>{profile.agenda || 'general topics'}</strong>.
              <br /><br />
              Let's start with a simple question: Tell me a little bit about yourself and why you're interested in this opportunity?
            </p>
          </div>
        </div>

        {/* User Message Placeholder */}
        <div className="flex gap-4 flex-row-reverse opacity-50">
          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0 border border-white/10">
            <span className="font-bold text-slate-400 text-xs">YOU</span>
          </div>
          <div className="bg-slate-800 border border-white/5 rounded-2xl rounded-tr-none p-4 max-w-[80%]">
            <div className="h-2 w-32 bg-slate-700 rounded mb-2" />
            <div className="h-2 w-48 bg-slate-700 rounded" />
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-white/10 bg-slate-900/50 backdrop-blur-md">
        <div className="max-w-3xl mx-auto">
          <div className="bg-slate-950 border border-white/10 rounded-xl p-2 flex items-center gap-2">
            <button className="p-2 text-slate-400 hover:text-white transition-colors">
              <div className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center">
                <div className="w-2 h-2 bg-current rounded-full" />
              </div>
            </button>
            <input 
              type="text" 
              placeholder="Type your response..." 
              className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder:text-slate-600"
              disabled
            />
            <button 
              onClick={completeSession}
              className="bg-amber-400 hover:bg-amber-500 text-slate-950 px-4 py-2 rounded-lg font-bold text-sm transition-colors"
            >
              End Session (Demo)
            </button>
          </div>
          <p className="text-center text-xs text-slate-600 mt-2">
            This is a demo session. Click "End Session" to see the activated profile state.
          </p>
        </div>
      </div>
    </div>
  );
}

