'use client';

import { useEffect, useState } from 'react';

export default function EnvCheck() {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    if (!url || !key || url.includes('placeholder')) {
      setHasError(true);
    }
  }, []);

  if (!hasError) return null;

  return (
    <div className="fixed inset-0 bg-red-600 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-2xl">
        <div className="text-6xl mb-4">⚠️</div>
        <h1 className="text-3xl font-black text-red-600 mb-4">
          Environment Variables Missing
        </h1>
        <p className="text-lg mb-4">
          The Supabase environment variables are not set in Vercel.
        </p>
        <div className="bg-gray-100 p-4 rounded-lg mb-4 font-mono text-sm">
          <p className="font-bold mb-2">Required Environment Variables:</p>
          <p>NEXT_PUBLIC_SUPABASE_URL</p>
          <p>NEXT_PUBLIC_SUPABASE_ANON_KEY</p>
        </div>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
          <p className="font-bold text-blue-900 mb-2">How to Fix:</p>
          <ol className="list-decimal list-inside space-y-1 text-blue-800">
            <li>Go to Vercel Dashboard → Your Project → Settings</li>
            <li>Click "Environment Variables"</li>
            <li>Add both variables for Production, Preview, and Development</li>
            <li>Redeploy your application</li>
          </ol>
        </div>
        <p className="text-sm text-gray-600">
          See <code className="bg-gray-200 px-2 py-1 rounded">DEPLOYMENT.md</code> for complete instructions.
        </p>
      </div>
    </div>
  );
}
