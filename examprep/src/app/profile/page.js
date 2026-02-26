"use client";
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaPhone, FaCrown, FaCalendarAlt, FaSave, FaSpinner, FaEdit, FaShieldAlt } from 'react-icons/fa';

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

                // Clear success message after 3 seconds
                setTimeout(() => setMessage({ type: '', text: '' }), 3000);
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
            <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-teal-200 rounded-full animate-ping absolute opacity-50"></div>
                    <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin relative z-10"></div>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
                <div className="text-center p-10 bg-white rounded-3xl shadow-xl">
                    <FaShieldAlt className="text-4xl text-gray-300 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-700">Failed to load profile.</h2>
                    <p className="text-gray-500 mt-2">Please try refreshing the page.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] relative overflow-hidden pb-20">
            {/* Premium Background Elements */}
            <div className="absolute top-0 w-full h-[300px] bg-gradient-to-b from-teal-50/80 to-transparent -z-10"></div>
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-teal-200/20 rounded-full blur-[100px] -z-10 animate-pulse"></div>
            <div className="absolute bottom-[10%] right-[-5%] w-[400px] h-[400px] bg-emerald-200/20 rounded-full blur-[100px] -z-10 animate-blob"></div>

            <div className="container mx-auto p-4 md:p-8 max-w-5xl pt-12">

                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-4"
                >
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Account Settings</h1>
                        <p className="text-gray-500 font-medium mt-1">Manage your personal information and preferences.</p>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Profile Card */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl shadow-teal-900/5 border border-white p-8 flex flex-col items-center text-center relative overflow-hidden group"
                        >
                            <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-br from-teal-400 to-emerald-500 opacity-20 -z-10"></div>

                            <div className="relative w-32 h-32 mb-5">
                                <div className="absolute inset-0 bg-teal-400 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                                {profile.image ? (
                                    <Image
                                        src={profile.image}
                                        alt={profile.name}
                                        fill
                                        className="rounded-full object-cover border-4 border-white shadow-lg relative z-10"
                                    />
                                ) : (
                                    <div className="w-full h-full rounded-full bg-gradient-to-br from-teal-50 to-emerald-50 flex items-center justify-center text-teal-600 text-5xl font-black border-4 border-white shadow-lg relative z-10">
                                        {profile.name?.[0] || 'U'}
                                    </div>
                                )}

                                {profile.subscription === 'paid' && (
                                    <div className="absolute -bottom-2 -right-2 bg-gradient-to-br from-amber-400 to-orange-500 text-white p-2.5 rounded-full border-4 border-white shadow-md z-20" title="Premium Member">
                                        <FaCrown size={16} />
                                    </div>
                                )}
                            </div>

                            <h2 className="text-2xl font-black text-gray-900 mb-2 leading-tight">{profile.name}</h2>

                            <div className="flex items-center gap-2 mb-6">
                                <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border ${profile.subscription === 'paid'
                                    ? 'bg-amber-50 text-amber-700 border-amber-200 shadow-sm'
                                    : 'bg-gray-50 text-gray-500 border-gray-200'
                                    }`}>
                                    {profile.subscription === 'paid' ? 'Premium MVP' : 'Free Tier'}
                                </span>
                            </div>

                            <div className="w-full pt-6 border-t border-gray-100 flex flex-col gap-3 text-sm font-medium text-gray-500">
                                <div className="flex justify-between items-center bg-gray-50/50 p-3 rounded-xl border border-gray-50">
                                    <span className="flex items-center gap-2 text-gray-500">
                                        <FaCalendarAlt className="text-teal-500" /> Member Since
                                    </span>
                                    <span className="text-gray-900 font-bold">{new Date(profile.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => signOut({ callbackUrl: '/' })}
                                className="mt-8 w-full bg-red-50 hover:bg-red-500 text-red-600 hover:text-white py-3.5 rounded-xl font-bold transition-all text-sm shadow-sm border border-red-100 hover:border-transparent"
                            >
                                Sign Out Securely
                            </button>
                        </motion.div>
                    </div>

                    {/* Right Column: Details Form */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl shadow-teal-900/5 border border-white p-8 md:p-10"
                        >
                            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-50">
                                <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 border border-teal-100">
                                    <FaEdit size={20} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">Personal Details</h3>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Update your profile info</p>
                                </div>
                            </div>

                            <form onSubmit={handleUpdate} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Full Name (Editable) */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                                            Full Name
                                        </label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <FaUser className="text-gray-400 group-focus-within:text-teal-500 transition-colors" />
                                            </div>
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder="Enter your full name"
                                                className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 bg-white focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium text-gray-800 placeholder-gray-400 shadow-sm"
                                            />
                                        </div>
                                    </div>

                                    {/* Phone Number (Editable) */}
                                    <div className="md:col-span-1">
                                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                                            Phone Number
                                        </label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <FaPhone className="text-gray-400 group-focus-within:text-teal-500 transition-colors" />
                                            </div>
                                            <input
                                                type="tel"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                placeholder="e.g. +1 234 567 8900"
                                                className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 bg-white focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium text-gray-800 placeholder-gray-400 shadow-sm"
                                            />
                                        </div>
                                    </div>

                                    {/* Email (Read Only) */}
                                    <div className="md:col-span-1">
                                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1 flex justify-between">
                                            Email Address <span className="text-[10px] text-gray-400 uppercase tracking-wider bg-gray-100 px-2 py-0.5 rounded-md">Primary</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <FaEnvelope className="text-teal-600/50" />
                                            </div>
                                            <input
                                                type="email"
                                                value={profile.email}
                                                disabled
                                                className="w-full pl-12 pr-4 py-4 rounded-xl bg-gray-50/80 border border-gray-100 text-gray-600 font-medium cursor-not-allowed shadow-inner"
                                            />
                                        </div>
                                        <p className="mt-2 ml-1 text-xs font-medium text-gray-400 flex items-center gap-1.5"><FaShieldAlt /> Managed by Google Auth</p>
                                    </div>
                                </div>

                                {/* Message Area */}
                                {message.text && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className={`p-4 rounded-xl text-sm font-bold border flex items-center gap-3 ${message.type === 'success'
                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                            : 'bg-red-50 text-red-700 border-red-200'
                                            }`}
                                    >
                                        <div className={`w-2 h-2 rounded-full ${message.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                                        {message.text}
                                    </motion.div>
                                )}

                                {/* Action Buttons */}
                                <div className="pt-8 border-t border-gray-50 flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="flex items-center gap-2 bg-gradient-to-r from-teal-600 to-emerald-500 hover:from-teal-500 hover:to-emerald-400 text-white px-8 py-4 rounded-xl font-black text-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-teal-500/30 hover:shadow-xl hover:-translate-y-0.5"
                                    >
                                        {saving ? (
                                            <>
                                                <FaSpinner className="animate-spin text-lg" /> Processing...
                                            </>
                                        ) : (
                                            <>
                                                <FaSave className="text-lg" /> Save Changes
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
