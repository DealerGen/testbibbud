import React from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../../lib/supabase';

const AuthForm: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-700 to-indigo-800 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Welcome to BidBuddy</h1>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={['google', 'github']}
          theme="dark"
        />
      </div>
    </div>
  );
};

export default AuthForm;