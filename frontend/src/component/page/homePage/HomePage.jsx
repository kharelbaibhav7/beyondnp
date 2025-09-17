import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import {
  GraduationCap,
  MapPin,
  BookOpen,
  Users,
  ArrowRight,
  Star,
  CheckCircle,
  Globe,
  Target,
  Lightbulb,
  Sparkles,
  Rocket,
  DollarSign,
  Search,
  Facebook,
  Instagram,
  Linkedin
} from 'lucide-react';
import logo from '../../../assets/logo.png';

const HomePage = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <DollarSign className="w-8 h-8 text-purple-600" />,
      title: "Scholarships finder",
      description: "Learn about different scholarships and how to apply for them"
    },
    {
      icon: <GraduationCap className="w-8 h-8 text-indigo-600" />,
      title: "University Explorer",
      description: "Compare universities abroad with detailed insights"
    },
    {
      icon: <Target className="w-8 h-8 text-violet-600" />,
      title: "Application Tracker",
      description: "Track deadlines and progress for all your applications"
    },
    {
      icon: <BookOpen className="w-8 h-8 text-purple-500" />,
      title: "Guides & Resources",
      description: "Step-by-step study abroad journey guidance"
    }
  ];

  const steps = [
    {
      icon: <Users className="w-12 h-12 text-purple-600" />,
      title: "Sign Up",
      description: "Create free account and get started in minutes"
    },
    {
      icon: <Search className="w-12 h-12 text-indigo-600" />,
      title: "Explore Options",
      description: "Find scholarships & universities that match your goals"
    },
    {
      icon: <Rocket className="w-12 h-12 text-violet-600" />,
      title: "Apply & Track",
      description: "Stay on top of deadlines and application progress"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-screen flex items-center">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-indigo-600/5"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-violet-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >

              <h1 className="text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Your Gateway to
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 block">
                  US Universities
                </span>
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                Keep track of your applications, progress, and deadlines. Discover universities, scholarships, and guidance tailored specifically for Nepali students pursuing their dreams in the United States.
              </p>

              <div className="flex flex-col sm:flex-row gap-6">
                {isAuthenticated ? (
                  <Link to="/dashboard">
                    <motion.button
                      whileHover={{
                        scale: 1.05,
                        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                      }}
                      whileTap={{ scale: 0.95 }}
                      className="group bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 relative overflow-hidden"
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-purple-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      />
                      <Rocket className="w-5 h-5 relative z-10" />
                      <span className="relative z-10">Go to Dashboard</span>
                      <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
                    </motion.button>
                  </Link>
                ) : (
                  <Link to="/register">
                    <motion.button
                      whileHover={{
                        scale: 1.05,
                        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                      }}
                      whileTap={{ scale: 0.95 }}
                      className="group bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 relative overflow-hidden"
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-purple-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      />
                      <Rocket className="w-5 h-5 relative z-10" />
                      <span className="relative z-10">Get Started</span>
                      <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
                    </motion.button>
                  </Link>
                )}

                {!isAuthenticated && (
                  <Link to="/login">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="border-2 border-purple-600 text-purple-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-purple-50 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <Users className="w-5 h-5" />
                      Sign In
                    </motion.button>
                  </Link>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <motion.div
                style={{ y }}
                className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-purple-100"
              >
                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-purple-50 to-indigo-50"
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-full flex items-center justify-center">
                      <GraduationCap className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">Harvard University</h3>
                      <p className="text-gray-600">Cambridge, Massachusetts</p>
                    </div>
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-violet-50"
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-indigo-100 to-violet-100 rounded-full flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">MIT</h3>
                      <p className="text-gray-600">Cambridge, Massachusetts</p>
                    </div>
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-violet-50 to-purple-50"
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-violet-100 to-purple-100 rounded-full flex items-center justify-center">
                      <Globe className="w-6 h-6 text-violet-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">Stanford University</h3>
                      <p className="text-gray-600">Stanford, California</p>
                    </div>
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-white to-purple-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-8">
              Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Everything you need to make your US university application journey successful and stress-free.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{
                  y: -15,
                  scale: 1.02,
                  transition: { duration: 0.3 }
                }}
                className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-purple-100 hover:border-purple-200"
              >
                <motion.div
                  className="mb-6 group-hover:scale-110 transition-transform duration-300"
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-8">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Get started in three simple steps and begin your journey to US universities.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center group"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                  className="mb-8 flex justify-center"
                >
                  <div className="w-24 h-24 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-full flex items-center justify-center group-hover:shadow-lg transition-all duration-300">
                    {step.icon}
                  </div>
                </motion.div>
                <div className="mb-4">
                  <span className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-bold rounded-full mb-4">
                    {index + 1}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-purple-600 via-indigo-600 to-violet-600 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-purple-600/90 to-indigo-600/90"></div>
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 bg-white/10 rounded-full animate-pulse animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/10 rounded-full animate-pulse animation-delay-4000"></div>
        </div>

        <div className="relative max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white/90 text-sm font-medium"
            >
              <Sparkles className="w-4 h-4" />
              <span>Join BeyondNP</span>
            </motion.div>

            <h2 className="text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight">
              Ready to Begin Your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                Journey?
              </span>
            </h2>

            <p className="text-xl text-purple-100 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join to make your journey to the United States 77.7% easier.
              Your dream university is just a click away!
            </p>

            <Link to={isAuthenticated ? "/dashboard" : "/register"}>
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                }}
                whileTap={{ scale: 0.95 }}
                className="group bg-white text-purple-600 px-10 py-5 rounded-full font-bold text-xl shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center gap-3 mx-auto relative overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
                <Rocket className="w-6 h-6 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
                <span className="relative z-10">
                  {isAuthenticated ? "Go to Dashboard" : "Join BeyondNP Today"}
                </span>
                <ArrowRight className="w-6 h-6 relative z-10 group-hover:translate-x-2 transition-transform duration-300" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-4"
              >
                <div className="flex items-center space-x-3">
                  <img src={logo} alt="Beyond NP Logo" className="w-10 h-10 rounded-lg" />
                  <span className="text-2xl font-bold">BeyondNP</span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  BeyondNP – Learn Beyond Borders
                </p>
              </motion.div>
            </div>

            {/* Quick Links */}
            <div className="col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                <div className="space-y-2">
                  <Link to="/" className="block text-gray-400 hover:text-white transition-colors duration-200">Home</Link>
                  <Link to="/login" className="block text-gray-400 hover:text-white transition-colors duration-200">Sign In</Link>
                  <Link to="/register" className="block text-gray-400 hover:text-white transition-colors duration-200">Sign Up</Link>
                  <a href="#" className="block text-gray-400 hover:text-white transition-colors duration-200">About</a>
                </div>
              </motion.div>
            </div>

            {/* Services */}
            <div className="col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold mb-4">Services</h3>
                <div className="space-y-2">
                  <Link to={isAuthenticated ? "/scholarship" : "/login"} className="block text-gray-400 hover:text-white transition-colors duration-200">Scholarship Finder</Link>
                  <Link to={isAuthenticated ? "/universities" : "/login"} className="block text-gray-400 hover:text-white transition-colors duration-200">University Explorer</Link>
                  <Link to={isAuthenticated ? "/dashboard" : "/login"} className="block text-gray-400 hover:text-white transition-colors duration-200">Application Tracker</Link>
                  <Link to={isAuthenticated ? "/learn" : "/login"} className="block text-gray-400 hover:text-white transition-colors duration-200">Guides & Resources</Link>
                </div>
              </motion.div>
            </div>

            {/* Social Media */}
            <div className="col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  <motion.a
                    whileHover={{ scale: 1.1, y: -2 }}
                    href="#"
                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors duration-200"
                  >
                    <Facebook className="w-5 h-5" />
                  </motion.a>
                  <motion.a
                    whileHover={{ scale: 1.1, y: -2 }}
                    href="#"
                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors duration-200"
                  >
                    <Instagram className="w-5 h-5" />
                  </motion.a>
                  <motion.a
                    whileHover={{ scale: 1.1, y: -2 }}
                    href="#"
                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors duration-200"
                  >
                    <Linkedin className="w-5 h-5" />
                  </motion.a>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Bottom Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="border-t border-gray-800 mt-12 pt-8 text-center"
          >
            <p className="text-gray-400 text-sm">
              © 2025 BeyondNP. All rights reserved. | Learn Beyond Borders
            </p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;