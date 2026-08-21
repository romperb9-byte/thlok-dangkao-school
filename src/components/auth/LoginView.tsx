import React, { useEffect, useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { School, ShieldAlert, Award, UserCheck, GraduationCap, Lock, User, ArrowRight, Sparkles, KeyRound } from 'lucide-react';
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
      setErrorMsg('?????????????????? ????????!');
      return;
    }

    setIsLoading(true);
    const success = await login(username, password);
    setIsLoading(false);
    if (!success) {
      setErrorMsg('????????? ?????????????????????????????!');
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (newPassword.length < 8) {
      setErrorMsg('??????????????????????????? ? ????????');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('??????????????????????????????');
      return;
    }
    if (!supabase) {
      setErrorMsg('????????????????????????????????');
      return;
    }
    setIsLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setIsLoading(false);
    if (error) {
      setErrorMsg('????????????? ????????????????????????????');
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
            ?????????????????????
          </h2>
          <p className="text-xs text-blue-200 mt-1">
            ????????????????? ? ??????? ?? ?????? ??? ?,??? ?????
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
            ? ????????????????
          </button>
          <button
            onClick={() => setActiveTab('manual')}
            className={`flex-1 py-3 text-center transition-all ${
              activeTab === 'manual'
                ? 'bg-white text-blue-700 border-b-2 border-blue-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            ?? ???????????? / ???????
          </button>
        </div>}

        <div className="p-6">
          {/* Quick 1-Click Role Login */}
          {recoveryMode && (
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div className="text-center">
                <KeyRound className="w-10 h-10 text-blue-600 mx-auto mb-2" />
                <h3 className="font-bold text-slate-900">?????????????????????</h3>
                <p className="text-xs text-slate-500 mt-1">?????????????? ? ??????? ???????????????????????????</p>
              </div>
              {errorMsg && <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">?? {errorMsg}</div>}
              {passwordUpdated ? (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-bold text-center">
                  ? ????????????????????????????? ????????????????????????????????
                </div>
              ) : <>
                <input type="password" required minLength={8} placeholder="????????????????" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                <input type="password" required minLength={8} placeholder="???????????????????????" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                <button type="submit" disabled={isLoading} className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold text-sm rounded-xl">
                  {isLoading ? '?????????????.' : '????????????????????'}
                </button>
              </>}
            </form>
          )}

          {!recoveryMode && isDemo && activeTab === 'quick' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 text-center mb-4">
                ??????????????????????????????????????? (Demo Instant Access)?
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
                    <div className="font-bold text-sm">??????????? (Cluster Head)</div>
                    <div className="text-[11px] opacity-80">????????? ? ???????  ??? ?? ?????</div>
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
                    <div className="font-bold text-sm">???????? (Principal)</div>
                    <div className="text-[11px] opacity-80">????????? ?? ?????? & ?? ????  ??????????????</div>
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
                    <div className="font-bold text-sm">?????????? (Teacher)</div>
                    <div className="text-[11px] opacity-80">????????? ?? ?????  ???????????? ?? ?????????</div>
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
                    <div className="font-bold text-sm">????? / ??????????? (Student Portal)</div>
                    <div className="text-[11px] opacity-80">????????? ?? ????????? ???????????? & ??????????</div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </button>
            </div>
          )}

          {/* Manual Username / ID Login */}
          {!recoveryMode && activeTab === 'manual' && (
            <form onSubmit={handleManualLogin} className="space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold animate-in fade-in">
                  ?? {errorMsg}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isDemo ? '????????? ? ???????????? / ????' : '?????? (Email)'}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder={isDemo ? '?. clusterhead, principal1, ST-01-0001...' : 'name@example.com'}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                {isDemo && <span className="text-[10px] text-slate-400 mt-1 block">
                  ?? ??????????????????????? <strong className="text-slate-600">ST-01-0001</strong>
                </span>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ???????????? (Password)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    placeholder={isDemo ? '???????????????? (?. 123)' : '???????????????'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <KeyRound className="w-4 h-4" />
                <span>{isLoading ? '????????.' : '??????????? (Login)'}</span>
              </button>
            </form>
          )}

          {/* Accounts Directory Button */}
          {!recoveryMode && isDemo && <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <button
              onClick={() => setShowAccountsModal(true)}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline flex items-center justify-center gap-1.5 mx-auto"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>???????????? ???????????????? (Accounts Directory)</span>
            </button>
          </div>}
        </div>
      </div>
    </div>
  );
};

