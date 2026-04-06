'use client';

import { useState, useEffect } from 'react';
import { auth, db, storage } from '@/lib/firebase';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function FirebaseTest() {
  const [status, setStatus] = useState('Testing...');
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [testResult, setTestResult] = useState('');

  useEffect(() => {
    testFirebaseConnection();
  }, []);

  const testFirebaseConnection = async () => {
    try {
      setStatus('Testing Firebase connection...');
      
      // Test Auth
      if (!auth) {
        setStatus('❌ Auth not initialized');
        return;
      }
      setStatus('✅ Auth initialized');

      // Test Firestore
      if (!db) {
        setStatus('❌ Firestore not initialized');
        return;
      }
      setStatus('✅ Auth + Firestore initialized');

      // Test Storage
      if (!storage) {
        setStatus('✅ Auth + Firestore OK, ⚠️ Storage not initialized');
        return;
      }
      setStatus('✅ All Firebase services initialized');
      
      // Test write to Firestore
      const testRef = doc(db, 'test', 'connection-test');
      await setDoc(testRef, { 
        test: true, 
        timestamp: new Date().toISOString() 
      });
      
      const testSnap = await getDoc(testRef);
      if (testSnap.exists()) {
        setStatus('✅ Firebase write/read test passed!');
        setTestResult('Firebase is fully working!');
      }
    } catch (error: any) {
      console.error('Firebase error:', error);
      setStatus(`❌ Error: ${error.message}`);
      setTestResult(`Error: ${error.message}`);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) return;
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      setUserId(result.user.uid);
      setTestResult(`Logged in! User ID: ${result.user.uid}`);
    } catch (error: any) {
      setTestResult(`Login failed: ${error.message}`);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUserId('');
    setTestResult('Logged out');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-cyan-400">Firebase Connection Test</h1>
        
        <div className="bg-zinc-900 rounded-2xl p-6 mb-6 border border-white/10">
          <h2 className="text-xl font-semibold mb-4">Status</h2>
          <p className="text-lg">{status}</p>
          {testResult && <p className="mt-2 text-cyan-300">{testResult}</p>}
        </div>

        <div className="bg-zinc-900 rounded-2xl p-6 border border-white/10">
          <h2 className="text-xl font-semibold mb-4">Quick Login Test</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 mb-3 bg-zinc-800 rounded-lg border border-white/10 text-white"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 mb-3 bg-zinc-800 rounded-lg border border-white/10 text-white"
          />
          <div className="flex gap-3">
            <button
              onClick={handleLogin}
              className="px-6 py-2 bg-cyan-400 text-zinc-950 rounded-lg font-semibold"
            >
              Login
            </button>
            <button
              onClick={handleLogout}
              className="px-6 py-2 bg-red-500 text-white rounded-lg font-semibold"
            >
              Logout
            </button>
            <button
              onClick={testFirebaseConnection}
              className="px-6 py-2 bg-zinc-700 text-white rounded-lg font-semibold"
            >
              Retest
            </button>
          </div>
          {userId && <p className="mt-3 text-green-400">User ID: {userId}</p>}
        </div>

        <button
          onClick={() => window.location.href = '/'}
          className="mt-6 px-6 py-2 border border-white/20 rounded-lg"
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
}
