import React, { useState } from 'react';
import { Send, MapPin, Mail, Phone, MessageSquare, CheckCircle, RefreshCw } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ToastContainer, useToast } from '../components/Toast';

const ContactPage: React.FC = () => {
    const { showToast, toasts, closeToast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: 'General Inquiry',
        message: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.message) {
            showToast("Please fill in all required fields.", "error");
            return;
        }

        setIsSubmitting(true);
        try {
            const currentUser = JSON.parse(localStorage.getItem('sms_user') || '{}');
            await addDoc(collection(db, 'contactSubmissions'), {
                ...formData,
                uid: currentUser.uid || 'guest',
                createdAt: serverTimestamp(),
                status: 'new'
            });
            showToast("Your message has been sent successfully!", "success");
            setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
        } catch (error) {
            console.error("Submission error:", error);
            showToast("Failed to send message. Please try again.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-16 font-poppins min-h-screen">
            <ToastContainer toasts={toasts} onClose={closeToast} />

            <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
                <h1 className="font-serif text-6xl font-bold text-navy-900 leading-tight">Connect with Us</h1>
                <p className="text-navy-500 text-lg leading-relaxed font-medium">
                    Have questions about our national events, sadhana programs, or membership?
                    Our team is here to support your spiritual journey.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Contact Info */}
                <div className="space-y-8">
                    <div className="bg-white p-8 rounded-bento shadow-xl border border-navy-50 space-y-8">
                        <h3 className="text-xl font-bold text-navy-900">National Headquarters</h3>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-gold-50 text-gold-600 rounded-2xl flex items-center justify-center shrink-0">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-navy-300 tracking-widest mb-1">Address</p>
                                    <p className="text-sm font-bold text-navy-900">6, Jalan 13/1, Seksyen 13, 46200 Petaling Jaya, Selangor, Malaysia</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center shrink-0">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-navy-300 tracking-widest mb-1">Email</p>
                                    <p className="text-sm font-bold text-navy-900">admin@ssiom.org.my</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center shrink-0">
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-navy-300 tracking-widest mb-1">Support</p>
                                    <p className="text-sm font-bold text-navy-900">+60 3-7955 0930</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-navy-900 p-8 rounded-bento text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 -rotate-12 transition-transform group-hover:scale-110 duration-700">
                            <MessageSquare size={100} />
                        </div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gold-500 mb-2">Live Support</h4>
                        <p className="text-sm text-navy-200">Our volunteers are available Mon-Fri, 9am - 5pm to assist with any technical or membership queries.</p>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="lg:col-span-2">
                    <form onSubmit={handleSubmit} className="bg-white p-10 md:p-12 rounded-bento shadow-2xl border border-navy-50 space-y-8 relative">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gold-gradient"></div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-navy-300 tracking-widest ml-1">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-6 py-4 bg-neutral-50 border border-navy-50 rounded-2xl text-sm font-bold focus:border-gold-500 outline-none transition-all"
                                    placeholder="Sai Ram, enter your name"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-navy-300 tracking-widest ml-1">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-6 py-4 bg-neutral-50 border border-navy-50 rounded-2xl text-sm font-bold focus:border-gold-500 outline-none transition-all"
                                    placeholder="your@email.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-navy-300 tracking-widest ml-1">Subject</label>
                            <select
                                value={formData.subject}
                                onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                className="w-full px-6 py-4 bg-neutral-50 border border-navy-50 rounded-2xl text-sm font-bold focus:border-gold-500 outline-none transition-all appearance-none"
                            >
                                <option>General Inquiry</option>
                                <option>Event Registration Support</option>
                                <option>Sadhana Technical Issue</option>
                                <option>Membership Query</option>
                                <option>Others</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-navy-300 tracking-widest ml-1">Your Message</label>
                            <textarea
                                required
                                rows={5}
                                value={formData.message}
                                onChange={e => setFormData({ ...formData, message: e.target.value })}
                                className="w-full px-6 py-4 bg-neutral-50 border border-navy-50 rounded-2xl text-sm font-bold focus:border-gold-500 outline-none transition-all resize-none"
                                placeholder="How can we help you today?"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full md:w-auto px-12 py-5 bg-navy-900 text-gold-500 font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-3"
                        >
                            {isSubmitting ? <RefreshCw className="animate-spin" size={16} /> : <Send size={16} />}
                            {isSubmitting ? "Sending Offering..." : "Send Message"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
