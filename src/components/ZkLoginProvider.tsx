import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client';
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';
import { jwtDecode } from 'jwt-decode';

interface ZkLoginContextType {
  isConnected: boolean;
  isLoading: boolean;
  userAddress: string | null;
  userInfo: any | null;
  error: string | null;
  login: (provider: 'google' | 'facebook' | 'twitch') => Promise<void>;
  logout: () => void;
  suiClient: SuiClient;
  testConnection: () => Promise<void>;
}

const ZkLoginContext = createContext<ZkLoginContextType | undefined>(undefined);

interface ZkLoginProviderProps {
  children: ReactNode;
}

export function ZkLoginProvider({ children }: ZkLoginProviderProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [suiClient] = useState(() => new SuiClient({ url: getFullnodeUrl('testnet') }));

  // Check for existing session on mount
  useEffect(() => {
    const savedSession = localStorage.getItem('zklogin_session');
    if (savedSession) {
      try {
        const session = JSON.parse(savedSession);
        setIsConnected(true);
        setUserAddress(session.userAddress);
        setUserInfo(session.userInfo);
        console.log('✅ Session restored:', session);
      } catch (err) {
        console.error('❌ Failed to restore session:', err);
        localStorage.removeItem('zklogin_session');
      }
    }
  }, []);

  // Test Sui client connection
  const testConnection = async () => {
    try {
      console.log('🔄 Testing Sui client connection...');
      const chainId = await suiClient.getChainIdentifier();
      console.log('✅ Sui client connected. Chain ID:', chainId);
      
      // Test keypair generation
      const testKeyPair = new Ed25519Keypair();
      const publicKey = testKeyPair.getPublicKey();
      console.log('✅ Keypair generation working. Public key:', publicKey.toSuiAddress());
      
      setError(null);
    } catch (err: any) {
      console.error('❌ Connection test failed:', err);
      setError(`Connection test failed: ${err.message}`);
    }
  };

  const login = async (provider: 'google' | 'facebook' | 'twitch') => {
    console.log(`🔄 Starting ${provider} login...`);
    setIsLoading(true);
    setError(null);

    try {
      // Test if we can generate keypair
      console.log('🔄 Generating ephemeral keypair...');
      const ephemeralKeyPair = new Ed25519Keypair();
      const ephemeralPublicKey = ephemeralKeyPair.getPublicKey();
      console.log('✅ Ephemeral keypair generated:', ephemeralPublicKey.toSuiAddress());
      
      // Store ephemeral keypair for later use
      const keypairData = {
        privateKey: ephemeralKeyPair.export().privateKey,
        publicKey: ephemeralPublicKey.toSuiBytes()
      };
      localStorage.setItem('ephemeral_keypair', JSON.stringify(keypairData));
      console.log('✅ Ephemeral keypair stored in localStorage');

      // Generate nonce
      const nonce = generateNonce();
      console.log('✅ Nonce generated:', nonce);

      // Get client IDs from environment
      const clientIds = {
        google: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        facebook: import.meta.env.VITE_FACEBOOK_CLIENT_ID,
        twitch: import.meta.env.VITE_TWITCH_CLIENT_ID
      };

      console.log('🔄 Environment variables:', {
        google: clientIds.google ? '✅ Set' : '❌ Missing',
        facebook: clientIds.facebook ? '✅ Set' : '❌ Missing',
        twitch: clientIds.twitch ? '✅ Set' : '❌ Missing'
      });

      // Check if we have real OAuth credentials or should use demo mode
      const isRealOAuth = clientIds[provider] && 
                         !clientIds[provider].includes('demo') && 
                         clientIds[provider].length > 20; // Real client IDs are much longer

      if (!isRealOAuth) {
        console.log('🔄 Using demo mode (no real OAuth configured)');
        console.log('💡 To use real authentication:');
        console.log('1. Get Google Client ID from Google Cloud Console');
        console.log('2. Update VITE_GOOGLE_CLIENT_ID in .env file');
        console.log('3. Restart the development server');
        await simulateSuccessfulLogin(provider);
        return;
      }

      // Real OAuth flow
      console.log('🔄 Using real OAuth authentication');
      
      // OAuth URLs for different providers
      const redirectUri = encodeURIComponent(window.location.origin);
      const oauthUrls = {
        google: `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientIds.google}&response_type=id_token&scope=openid email profile&nonce=${nonce}&redirect_uri=${redirectUri}`,
        facebook: `https://www.facebook.com/v18.0/dialog/oauth?client_id=${clientIds.facebook}&response_type=code&scope=email,public_profile&redirect_uri=${redirectUri}`,
        twitch: `https://id.twitch.tv/oauth2/authorize?client_id=${clientIds.twitch}&response_type=code&scope=user:read:email&redirect_uri=${redirectUri}`
      };

      console.log('🔄 Redirecting to OAuth URL:', oauthUrls[provider]);
      
      // Store provider info for callback
      localStorage.setItem('oauth_provider', provider);
      localStorage.setItem('oauth_nonce', nonce);
      
      // Redirect to OAuth provider
      window.location.href = oauthUrls[provider];

    } catch (err: any) {
      console.error('❌ Login error:', err);
      setError(err.message || 'Failed to initiate login');
      setIsLoading(false);
    }
  };

  const simulateSuccessfulLogin = async (provider: string) => {
    console.log('🔄 Simulating successful login...');
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Create mock user info
    const mockUserInfo = {
      email: `demo.user@${provider}.com`,
      name: `Demo User (${provider})`,
      picture: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
      provider: provider,
      sub: `demo_${provider}_${Date.now()}`
    };

    // Generate mock Sui address (in production, derive from zkLogin proof)
    const mockAddress = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

    console.log('✅ Mock login successful:', { mockUserInfo, mockAddress });

    setIsConnected(true);
    setUserAddress(mockAddress);
    setUserInfo(mockUserInfo);
    setIsLoading(false);

    // Save session
    const sessionData = {
      userAddress: mockAddress,
      userInfo: mockUserInfo,
      timestamp: Date.now()
    };
    localStorage.setItem('zklogin_session', JSON.stringify(sessionData));
    console.log('✅ Session saved to localStorage');
  };

  const logout = () => {
    console.log('🔄 Logging out...');
    setIsConnected(false);
    setUserAddress(null);
    setUserInfo(null);
    setError(null);
    localStorage.removeItem('zklogin_session');
    localStorage.removeItem('ephemeral_keypair');
    localStorage.removeItem('oauth_provider');
    localStorage.removeItem('oauth_nonce');
    console.log('✅ Logout complete');
  };

  // Handle OAuth callback
  useEffect(() => {
    const handleOAuthCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const fragment = new URLSearchParams(window.location.hash.substring(1));
      
      // Check for ID token in URL fragment (Google implicit flow)
      const idToken = fragment.get('id_token') || urlParams.get('id_token');
      const code = urlParams.get('code');
      const error = urlParams.get('error') || fragment.get('error');

      if (error) {
        console.error('❌ OAuth error:', error);
        setError(`OAuth error: ${error}`);
        setIsLoading(false);
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
        return;
      }

      if (idToken || code) {
        console.log('🔄 Processing OAuth callback...', { idToken: !!idToken, code: !!code });
        setIsLoading(true);
        
        try {
          const provider = localStorage.getItem('oauth_provider') || 'unknown';
          const storedNonce = localStorage.getItem('oauth_nonce');
          
          let userInfo;
          if (idToken) {
            console.log('🔄 Decoding JWT token...');
            // Decode JWT (in production, verify signature first)
            const decoded = jwtDecode(idToken) as any;
            console.log('✅ JWT decoded:', decoded);
            
            // Verify nonce if available
            if (storedNonce && decoded.nonce !== storedNonce) {
              throw new Error('Invalid nonce - possible CSRF attack');
            }
            
            userInfo = {
              email: decoded.email,
              name: decoded.name,
              picture: decoded.picture,
              provider: provider,
              sub: decoded.sub,
              email_verified: decoded.email_verified
            };
          } else {
            console.log('🔄 Using authorization code flow...');
            // For code flow, you would exchange code for tokens here
            // For demo, create mock user info
            userInfo = {
              email: `user@${provider}.com`,
              name: `User from ${provider}`,
              picture: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
              provider: provider,
              sub: `${provider}_${Date.now()}`
            };
          }

          // Generate Sui address (in production, derive from zkLogin proof)
          const suiAddress = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

          console.log('✅ OAuth callback processed:', { userInfo, suiAddress });

          setIsConnected(true);
          setUserAddress(suiAddress);
          setUserInfo(userInfo);

          // Save session
          const sessionData = {
            userAddress: suiAddress,
            userInfo: userInfo,
            timestamp: Date.now()
          };
          localStorage.setItem('zklogin_session', JSON.stringify(sessionData));

          // Clean up URL and localStorage
          window.history.replaceState({}, document.title, window.location.pathname);
          localStorage.removeItem('oauth_provider');
          localStorage.removeItem('oauth_nonce');

        } catch (err: any) {
          console.error('❌ OAuth callback error:', err);
          setError(err.message || 'Failed to complete authentication');
        } finally {
          setIsLoading(false);
        }
      }
    };

    handleOAuthCallback();
  }, []);

  const generateNonce = () => {
    return Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  };

  // Test connection on mount
  useEffect(() => {
    testConnection();
  }, []);

  const value: ZkLoginContextType = {
    isConnected,
    isLoading,
    userAddress,
    userInfo,
    error,
    login,
    logout,
    suiClient,
    testConnection
  };

  return (
    <ZkLoginContext.Provider value={value}>
      {children}
    </ZkLoginContext.Provider>
  );
}

export function useZkLogin() {
  const context = useContext(ZkLoginContext);
  if (context === undefined) {
    throw new Error('useZkLogin must be used within a ZkLoginProvider');
  }
  return context;
}
