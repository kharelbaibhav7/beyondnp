import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
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
  Rocket
} from 'lucide-react';
import logo from '../../../assets/logo.png';

const HomePage = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  const features = [
    {
      icon: <GraduationCap className="w-8 h-8 text-purple-600" />,
      title: "University Search",
      description: "Find the perfect US universities for your undergraduate studies"
    },
    {
      icon: <BookOpen className="w-8 h-8 text-indigo-600" />,
      title: "Study Materials",
      description: "Access comprehensive study guides and resources"
    },
    {
      icon: <Users className="w-8 h-8 text-violet-600" />,
      title: "Community",
      description: "Connect with fellow Nepalese students on the same journey"
    },
    {
      icon: <Target className="w-8 h-8 text-purple-500" />,
      title: "Goal Tracking",
      description: "Track your application progress and deadlines"
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
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex items-center gap-3"
              >
                <img src={logo} alt="Beyond NP Logo" className="w-12 h-12" />
                <span className="text-2xl font-bold text-gray-800">Beyond NP</span>
              </motion.div>

              <h1 className="text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Your Gateway to
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 block">
                  US Universities
                </span>
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                Beyond NP helps Nepalese students navigate their journey to undergraduate studies in the United States.
                From university selection to application tracking, we've got you covered.
              </p>

              <div className="flex flex-col sm:flex-row gap-6">
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

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-purple-600 text-purple-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-purple-50 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  Learn More
                </motion.button>
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
              Everything You Need
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Our comprehensive platform provides all the tools and resources you need to successfully apply to US universities.
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
              <span>Join 1000+ Students</span>
            </motion.div>

            <h2 className="text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight">
              Ready to Start Your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                Journey?
              </span>
            </h2>

            <p className="text-xl text-purple-100 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join thousands of Nepalese students who have successfully applied to US universities with our help.
              Your dream university is just a click away!
            </p>

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
              <span className="relative z-10">Get Started Today</span>
              <ArrowRight className="w-6 h-6 relative z-10 group-hover:translate-x-2 transition-transform duration-300" />
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;