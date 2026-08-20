import React, { useState } from 'react';
import { useSchool } from '../../context/SchoolContext';
import { 
  Building2, Users, GraduationCap, Calendar, Award, 
  TrendingUp, Phone, CheckCircle, ArrowRight, ShieldAlert, 
  MapPin, Navigation, ExternalLink, Globe, Compass 
} from 'lucide-react';
import { TabType } from '../layout/Sidebar';

interface ClusterOverviewProps {
  setActiveTab: (tab: TabType) => void;
}

export const ClusterOverview: React.FC<ClusterOverviewProps> = ({ setActiveTab }) => {
  const { cluster, schools, students, teachers, classes, setActiveSchoolId } = useSchool();
  const [selectedMapSchool, setSelectedMapSchool] = useState<string>('all');

  const handleSelectSchool = (schoolId: string) => {
    setActiveSchoolId(schoolId);
    setActiveTab('dashboard');
  };

  const filteredSchools = selectedMapSchool === 'all' 
    ? schools 
    : schools.filter(s => s.id === selectedMapSchool);

  return (
    <div className="space-y-6">
      {/* Cluster Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>កម្រិតរដ្ឋបាល៖ ប្រធានកម្រង</span>
            </span>
            <span className="text-xs text-blue-200">
              📍 {cluster.district} • {cluster.province}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold font-moul text-white mb-2">
            {cluster.nameKh}
          </h2>
          <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
            ប្រព័ន្ធត្រួតពិនិត្យ និងគ្រប់គ្រងបណ្តាញសាលាបឋមសិក្សាទាំង <strong>៧ សាលារៀន</strong> ក្នុងកម្រង។ ប្រធានកម្រង៖ <strong className="text-amber-300">{cluster.clusterHeadName}</strong> (📞 {cluster.phone})
          </p>

          {/* Quick Metrics Bar inside Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-4 border-t border-white/10">
            <div>
              <span className="text-[11px] text-blue-300 block">សាលារៀនសរុប</span>
              <span className="text-xl sm:text-2xl font-bold text-amber-300">៧ <span className="text-xs font-normal text-white">សាលា</span></span>
            </div>
            <div>
              <span className="text-[11px] text-blue-300 block">សិស្សទូទាំងកម្រង</span>
              <span className="text-xl sm:text-2xl font-bold text-white">{students.length.toLocaleString()} <span className="text-xs font-normal text-blue-200">នាក់</span></span>
            </div>
            <div>
              <span className="text-[11px] text-blue-300 block">គ្រូបង្រៀនសរុប</span>
              <span className="text-xl sm:text-2xl font-bold text-white">{teachers.length} <span className="text-xs font-normal text-blue-200">នាក់</span></span>
            </div>
            <div>
              <span className="text-[11px] text-blue-300 block">ថ្នាក់រៀនសរុប</span>
              <span className="text-xl sm:text-2xl font-bold text-white">{classes.length} <span className="text-xs font-normal text-blue-200">ថ្នាក់</span></span>
            </div>
          </div>
        </div>

        <div className="absolute -right-12 -bottom-12 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 🗺️ Geographic Locations & School Directory Section */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-rose-600" />
              <span>ទីតាំងភូមិសាស្ត្រ និងផែនទីសាលារៀនទាំង ៧ ក្នុងកម្រង</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              រដ្ឋបាលកម្រង៖ ឃុំថ្លុកដង្កោ ស្រុកជើងព្រៃ ខេត្តកំពង់ចាម
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedMapSchool}
              onChange={(e) => setSelectedMapSchool(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none"
            >
              <option value="all">បង្ហាញទីតាំងទាំង ៧ សាលា</option>
              {schools.map(s => (
                <option key={s.id} value={s.id}>{s.nameKh}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Location Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSchools.map((s, idx) => {
            const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s.nameKh + ' ' + s.address)}`;

            return (
              <div
                key={s.id}
                className={`p-4 rounded-2xl border transition-all ${
                  s.isClusterCenter
                    ? 'bg-blue-50/40 border-blue-200 ring-1 ring-blue-500/20'
                    : 'bg-slate-50/50 border-slate-200 hover:bg-white hover:shadow-md'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-xs">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{s.nameKh}</h4>
                      <span className="text-[10px] text-blue-600 font-mono font-semibold">{s.code}</span>
                    </div>
                  </div>
                  {s.isClusterCenter && (
                    <span className="text-[9px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold border border-amber-200">
                      សាលាកណ្តាល
                    </span>
                  )}
                </div>

                <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-start gap-1.5">
                    <span className="text-slate-400">📍</span>
                    <span className="font-medium text-slate-800">{s.address}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400">🌐</span>
                    <span className="font-mono text-[11px] text-slate-500">កូអរដោនេ: {s.gpsCoordinates || '12.0285° N, 105.0842° E'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400">👨‍💼</span>
                    <span>{s.principalName} (📞 {s.phone})</span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center justify-between gap-2">
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    <Navigation className="w-3 h-3 text-rose-500" />
                    <span>បើកមើលលើ Google Maps</span>
                    <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                  </a>

                  <button
                    onClick={() => handleSelectSchool(s.id)}
                    className="px-2.5 py-1 bg-white hover:bg-blue-600 hover:text-white border border-slate-200 text-slate-700 rounded-lg text-[11px] font-bold transition-all shadow-2xs"
                  >
                    ចូលគ្រប់គ្រង
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 7 Schools Grid Overview */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              <span>បញ្ជីសាលារៀនទាំង ៧ ក្នុងកម្រង</span>
            </h3>
            <p className="text-xs text-slate-500">ចុចលើសាលាណាមួយដើម្បីចូលទៅកាន់ផ្ទាំងគ្រប់គ្រងលម្អិត</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {schools.map((school, index) => {
            const schoolStudents = students.filter(s => s.schoolId === school.id);
            const schoolTeachers = teachers.filter(t => t.schoolId === school.id);
            const schoolClasses = classes.filter(c => c.schoolId === school.id);

            return (
              <div
                key={school.id}
                className={`bg-white rounded-2xl border transition-all p-5 flex flex-col justify-between hover:shadow-lg ${
                  school.isClusterCenter
                    ? 'border-blue-300 ring-2 ring-blue-500/20 shadow-sm'
                    : 'border-slate-200 shadow-xs'
                }`}
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-lg ${
                        school.isClusterCenter
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {index + 1}
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                            {school.nameKh}
                          </h4>
                        </div>
                        <span className="text-[11px] font-mono font-semibold text-blue-600">
                          {school.code}
                        </span>
                      </div>
                    </div>

                    {school.isClusterCenter && (
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200 shrink-0">
                        សាលាកណ្តាល
                      </span>
                    )}
                  </div>

                  {/* Principal Details */}
                  <div className="mt-4 p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs text-slate-600">
                    <div className="font-semibold text-slate-800">
                      👨‍💼 {school.principalName}
                    </div>
                    <div className="flex items-center gap-1 text-slate-500 font-mono text-[11px]">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{school.phone}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">
                      📍 {school.address}
                    </div>
                  </div>

                  {/* School Stats 10 Classes - 10 Teachers - 500 Students */}
                  <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                    <div className="p-2 bg-blue-50/60 rounded-xl border border-blue-100">
                      <span className="text-[10px] text-blue-600 block">ថ្នាក់រៀន</span>
                      <span className="font-bold text-slate-800 text-xs sm:text-sm">{schoolClasses.length} ថ្នាក់</span>
                    </div>
                    <div className="p-2 bg-emerald-50/60 rounded-xl border border-emerald-100">
                      <span className="text-[10px] text-emerald-600 block">គ្រូបង្រៀន</span>
                      <span className="font-bold text-slate-800 text-xs sm:text-sm">{schoolTeachers.length} នាក់</span>
                    </div>
                    <div className="p-2 bg-purple-50/60 rounded-xl border border-purple-100">
                      <span className="text-[10px] text-purple-600 block">សិស្ស</span>
                      <span className="font-bold text-slate-800 text-xs sm:text-sm">{schoolStudents.length} នាក់</span>
                    </div>
                  </div>
                </div>

                {/* Card Action Button */}
                <button
                  onClick={() => handleSelectSchool(school.id)}
                  className="mt-5 w-full py-2 px-3 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 group active:scale-95"
                >
                  <span>ចូលមើលទិន្នន័យសាលានេះ</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Comparison Table across 7 Schools */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <h3 className="text-base font-bold text-slate-800 mb-3 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" />
          <span>តារាងសង្ខេប និងប្រៀបធៀបសាលារៀនទាំង ៧ ក្នុងកម្រង</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-slate-700">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-bold">
              <tr>
                <th className="py-3 px-3 text-center">ល.រ</th>
                <th className="py-3 px-4">ឈ្មោះសាលារៀន</th>
                <th className="py-3 px-4">ទីតាំងភូមិសាស្ត្រ</th>
                <th className="py-3 px-3 text-center">ចំនួនថ្នាក់</th>
                <th className="py-3 px-3 text-center">ចំនួនគ្រូ</th>
                <th className="py-3 px-3 text-center">ចំនួនសិស្ស</th>
                <th className="py-3 px-3 text-center">អត្រាវត្តមាន</th>
                <th className="py-3 px-4 text-center">សកម្មភាព</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {schools.map((s, idx) => (
                <tr key={s.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="py-3 px-3 text-center font-bold text-slate-400">{idx + 1}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">
                    {s.nameKh} {s.isClusterCenter ? '★' : ''}
                  </td>
                  <td className="py-3 px-4 text-slate-600 text-xs">
                    📍 {s.village || s.address}
                  </td>
                  <td className="py-3 px-3 text-center font-mono font-semibold">១០ ថ្នាក់</td>
                  <td className="py-3 px-3 text-center font-mono font-semibold">១០ នាក់</td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-blue-600">៥០០ នាក់</td>
                  <td className="py-3 px-3 text-center font-bold text-emerald-600">
                    {95 + (idx % 4)}%
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleSelectSchool(s.id)}
                      className="px-3 py-1 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 font-bold text-xs rounded-lg transition-colors"
                    >
                      ជ្រើសរើស
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
