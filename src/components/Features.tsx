import React from 'react';
import { Shield, Key, Globe, Smartphone, Code, Users } from 'lucide-react';

export function Features() {
  const features = [
    {
      icon: Shield,
      title: 'Zero-Knowledge Privacy',
      description: 'Your identity is verified without revealing personal information to the blockchain.',
      color: 'text-blue-600'
    },
    {
      icon: Key,
      title: 'Familiar OAuth',
      description: 'Use existing accounts from Google, Facebook, Twitch, and other trusted providers.',
      color: 'text-cyan-600'
    },
    {
      icon: Globe,
      title: 'Web3 Native',
      description: 'Seamlessly interact with Sui blockchain applications and smart contracts.',
      color: 'text-teal-600'
    },
    {
      icon: Smartphone,
      title: 'Mobile Ready',
      description: 'Works perfectly on mobile devices with responsive design and touch optimization.',
      color: 'text-blue-500'
    },
    {
      icon: Code,
      title: 'Developer Friendly',
      description: 'Easy integration with comprehensive SDK and detailed documentation.',
      color: 'text-purple-600'
    },
    {
      icon: Users,
      title: 'User Experience',
      description: 'No seed phrases, no wallet installations. Just login and start using Web3.',
      color: 'text-green-600'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose zkLogin?</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          zkLogin bridges the gap between Web2 and Web3, providing a familiar login experience 
          while maintaining the security and privacy benefits of blockchain technology.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <div key={index} className="glass-card p-6 hover:scale-105 transition-transform duration-200">
            <div className="flex items-center space-x-3 mb-4">
              <feature.icon className={`w-8 h-8 ${feature.color}`} />
              <h3 className="text-lg font-semibold text-gray-800">{feature.title}</h3>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>

      <div className="glass-card p-8">
        <div className="text-center space-y-4">
          <h3 className="text-2xl font-bold text-gray-800">Ready to Get Started?</h3>
          <p className="text-gray-600 max-w-xl mx-auto">
            Click the login buttons above to experience zkLogin authentication. 
            Check the browser console for detailed logs of the authentication process.
          </p>
          <div className="flex justify-center space-x-4 text-sm text-gray-500">
            <span>✅ Sui Testnet</span>
            <span>✅ Demo Mode</span>
            <span>✅ Console Logging</span>
          </div>
        </div>
      </div>
    </div>
  );
}
