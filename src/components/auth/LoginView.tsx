import React, { useEffect, useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { School, ShieldAlert, Award, UserCheck, GraduationCap, Lock, User, ArrowRight, Sparkles, KeyRound, Mail, UserPlus } from 'lucide-react';
import { UserRole } from '../../types';
import { appMode, supabase } from '../../lib/supabase';

export const LoginView: React.FC = () => {
  const { cluster, schools, login, switchAccount, accounts, setShowAccountsModal } = useSchool();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState<'quick' | 'manual'>(appMode === 'demo' ? 'quick' : 'manual');
  const [isLoading, setIsLoading] = useState(false);
  const [recoveryMode, setRecoveryMode] = useState(window.location.hash.includes('type=recovery'));
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordUpdated, setPasswordUpdated] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'register' | 'forgot'>('login');
  const [displayName, setDisplayName] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const isDemo = appMode === 'demo';

  useEffect(() => {
    if (!supabase) return;
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setRecoveryMode(true);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!username.trim()) {
      setErrorMsg('សូមបញ្ចូលឈ្មោះគណនី ឬអត្តលេខ!');
      return;
    }

    setIsLoading(true);
    const success = await login(username, password);
    setIsLoading(false);
    if (!success) {
      setErrorMsg('ឈ្មោះគណនី ឬពាក្យសម្ងាត់មិនត្រឹមត្រូវឡើយ!');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    const email = username.trim().toLowerCase();
    if (!email.endsWith('@gmail.com')) {
      setErrorMsg('សូមប្រើអាសយដ្ឋាន Gmail ត្រឹមត្រូវ (ឧ. name@gmail.com)។');
      return;
    }
    if (!displayName.trim()) {
      setErrorMsg('សូមបញ្ចូលឈ្មោះពេញ។');
      return;
    }
    if (password.length < 8) {
      setErrorMsg('ពាក្យសម្ងាត់ត្រូវមានយ៉ាងតិច ៨ តួអក្សរ។');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('ពាក្យសម្ងាត់ទាំងពីរមិនដូចគ្នា។');
      return;
    }
    if (!supabase) {
      setErrorMsg('មិនទាន់ភ្ជាប់ប្រព័ន្ធសុវត្ថិភាព។');
      return;
    }
    setIsLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}${window.location.pathname}`,
        data: { display_name: displayName.trim() },
      },
    });
    setIsLoading(false);
    if (error) {
      setErrorMsg(error.message.includes('rate limit')
        ? 'បានផ្ញើអ៊ីមែលច្រើនពេក។ សូមរង់ចាំបន្តិច ហើយសាកល្បងម្ដងទៀត។'
        : 'មិនអាចបង្កើតគណនីបាន។ អ៊ីមែលនេះអាចត្រូវបានប្រើរួចហើយ។');
      return;
    }
    setSuccessMsg('គណនីត្រូវបានបង្កើត។ សូមពិនិត្យ Gmail ហើយចុចតំណបញ្ជាក់អ៊ីមែល។');
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    const email = username.trim().toLowerCase();
    if (!email || !email.includes('@')) {
      setErrorMsg('សូមបញ្ចូលអ៊ីមែលរបស់អ្នក។');
      return;
    }
    if (!supabase) {
      setErrorMsg('មិនទាន់ភ្ជាប់ប្រព័ន្ធសុវត្ថិភាព។');
      return;
    }
    setIsLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}${window.location.pathname}`,
    });
    setIsLoading(false);
    if (error) {
      setErrorMsg(error.message.includes('rate limit')
        ? 'បានផ្ញើអ៊ីមែលច្រើនពេក។ សូមរង់ចាំបន្តិច ហើយសាកល្បងម្ដងទៀត។'
        : 'មិនអាចផ្ញើតំណស្តារពាក្យសម្ងាត់បាន។');
      return;
    }
    setSuccessMsg('តំណកំណត់ពាក្យសម្ងាត់ថ្មីត្រូវបានផ្ញើ។ សូមពិនិត្យ Inbox ឬ Spam។');
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (newPassword.length < 8) {
      setErrorMsg('ពាក្យសម្ងាត់ត្រូវមានយ៉ាងតិច ៨ តួអក្សរ។');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('ពាក្យសម្ងាត់ទាំងពីរមិនដូចគ្នា។');
      return;
    }
    if (!supabase) {
      setErrorMsg('មិនទាន់ភ្ជាប់ប្រព័ន្ធសុវត្ថិភាព។');
      return;
    }
    setIsLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setIsLoading(false);
    if (error) {
      setErrorMsg('តំណអស់សុពលភាព ឬមិនអាចកំណត់ពាក្យសម្ងាត់បាន។');
      return;
    }
    setPasswordUpdated(true);
    window.history.replaceState({}, document.title, window.location.pathname);
  };

  const handleQuickLogin = (role: UserRole) => {
    const acc = accounts.find(a => a.role === role);
    if (acc) {
      switchAccount(acc);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4 font-khmer text-slate-800 selection:bg-blue-600 selection:text-white">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-white/10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Branding */}
        <div className="bg-gradient-to-tr from-blue-900 via-blue-800 to-indigo-900 text-white p-6 sm:p-8 text-center relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
            <School className="w-48 h-48" />
          </div>

          <div className="w-16 h-16 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-black/20">
            <School className="w-8 h-8 text-amber-300" />
          </div>

          <p className="text-[11px] font-bold uppercase tracking-widest text-amber-300">
            {cluster.nameKh}
          </p>
          <h2 className="text-xl sm:text-2xl font-bold font-moul tracking-wide mt-1 text-white">
            ចូលប្រើប្រាស់ប្រព័ន្ធ
          </h2>
          <p className="text-xs text-blue-200 mt-1">
            ប្រព័ន្ធគ្រប់គ្រង ៧ សាលារៀន ៧០ ថ្នាក់ និង ៣,៥០០ សិស្ស
          </p>
        </div>

        {/* Tab Switcher */}
        {!recoveryMode && isDemo && <div className="flex border-b border-slate-100 bg-slate-50 text-xs font-bold">
          <button
            onClick={() => setActiveTab('quick')}
            className={`flex-1 py-3 text-center transition-all ${
              activeTab === 'quick'
                ? 'bg-white text-blue-700 border-b-2 border-blue-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            ⚡ ចូលរហ័សតាមតួនាទី
          </button>
          <button
            onClick={() => setActiveTab('manual')}
            className={`flex-1 py-3 text-center transition-all ${
              activeTab === 'manual'
                ? 'bg-white text-blue-700 border-b-2 border-blue-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            🔑 វាយឈ្មោះគណនី / អត្តលេខ
          </button>
        </div>}

        <div className="p-6">
          {/* Quick 1-Click Role Login */}
          {recoveryMode && (
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div className="text-center">
                <KeyRound className="w-10 h-10 text-blue-600 mx-auto mb-2" />
                <h3 className="font-bold text-slate-900">កំណត់ពាក្យសម្ងាត់ថ្មី</h3>
                <p className="text-xs text-slate-500 mt-1">សូមប្រើយ៉ាងតិច ៨ តួអក្សរ និងកុំចែករំលែកជាមួយអ្នកដទៃ។</p>
              </div>
              {errorMsg && <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">⚠️ {errorMsg}</div>}
              {passwordUpdated ? (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-bold text-center">
                  ✅ ពាក្យសម្ងាត់ត្រូវបានកំណត់រួច។ អ្នកអាចចូលប្រើប្រាស់ប្រព័ន្ធបាន។
                </div>
              ) : <>
                <input type="password" required minLength={8} placeholder="ពាក្យសម្ងាត់ថ្មី" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                <input type="password" required minLength={8} placeholder="បញ្ជាក់ពាក្យសម្ងាត់ថ្មី" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                <button type="submit" disabled={isLoading} className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold text-sm rounded-xl">
                  {isLoading ? 'កំពុងរក្សាទុក…' : 'រក្សាទុកពាក្យសម្ងាត់'}
                </button>
              </>}
            </form>
          )}

          {!recoveryMode && isDemo && activeTab === 'quick' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 text-center mb-4">
                ជ្រើសរើសតួនាទីដើម្បីចូលប្រើប្រាស់ភ្លាមៗ (Demo Instant Access)៖
              </p>

              {/* Cluster Head */}
              <button
                onClick={() => handleQuickLogin('cluster_head')}
                className="w-full p-3.5 rounded-2xl bg-blue-50/80 hover:bg-blue-600 text-blue-900 hover:text-white border border-blue-200 transition-all flex items-center justify-between group active:scale-98 shadow-xs"
              >
                <div className="flex items-center gap-3 text-left">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 group-hover:bg-white text-white group-hover:text-blue-600 flex items-center justify-center font-bold">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-sm">ប្រធានកម្រង (Cluster Head)</div>
                    <div className="text-[11px] opacity-80">គ្រប់គ្រង ៧ សាលារៀន • លោក ឈន សុខុម</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </button>

              {/* Principal */}
              <button
                onClick={() => handleQuickLogin('principal')}
                className="w-full p-3.5 rounded-2xl bg-purple-50/80 hover:bg-purple-600 text-purple-900 hover:text-white border border-purple-200 transition-all flex items-center justify-between group active:scale-98 shadow-xs"
              >
                <div className="flex items-center gap-3 text-left">
                  <div className="w-10 h-10 rounded-xl bg-purple-600 group-hover:bg-white text-white group-hover:text-purple-600 flex items-center justify-center font-bold">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-sm">នាយកសាលា (Principal)</div>
                    <div className="text-[11px] opacity-80">គ្រប់គ្រង ១០ ថ្នាក់ & ១០ គ្រូ • សាលាថ្លុកដង្កោ</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </button>

              {/* Teacher */}
              <button
                onClick={() => handleQuickLogin('teacher')}
                className="w-full p-3.5 rounded-2xl bg-emerald-50/80 hover:bg-emerald-600 text-emerald-900 hover:text-white border border-emerald-200 transition-all flex items-center justify-between group active:scale-98 shadow-xs"
              >
                <div className="flex items-center gap-3 text-left">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 group-hover:bg-white text-white group-hover:text-emerald-600 flex items-center justify-center font-bold">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-sm">គ្រូបង្រៀន (Teacher)</div>
                    <div className="text-[11px] opacity-80">គ្រប់គ្រង ៥០ សិស្ស • បញ្ចូលពិន្ទុ ១៥ មុខវិជ្ជា</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </button>

              {/* Student Portal */}
              <button
                onClick={() => handleQuickLogin('student')}
                className="w-full p-3.5 rounded-2xl bg-amber-50/80 hover:bg-amber-500 text-amber-950 hover:text-white border border-amber-200 transition-all flex items-center justify-between group active:scale-98 shadow-xs"
              >
                <div className="flex items-center gap-3 text-left">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 group-hover:bg-white text-white group-hover:text-amber-600 flex items-center justify-center font-bold">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-sm">សិស្ស / អាណាព្យាបាល (Student Portal)</div>
                    <div className="text-[11px] opacity-80">មើលពិន្ទុ ១៥ មុខវិជ្ជា ចំណាត់ថ្នាក់ & ប័ណ្ណសរសើរ</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </button>
            </div>
          )}

          {/* Manual Username / ID Login */}
          {!recoveryMode && activeTab === 'manual' && (
            <form
              onSubmit={authView === 'register' ? handleRegister : authView === 'forgot' ? handleForgotPassword : handleManualLogin}
              className="space-y-4"
            >
              {!isDemo && (
                <div className="text-center mb-2">
                  <h3 className="font-bold text-slate-900">
                    {authView === 'register' ? 'បង្កើតគណនី Gmail' : authView === 'forgot' ? 'ភ្លេចពាក្យសម្ងាត់' : 'ចូលប្រើប្រាស់'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {authView === 'register'
                      ? 'គណនីថ្មីត្រូវបានកំណត់ជាសិស្ស ដើម្បីការពារទិន្នន័យសាលា។'
                      : authView === 'forgot'
                        ? 'យើងនឹងផ្ញើតំណកំណត់ពាក្យសម្ងាត់ថ្មីទៅអ៊ីមែលរបស់អ្នក។'
                        : 'សូមប្រើអ៊ីមែល និងពាក្យសម្ងាត់របស់អ្នក។'}
                  </p>
                </div>
              )}
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold animate-in fade-in">
                  ⚠️ {errorMsg}
                </div>
              )}
              {successMsg && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                  ✅ {successMsg}
                </div>
              )}

              {authView === 'register' && !isDemo && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ឈ្មោះពេញ</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input type="text" required placeholder="ឈ្មោះរបស់អ្នក" value={displayName} onChange={e => setDisplayName(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isDemo ? 'ឈ្មោះគណនី ឬ អត្តលេខសិស្ស / គ្រូ' : 'អ៊ីមែល (Email)'}
                </label>
                <div className="relative">
                  {isDemo ? <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" /> : <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />}
                  <input
                    type={isDemo ? 'text' : 'email'}
                    required
                    placeholder={isDemo ? 'ឧ. clusterhead, principal1, ST-01-0001...' : 'name@example.com'}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                {isDemo && <span className="text-[10px] text-slate-400 mt-1 block">
                  💡 សិស្សអាចវាយអត្តលេខដូចជា <strong className="text-slate-600">ST-01-0001</strong>
                </span>}
              </div>

              {authView !== 'forgot' && <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ពាក្យសម្ងាត់ (Password)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    placeholder={isDemo ? 'វាយលេខកូដសម្ងាត់ (ឧ. 123)' : 'វាយពាក្យសម្ងាត់'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>}

              {authView === 'register' && !isDemo && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">បញ្ជាក់ពាក្យសម្ងាត់</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input type="password" required minLength={8} placeholder="វាយពាក្យសម្ងាត់ម្ដងទៀត" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                {authView === 'register' ? <UserPlus className="w-4 h-4" /> : <KeyRound className="w-4 h-4" />}
                <span>{isLoading ? 'កំពុងដំណើរការ…' : authView === 'register' ? 'បង្កើតគណនី' : authView === 'forgot' ? 'ផ្ញើតំណស្តារពាក្យសម្ងាត់' : 'ចូលប្រព័ន្ធ (Login)'}</span>
              </button>

              {!isDemo && (
                <div className="flex items-center justify-center gap-3 text-xs font-bold">
                  {authView !== 'login' && <button type="button" onClick={() => { setAuthView('login'); setErrorMsg(''); setSuccessMsg(''); }} className="text-blue-700 hover:underline">ត្រឡប់ទៅ Login</button>}
                  {authView === 'login' && <>
                    <button type="button" onClick={() => { setAuthView('forgot'); setErrorMsg(''); setSuccessMsg(''); }} className="text-blue-700 hover:underline">ភ្លេចពាក្យសម្ងាត់?</button>
                    <span className="text-slate-300">•</span>
                    <button type="button" onClick={() => { setAuthView('register'); setErrorMsg(''); setSuccessMsg(''); }} className="text-blue-700 hover:underline">បង្កើតគណនី Gmail</button>
                  </>}
                </div>
              )}
            </form>
          )}

          {/* Accounts Directory Button */}
          {!recoveryMode && isDemo && <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <button
              onClick={() => setShowAccountsModal(true)}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline flex items-center justify-center gap-1.5 mx-auto"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>មើលតារាងគណនី និងលេខកូដទាំងអស់ (Accounts Directory)</span>
            </button>
          </div>}
        </div>
      </div>
    </div>
  );
};
