'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import {
  User,
  Bell,
  Mail,
  MapPin,
  Shield,
  Loader2,
  ArrowLeft,
  Check,
  Save,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState({
    full_name: '',
    state: '',
    party_preference: '' as 'R' | 'D' | 'I' | '',
  });
  const [notifications, setNotifications] = useState({
    trade_alerts: true,
    weekly_digest: true,
    breaking_news: false,
  });
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUser(user);
      setProfile({
        full_name: user.user_metadata?.full_name || '',
        state: user.user_metadata?.state || '',
        party_preference: user.user_metadata?.party_preference || '',
      });
      setLoading(false);
    };

    loadUser();
  }, [router, supabase.auth]);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase.auth.updateUser({
      data: {
        full_name: profile.full_name,
        state: profile.state,
        party_preference: profile.party_preference,
        notifications,
      },
    });

    if (!error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/"
            className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.16] transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[#a0a0aa]" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Settings</h1>
            <p className="text-[#6b6b7a]">Manage your account preferences</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Profile Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-xl bg-white/[0.02] border border-white/[0.06]"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <User className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Profile</h2>
                <p className="text-xs text-[#6b6b7a]">Your personal information</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-[#a0a0aa] mb-2">Full Name</label>
                <input
                  type="text"
                  value={profile.full_name}
                  onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                  className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white placeholder-[#6b6b7a] focus:outline-none focus:border-blue-500/50 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm text-[#a0a0aa] mb-2">Email</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full px-4 py-3 bg-white/[0.02] border border-white/[0.04] rounded-lg text-[#6b6b7a] cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm text-[#a0a0aa] mb-2">Your State</label>
                <select
                  value={profile.state}
                  onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                  className="w-full px-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white focus:outline-none focus:border-blue-500/50 transition-colors"
                >
                  <option value="">Select your state</option>
                  {US_STATES.map((state) => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-[#a0a0aa] mb-2">Party Preference</label>
                <div className="flex gap-3">
                  {[
                    { value: 'D', label: 'Democrat', color: 'blue' },
                    { value: 'R', label: 'Republican', color: 'red' },
                    { value: 'I', label: 'Independent', color: 'purple' },
                  ].map((party) => (
                    <button
                      key={party.value}
                      onClick={() => setProfile({ ...profile, party_preference: party.value as 'R' | 'D' | 'I' })}
                      className={cn(
                        'flex-1 py-3 rounded-lg border text-sm font-medium transition-all',
                        profile.party_preference === party.value
                          ? party.color === 'blue'
                            ? 'bg-blue-500/20 border-blue-500/40 text-blue-400'
                            : party.color === 'red'
                            ? 'bg-red-500/20 border-red-500/40 text-red-400'
                            : 'bg-purple-500/20 border-purple-500/40 text-purple-400'
                          : 'bg-white/[0.02] border-white/[0.08] text-[#6b6b7a] hover:border-white/[0.16]'
                      )}
                    >
                      {party.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Notifications Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-xl bg-white/[0.02] border border-white/[0.06]"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <Bell className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Notifications</h2>
                <p className="text-xs text-[#6b6b7a]">Control what alerts you receive</p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { key: 'trade_alerts', label: 'Trade Alerts', desc: 'Get notified when watched politicians make trades' },
                { key: 'weekly_digest', label: 'Weekly Digest', desc: 'Summary of activity from your watchlist' },
                { key: 'breaking_news', label: 'Breaking News', desc: 'Major corruption or scandal alerts' },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-4 rounded-lg bg-white/[0.02] border border-white/[0.04]"
                >
                  <div>
                    <p className="text-sm font-medium text-white">{item.label}</p>
                    <p className="text-xs text-[#6b6b7a]">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key as keyof typeof notifications] })}
                    className={cn(
                      'w-12 h-6 rounded-full transition-colors relative',
                      notifications[item.key as keyof typeof notifications]
                        ? 'bg-green-500'
                        : 'bg-white/[0.08]'
                    )}
                  >
                    <div
                      className={cn(
                        'w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform',
                        notifications[item.key as keyof typeof notifications]
                          ? 'translate-x-6'
                          : 'translate-x-0.5'
                      )}
                    />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Privacy Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-xl bg-white/[0.02] border border-white/[0.06]"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Privacy & Security</h2>
                <p className="text-xs text-[#6b6b7a]">Manage your data</p>
              </div>
            </div>

            <div className="space-y-3">
              <button className="w-full text-left p-4 rounded-lg bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] transition-colors">
                <p className="text-sm font-medium text-white">Download My Data</p>
                <p className="text-xs text-[#6b6b7a]">Export your watchlist and preferences</p>
              </button>
              <button className="w-full text-left p-4 rounded-lg bg-red-500/5 border border-red-500/10 hover:border-red-500/20 transition-colors">
                <p className="text-sm font-medium text-red-400">Delete Account</p>
                <p className="text-xs text-[#6b6b7a]">Permanently remove your account and data</p>
              </button>
            </div>
          </motion.div>

          {/* Save Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={handleSave}
            disabled={saving}
            className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-lg text-white font-medium transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : saved ? (
              <>
                <Check className="w-5 h-5" />
                Saved!
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Changes
              </>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
