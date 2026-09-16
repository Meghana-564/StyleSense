import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GiClothespin } from 'react-icons/gi';
import {
  FiMail,
  FiLock,
  FiUser,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiStar,
  FiHeart,
  FiTrendingUp,
  FiCheckCircle,
} from 'react-icons/fi';

/* ─── floating particle component ─── */
function FloatingParticle({ delay, size, x, y, duration }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        left: `${x}%`,
        top: `${y}%`,
        background: `radial-gradient(circle, rgba(212,175,55,0.25) 0%, transparent 70%)`,
      }}
      animate={{
        y: [0, -30, 0],
        opacity: [0.2, 0.5, 0.2],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
}

/* ─── main sign page ─── */
export default function SignPage({ onAuth }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  // Clear errors when switching modes
  useEffect(() => {
    setErrors({});
    setSuccessMessage('');
  }, [isSignUp]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear field error on type
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (isSignUp && !form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Enter a valid email address';
    }
    if (!form.password) {
      newErrors.password = 'Password is required';
    } else if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setSuccessMessage('');

    // Simulated auth delay for premium feel
    await new Promise((r) => setTimeout(r, 1200));

    if (isSignUp) {
      // Store user in localStorage
      const users = JSON.parse(localStorage.getItem('stylesense_users') || '[]');
      const exists = users.find((u) => u.email === form.email);
      if (exists) {
        setErrors({ email: 'An account with this email already exists' });
        setIsLoading(false);
        return;
      }
      users.push({ name: form.name, email: form.email, password: form.password });
      localStorage.setItem('stylesense_users', JSON.stringify(users));
      localStorage.setItem(
        'stylesense_session',
        JSON.stringify({ name: form.name, email: form.email })
      );
      setIsLoading(false);
      onAuth({ name: form.name, email: form.email });
    } else {
      // Sign in
      const users = JSON.parse(localStorage.getItem('stylesense_users') || '[]');
      const user = users.find(
        (u) => u.email === form.email && u.password === form.password
      );
      if (!user) {
        setErrors({ email: 'Invalid email or password' });
        setIsLoading(false);
        return;
      }
      localStorage.setItem(
        'stylesense_session',
        JSON.stringify({ name: user.name, email: user.email })
      );
      setIsLoading(false);
      onAuth({ name: user.name, email: user.email });
    }
  };

  const particles = [
    { delay: 0, size: 6, x: 10, y: 20, duration: 4 },
    { delay: 1, size: 4, x: 80, y: 15, duration: 5 },
    { delay: 0.5, size: 8, x: 25, y: 70, duration: 3.5 },
    { delay: 2, size: 5, x: 70, y: 60, duration: 4.5 },
    { delay: 1.5, size: 3, x: 90, y: 40, duration: 3 },
    { delay: 0.8, size: 7, x: 50, y: 85, duration: 5.5 },
    { delay: 2.5, size: 4, x: 15, y: 50, duration: 4 },
    { delay: 1.2, size: 6, x: 60, y: 30, duration: 3.8 },
  ];

  const features = [
    { icon: <FiStar />, text: 'AI-Powered Styling' },
    { icon: <FiHeart />, text: 'Personalized Outfits' },
    { icon: <FiTrendingUp />, text: 'Live Fashion Trends' },
  ];

  return (
    <div className="min-h-screen bg-[#07090e] flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* ── Background glows ── */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gold-500/8 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-violet-600/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold-600/5 rounded-full blur-[200px] pointer-events-none" />

      {/* ── Floating particles ── */}
      {particles.map((p, i) => (
        <FloatingParticle key={i} {...p} />
      ))}

      {/* ── Main container ── */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 glassmorphism rounded-3xl overflow-hidden border border-white/[0.06] shadow-2xl shadow-black/40"
      >
        {/* ─── Left Panel: Brand & Features ─── */}
        <div className="hidden lg:flex flex-col justify-between p-10 xl:p-12 bg-gradient-to-br from-gold-950/60 via-[#0d1018] to-[#07090e] relative overflow-hidden border-r border-white/[0.04]">
          {/* Decorative rings */}
          <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full border border-gold-500/10 pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-44 h-44 rounded-full border border-gold-500/5 pointer-events-none" />
          <div className="absolute top-10 right-10 w-20 h-20 rounded-full border border-gold-500/10 pointer-events-none" />

          <div>
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center gap-3 mb-12"
            >
              <div className="bg-gradient-to-tr from-gold-600 to-gold-400 p-2.5 rounded-xl text-[#07090e] shadow-lg shadow-gold-500/25">
                <GiClothespin className="text-2xl" />
              </div>
              <span className="font-extrabold text-3xl tracking-wide gold-text-gradient">
                StyleSense
              </span>
            </motion.div>

            {/* Welcome text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h2 className="text-3xl xl:text-4xl font-bold text-slate-100 mb-4 leading-tight">
                Your AI Fashion
                <br />
                <span className="gold-text-gradient">Revolution Awaits</span>
              </h2>
              <p className="text-slate-400 text-base leading-relaxed max-w-sm">
                Join thousands of fashion enthusiasts who trust StyleSense to
                elevate their style with cutting-edge AI recommendations.
              </p>
            </motion.div>
          </div>

          {/* Features list */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="space-y-4 mt-10"
          >
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400 text-lg group-hover:scale-110 group-hover:bg-gold-500/20 transition-all duration-300">
                  {f.icon}
                </div>
                <span className="text-slate-300 font-medium text-sm group-hover:text-gold-300 transition-colors">
                  {f.text}
                </span>
              </div>
            ))}
          </motion.div>

          {/* Trust badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-8 flex items-center gap-2 text-slate-500 text-xs"
          >
            <FiCheckCircle className="text-gold-500" />
            <span>Trusted by 10,000+ fashion enthusiasts worldwide</span>
          </motion.div>
        </div>

        {/* ─── Right Panel: Auth Form ─── */}
        <div className="flex flex-col justify-center p-8 md:p-10 xl:p-12">
          {/* Mobile-only logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8 justify-center">
            <div className="bg-gradient-to-tr from-gold-600 to-gold-400 p-2 rounded-lg text-[#07090e] shadow-lg shadow-gold-500/20">
              <GiClothespin className="text-xl" />
            </div>
            <span className="font-extrabold text-2xl tracking-wide gold-text-gradient">
              StyleSense
            </span>
          </div>

          {/* Toggle tabs */}
          <div className="flex mb-8 p-1 rounded-xl bg-white/[0.04] border border-white/[0.06]">
            <button
              onClick={() => setIsSignUp(false)}
              className={`flex-1 py-3 rounded-lg text-sm font-semibold tracking-wide transition-all duration-300 ${
                !isSignUp
                  ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-slate-950 shadow-md shadow-gold-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsSignUp(true)}
              className={`flex-1 py-3 rounded-lg text-sm font-semibold tracking-wide transition-all duration-300 ${
                isSignUp
                  ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-slate-950 shadow-md shadow-gold-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Heading */}
          <AnimatePresence mode="wait">
            <motion.div
              key={isSignUp ? 'signup' : 'signin'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="mb-6"
            >
              <h1 className="text-2xl md:text-3xl font-bold text-slate-100 mb-2">
                {isSignUp ? 'Create Your Account' : 'Welcome Back'}
              </h1>
              <p className="text-slate-400 text-sm">
                {isSignUp
                  ? 'Start your personalized AI fashion journey today'
                  : 'Sign in to continue your styling experience'}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Success Message */}
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center gap-2"
            >
              <FiCheckCircle />
              {successMessage}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name field (sign up only) */}
            <AnimatePresence>
              {isSignUp && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg" />
                    <input
                      id="sign-name"
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className={`w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/[0.04] border ${
                        errors.name
                          ? 'border-red-500/50 focus:border-red-400'
                          : 'border-white/[0.08] focus:border-gold-500/50'
                      } text-slate-100 text-sm placeholder:text-slate-600 outline-none transition-all duration-300 focus:bg-white/[0.06] focus:shadow-lg focus:shadow-gold-500/5`}
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1.5 text-xs text-red-400">{errors.name}</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg" />
                <input
                  id="sign-email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={`w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/[0.04] border ${
                    errors.email
                      ? 'border-red-500/50 focus:border-red-400'
                      : 'border-white/[0.08] focus:border-gold-500/50'
                  } text-slate-100 text-sm placeholder:text-slate-600 outline-none transition-all duration-300 focus:bg-white/[0.06] focus:shadow-lg focus:shadow-gold-500/5`}
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-400">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg" />
                <input
                  id="sign-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full pl-12 pr-12 py-3.5 rounded-xl bg-white/[0.04] border ${
                    errors.password
                      ? 'border-red-500/50 focus:border-red-400'
                      : 'border-white/[0.08] focus:border-gold-500/50'
                  } text-slate-100 text-sm placeholder:text-slate-600 outline-none transition-all duration-300 focus:bg-white/[0.06] focus:shadow-lg focus:shadow-gold-500/5`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-gold-400 transition-colors"
                >
                  {showPassword ? (
                    <FiEyeOff className="text-lg" />
                  ) : (
                    <FiEye className="text-lg" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-400">{errors.password}</p>
              )}
            </div>

            {/* Remember & Forgot (sign in only) */}
            {!isSignUp && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-slate-400 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-white/10 bg-white/5 accent-gold-500"
                  />
                  <span className="group-hover:text-slate-300 transition-colors">
                    Remember me
                  </span>
                </label>
                <button
                  type="button"
                  className="text-gold-400 hover:text-gold-300 font-medium transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-slate-950 font-bold text-base tracking-wide shadow-lg shadow-gold-500/20 hover:shadow-gold-500/30 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-slate-950/30 border-t-slate-950 rounded-full"
                />
              ) : (
                <>
                  {isSignUp ? 'Create Account' : 'Sign In'}
                  <FiArrowRight className="text-lg" />
                </>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-white/[0.06]" />
            <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">
              or continue with
            </span>
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>

          {/* Social buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                onAuth({ name: 'Guest User', email: 'guest@stylesense.ai' });
              }}
              className="py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-300 text-sm font-medium hover:bg-white/[0.08] hover:border-gold-500/20 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.607.069-.607 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.337-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"
                  fill="currentColor"
                />
              </svg>
              Guest Access
            </button>
            <button
              type="button"
              onClick={() => {
                onAuth({ name: 'Google User', email: 'user@google.com' });
              }}
              className="py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-300 text-sm font-medium hover:bg-white/[0.08] hover:border-gold-500/20 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </button>
          </div>

          {/* Bottom switch */}
          <p className="text-center text-sm text-slate-500 mt-8">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-gold-400 hover:text-gold-300 font-semibold transition-colors"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
