"use client";
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import { FaUser, FaEnvelope, FaPhone, FaCrown, FaCalendarAlt, FaSave, FaSpinner } from 'react-icons/fa';

export default function ProfilePage() {
    const { data: session, update } = useSession();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        async function fetchProfile() {
            try {
                const res = await fetch('/api/user/profile');
                if (res.ok) {
                    const data = await res.json();
                    setProfile(data);
                    setName(data.name || '');
                    setPhone(data.phone || '');
                } else {
                    console.error("Failed to fetch profile");
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchProfile();
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            const res = await fetch('/api/user/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, phone }),
            });

            if (res.ok) {
                setMessage({ type: 'success', text: 'Profile updated successfully!' });
                const updatedData = await res.json();
                setProfile(updatedData);
                await update(); // Trigger session update to reflect changes in Navbar
            } else {
                setMessage({ type: 'error', text: 'Failed to update profile.' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'An error occurred.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <FaSpinner className="animate-spin text-4xl text-blue-600" />
            </div>
        );
    }

    if (!profile) {
        return <div className="text-center p-10">Failed to load profile.</div>;
    }

    return (
        <div className="container mx-auto p-4 md:p-8 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">My Profile</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="col-span-1">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center">
                        <div className="relative w-32 h-32 mb-4">
                            {profile.image ? (
                                <Image
                                    src={profile.image}
                                    alt={profile.name}
                                    fill
                                    className="rounded-full object-cover border-4 border-blue-50"
                                />
                            ) : (
                                <div className="w-full h-full rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-4xl font-bold">
                                    {profile.name?.[0] || 'U'}
                                </div>
                            )}
                            {profile.subscription === 'paid' && (
                                <div className="absolute bottom-0 right-0 bg-amber-400 text-white p-2 rounded-full border-2 border-white" title="Premium Member">
                                    <FaCrown size={14} />
                                </div>
                            )}
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-1">{profile.name}</h2>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${profile.subscription === 'paid'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-gray-100 text-gray-600'
                            }`}>
                            {profile.subscription === 'paid' ? 'Premium Plan' : 'Free Plan'}
                        </span>

                        <div className="mt-6 w-full pt-6 border-t border-gray-100 flex justify-between text-sm text-gray-500">
                            <span className="flex items-center gap-2">
                                <FaCalendarAlt /> Joined
                            </span>
                            <span>{new Date(profile.createdAt).toLocaleDateString()}</span>
                        </div>

                        <button
                            onClick={() => signOut({ callbackUrl: '/' })}
                            className="mt-4 w-full bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-xl font-bold transition-all text-sm"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>

                {/* Details Form */}
                <div className="col-span-1 md:col-span-2">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <FaUser className="text-blue-500" />
                            Personal Details
                        </h3>

                        <form onSubmit={handleUpdate} className="space-y-6">
                            {/* Full Name (Editable) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaUser className="text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Enter your full name"
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>

                            {/* Email (Read Only) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaEnvelope className="text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        value={profile.email}
                                        disabled
                                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border-none text-gray-500 cursor-not-allowed"
                                    />
                                    <p className="mt-1 text-xs text-gray-400">Email cannot be changed.</p>
                                </div>
                            </div>

                            {/* Phone Number (Editable) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Number
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaPhone className="text-gray-400" />
                                    </div>
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="Enter your phone number"
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>

                            {/* Message Area */}
                            {message.text && (
                                <div className={`p-4 rounded-lg text-sm font-medium ${message.type === 'success'
                                    ? 'bg-green-50 text-green-700'
                                    : 'bg-red-50 text-red-700'
                                    }`}>
                                    {message.text}
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="pt-4 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20"
                                >
                                    {saving ? (
                                        <>
                                            <FaSpinner className="animate-spin" /> Saving...
                                        </>
                                    ) : (
                                        <>
                                            <FaSave /> Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
