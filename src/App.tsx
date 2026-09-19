import { useState } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────
type Role = 'mahasiswa' | 'dosen' | 'admin';
type Status = 'Baru' | 'Diproses' | 'Selesai' | 'Ditolak';
type Category = 'Fasilitas' | 'Layanan Akademik' | 'Kebersihan' | 'Keamanan' | 'Lainnya';

interface Complaint {
  id: string;
  code: string;
  category: Category;
  title: string;
  description: string;
  status: Status;
  date: string;
  isAnonymous: boolean;
  senderLabel: string;
  hasPhoto: boolean;
  response?: string;
  responseDate?: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_COMPLAINTS: Complaint[] = [
  {
    id: '1', code: 'MDP-2024-001', category: 'Fasilitas',
    title: 'AC Ruang Kelas G.301 Rusak',
    description: 'AC di ruang kelas G.301 sudah tidak berfungsi selama 3 hari terakhir sehingga membuat suasana belajar tidak nyaman, terutama pada siang hari.',
    status: 'Diproses', date: '15 Sep 2024', isAnonymous: true, senderLabel: 'Anonim', hasPhoto: true,
    response: 'Terima kasih atas pengaduan Anda. Tim teknisi sedang dalam proses perbaikan dan dijadwalkan selesai dalam 2-3 hari kerja.',
    responseDate: '16 Sep 2024',
  },
  {
    id: '2', code: 'MDP-2024-002', category: 'Kebersihan',
    title: 'Toilet Lantai 2 Gedung B Kurang Bersih',
    description: 'Toilet di lantai 2 gedung B sering dalam kondisi kotor dan tidak terawat. Sabun tangan juga sering habis tidak diisi ulang.',
    status: 'Selesai', date: '10 Sep 2024', isAnonymous: false, senderLabel: 'Pengirim Terverifikasi', hasPhoto: false,
    response: 'Pengaduan telah ditindaklanjuti. Tim kebersihan telah diberikan jadwal pembersihan lebih rutin dan stok sabun telah diisi ulang.',
    responseDate: '12 Sep 2024',
  },
  {
    id: '3', code: 'MDP-2024-003', category: 'Layanan Akademik',
    title: 'Antrian Pengambilan Transkrip Terlalu Lama',
    description: 'Proses pengambilan transkrip nilai di bagian akademik memerlukan waktu yang sangat lama, bisa mencapai 2-3 jam antrian.',
    status: 'Baru', date: '17 Sep 2024', isAnonymous: true, senderLabel: 'Anonim', hasPhoto: false,
  },
  {
    id: '4', code: 'MDP-2024-004', category: 'Keamanan',
    title: 'Lampu Parkir Belakang Mati',
    description: 'Beberapa lampu di area parkir belakang kampus sudah mati sehingga area tersebut menjadi gelap dan kurang aman pada malam hari.',
    status: 'Baru', date: '16 Sep 2024', isAnonymous: true, senderLabel: 'Anonim', hasPhoto: true,
  },
  {
    id: '5', code: 'MDP-2024-005', category: 'Fasilitas',
    title: 'Proyektor Ruang D.201 Tidak Berfungsi',
    description: 'Proyektor di ruang D.201 sering mati mendadak saat sedang digunakan untuk presentasi dan perkuliahan.',
    status: 'Ditolak', date: '8 Sep 2024', isAnonymous: false, senderLabel: 'Pengirim Terverifikasi', hasPhoto: false,
    response: 'Setelah dicek, proyektor berfungsi normal. Kemungkinan masalah pada koneksi kabel HDMI. Mohon hubungi petugas gedung untuk bantuan teknis saat perlu digunakan.',
    responseDate: '9 Sep 2024',
  },
];

const MY_COMPLAINTS = ['1', '3'];

// ─── Utility ──────────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: Status }) {
  const cls: Record<Status, string> = {
    'Baru': 'bg-blue-50 text-blue-700 border border-blue-100',
    'Diproses': 'bg-yellow-50 text-yellow-700 border border-yellow-100',
    'Selesai': 'bg-green-50 text-green-700 border border-green-100',
    'Ditolak': 'bg-red-50 text-red-700 border border-red-100',
  };
  const dot: Record<Status, string> = {
    'Baru': 'bg-blue-500', 'Diproses': 'bg-yellow-500',
    'Selesai': 'bg-green-500', 'Ditolak': 'bg-red-500',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cls[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot[status]}`} />
      {status}
    </span>
  );
}

function CategoryIcon({ category }: { category: Category }) {
  const icons: Record<Category, string> = {
    'Fasilitas': '🏛️', 'Layanan Akademik': '📋',
    'Kebersihan': '🧹', 'Keamanan': '🔒', 'Lainnya': '📌',
  };
  return <span>{icons[category]}</span>;
}

// ─── LOGIN PAGE ───────────────────────────────────────────────────────────────
function LoginPage({ onLogin }: { onLogin: (role: Role) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Email dan kata sandi harus diisi.'); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (email.includes('admin')) onLogin('admin');
      else if (email.includes('dosen')) onLogin('dosen');
      else onLogin('mahasiswa');
    }, 900);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 via-red-700 to-red-900 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-black/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/[0.02] border border-white/10" />
      </div>

      <div className="w-full max-w-md relative">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 px-8 pt-10 pb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none">
                  <rect width="40" height="40" rx="10" fill="#DC2626"/>
                  <path d="M20 8C13.37 8 8 13.37 8 20C8 26.63 13.37 32 20 32C26.63 32 32 26.63 32 20C32 13.37 26.63 8 20 8Z" fill="white" fillOpacity="0.2"/>
                  <path d="M20 10C14.48 10 10 14.48 10 20C10 25.52 14.48 30 20 30C25.52 30 30 25.52 30 20C30 14.48 25.52 10 20 10ZM20 14C21.1 14 22 14.9 22 16C22 17.1 21.1 18 20 18C18.9 18 18 17.1 18 16C18 14.9 18.9 14 20 14ZM20 26C17.33 26 14.97 24.65 13.54 22.57C13.57 20.53 17.67 19.4 20 19.4C22.32 19.4 26.43 20.53 26.46 22.57C25.03 24.65 22.67 26 20 26Z" fill="white"/>
                </svg>
              </div>
              <div>
                <h1 className="text-white text-2xl font-bold" style={{fontFamily: 'Plus Jakarta Sans, sans-serif'}}>MDP Care</h1>
                <p className="text-red-200 text-sm font-medium">Portal Pengaduan Kampus</p>
              </div>
            </div>
            <p className="text-white/70 text-sm">Universitas Multi Data Palembang</p>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            <h2 className="text-gray-900 text-xl font-bold mb-1" style={{fontFamily: 'Plus Jakarta Sans, sans-serif'}}>Masuk ke Akun Anda</h2>
            <p className="text-gray-500 text-sm mb-7">Gunakan akun kampus MDP untuk masuk</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Kampus</label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2">
                    <svg className="w-4.5 h-4.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  </div>
                  <input
                    type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="nama@mdp.ac.id"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-400 focus:bg-white focus:ring-3 focus:ring-red-50 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Kata Sandi</label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2">
                    <svg className="w-4.5 h-4.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi"
                    className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-400 focus:bg-white focus:ring-3 focus:ring-red-50 transition-all"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                    {showPassword
                      ? <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                      : <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    }
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 rounded-xl border border-red-100">
                  <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                  <p className="text-red-600 text-xs font-medium">{error}</p>
                </div>
              )}

              <button type="submit" disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold py-3.5 rounded-xl transition-all duration-150 flex items-center justify-center gap-2 shadow-lg shadow-red-100 disabled:opacity-60 disabled:cursor-not-allowed mt-2">
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Memproses...
                  </>
                ) : 'Masuk'}
              </button>
            </form>

          </div>
        </div>

        <p className="text-center text-white/50 text-xs mt-6">© 2024 Universitas Multi Data Palembang</p>
      </div>
    </div>
  );
}

// ─── MOBILE APP (MAHASISWA / DOSEN) ──────────────────────────────────────────
type MobileView = 'home' | 'buat' | 'detail' | 'riwayat';

function MobileApp({ role, onLogout }: { role: 'mahasiswa' | 'dosen'; onLogout: () => void }) {
  const [view, setView] = useState<MobileView>('home');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'semua' | 'saya'>('semua');
  const [submitted, setSubmitted] = useState(false);
  const [hasSubmittedToday, setHasSubmittedToday] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);

  const myComplaints = MOCK_COMPLAINTS.filter(c => MY_COMPLAINTS.includes(c.id));
  const allComplaints = MOCK_COMPLAINTS.slice(0, 4);
  const displayList = activeTab === 'saya' ? myComplaints : allComplaints;

  const userName = role === 'mahasiswa' ? 'Andi Pratama' : 'Dr. Budi Santoso';
  const userCode = role === 'mahasiswa' ? '2024001234' : 'DSN-0089';
  const greeting = new Date().getHours() < 12 ? 'Selamat Pagi' : new Date().getHours() < 17 ? 'Selamat Siang' : 'Selamat Malam';

  const selectedComplaint = MOCK_COMPLAINTS.find(c => c.id === selectedId);

  const todayStr = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  const tomorrowStr = (() => {
    const d = new Date(); d.setDate(d.getDate() + 1);
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  })();

  const handleTryCreate = () => {
    if (hasSubmittedToday) { setShowLimitModal(true); return; }
    setView('buat');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10">
      {/* Daily limit modal */}
      {showLimitModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" style={{position: 'fixed'}}>
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowLimitModal(false)} />
          {/* Sheet */}
          <div className="relative w-full max-w-sm mx-auto bg-white rounded-t-3xl px-6 pt-6 pb-10 shadow-2xl z-10 animate-slide-up">
            {/* Drag handle */}
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-6" />

            {/* Icon */}
            <div className="flex justify-center mb-5">
              <div className="relative">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                </div>
                <div className="absolute -top-1 -right-1 w-7 h-7 bg-red-600 rounded-full flex items-center justify-center border-2 border-white">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
              </div>
            </div>

            <h2 className="text-center text-xl font-bold text-gray-900 mb-2" style={{fontFamily: 'Plus Jakarta Sans'}}>
              Batas Harian Tercapai
            </h2>
            <p className="text-center text-gray-500 text-sm leading-relaxed mb-5">
              Anda hanya dapat mengirimkan <span className="font-bold text-gray-900">1 pengaduan per hari</span>.
              Pengaduan hari ini telah berhasil dikirim.
            </p>

            {/* Info card */}
            <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-6 space-y-2.5">
              <div className="flex items-start gap-3">
                <svg className="w-4 h-4 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" />
                </svg>
                <div>
                  <p className="text-xs font-semibold text-red-700">Pengaduan Terkirim Hari Ini</p>
                  <p className="text-xs text-red-500 mt-0.5">{todayStr}</p>
                </div>
              </div>
              <div className="border-t border-red-100" />
              <div className="flex items-start gap-3">
                <svg className="w-4 h-4 text-red-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-xs font-semibold text-red-700">Dapat Membuat Lagi Mulai</p>
                  <p className="text-xs text-red-500 mt-0.5">{tomorrowStr}</p>
                </div>
              </div>
            </div>

            <p className="text-center text-xs text-gray-400 mb-5">
              Kebijakan ini diterapkan untuk memastikan setiap pengaduan mendapat perhatian yang layak dari admin.
            </p>

            <button onClick={() => setShowLimitModal(false)}
              className="w-full bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold py-4 rounded-2xl transition-colors text-sm">
              Mengerti
            </button>
          </div>
        </div>
      )}

      {/* Phone frame */}
      <div className="mobile-frame bg-white flex flex-col" style={{width: 390, minHeight: 844}}>
        {/* Status bar */}
        <div className="bg-red-600 px-6 pt-3 pb-1 flex justify-between items-center shrink-0">
          <span className="text-white text-xs font-semibold">9:41</span>
          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M1.5 8.5c5.25-5.25 13.5-5.25 19.5 0l-2.25 2.25c-4.125-3.75-10.875-3.75-15 0L1.5 8.5zm6 6l2.25 2.25c1.5-1.5 3.75-1.5 5.25 0L17.25 14.5c-2.625-2.625-6.375-2.625-9 0zm4.5 4.5l1.5 1.5 1.5-1.5c-.75-.75-2.25-.75-3 0z"/></svg>
            <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>
            <div className="flex items-center gap-0.5">
              <div className="w-4 h-2 border border-white rounded-sm p-0.5"><div className="w-3/4 h-full bg-white rounded-sm" /></div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {view === 'home' && (
            <div className="flex-1 overflow-y-auto">
              {/* Header */}
              <div className="bg-red-600 px-5 pt-4 pb-8">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-red-200 text-xs font-medium">{greeting},</p>
                    <h1 className="text-white text-lg font-bold" style={{fontFamily: 'Plus Jakarta Sans'}}>{userName}</h1>
                    <p className="text-red-200 text-xs mt-0.5">{role === 'mahasiswa' ? 'Mahasiswa' : 'Dosen'} · {userCode}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 bg-red-500 rounded-full flex items-center justify-center border-2 border-red-400">
                      <span className="text-white text-sm font-bold">{userName[0]}</span>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 mt-5">
                  {[
                    { label: 'Total', val: myComplaints.length, color: 'bg-white/20' },
                    { label: 'Diproses', val: myComplaints.filter(c => c.status === 'Diproses').length, color: 'bg-yellow-400/20' },
                    { label: 'Selesai', val: myComplaints.filter(c => c.status === 'Selesai').length, color: 'bg-green-400/20' },
                  ].map(s => (
                    <div key={s.label} className={`${s.color} rounded-2xl p-3 text-center`}>
                      <p className="text-white text-xl font-bold">{s.val}</p>
                      <p className="text-white/70 text-xs">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Body */}
              <div className="-mt-4 rounded-t-3xl bg-gray-50 min-h-full px-5 pt-5 pb-24">
                {/* Daily limit banner */}
                {hasSubmittedToday && (
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-4 flex items-start gap-3">
                    <div className="w-8 h-8 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-amber-800">Batas Harian Tercapai</p>
                      <p className="text-xs text-amber-600 mt-0.5 leading-relaxed">
                        Anda sudah mengirim <span className="font-semibold">1 pengaduan</span> hari ini. Dapat membuat lagi besok, <span className="font-semibold">{tomorrowStr}</span>.
                      </p>
                    </div>
                  </div>
                )}

                {/* Quick action */}
                <button onClick={handleTryCreate}
                  className={`w-full ${hasSubmittedToday
                    ? 'bg-gray-100 border-2 border-dashed border-gray-300 cursor-pointer'
                    : 'bg-red-600 hover:bg-red-700 active:scale-98 shadow-lg shadow-red-100'
                  } rounded-2xl p-4 flex items-center gap-3 mb-5 transition-all`}>
                  <div className={`w-10 h-10 ${hasSubmittedToday ? 'bg-gray-200' : 'bg-red-500'} rounded-xl flex items-center justify-center shrink-0`}>
                    {hasSubmittedToday
                      ? <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
                      : <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                    }
                  </div>
                  <div className="text-left">
                    <p className={`font-bold text-sm ${hasSubmittedToday ? 'text-gray-500' : 'text-white'}`}>
                      {hasSubmittedToday ? 'Tidak Dapat Membuat Pengaduan' : 'Buat Pengaduan Baru'}
                    </p>
                    <p className={`text-xs mt-0.5 ${hasSubmittedToday ? 'text-gray-400' : 'text-red-200'}`}>
                      {hasSubmittedToday ? 'Kuota 1 pengaduan/hari telah digunakan — Ketuk untuk info' : 'Maks. 1 pengaduan per hari · Maks. 1 foto'}
                    </p>
                  </div>
                  <svg className={`w-5 h-5 ml-auto shrink-0 ${hasSubmittedToday ? 'text-gray-300' : 'text-red-200'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>

                {/* Tabs */}
                <div className="flex gap-1 bg-gray-200 p-1 rounded-xl mb-4">
                  {(['semua', 'saya'] as const).map(t => (
                    <button key={t} onClick={() => setActiveTab(t)}
                      className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${activeTab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}>
                      {t === 'semua' ? 'Semua Pengaduan' : 'Pengaduan Saya'}
                    </button>
                  ))}
                </div>

                {/* List */}
                <div className="space-y-3">
                  {displayList.map(c => (
                    <button key={c.id} onClick={() => { setSelectedId(c.id); setView('detail'); }}
                      className="w-full bg-white rounded-2xl p-4 text-left shadow-sm border border-gray-100 hover:border-red-100 hover:shadow-md transition-all active:scale-98">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-base"><CategoryIcon category={c.category} /></span>
                          <span className="text-xs font-semibold text-gray-400">{c.category}</span>
                        </div>
                        <StatusBadge status={c.status} />
                      </div>
                      <p className="text-sm font-bold text-gray-900 mb-1 leading-snug">{c.title}</p>
                      <p className="text-xs text-gray-500 line-clamp-2">{c.description}</p>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-gray-400">{c.code}</span>
                          {c.hasPhoto && (
                            <span className="inline-flex items-center gap-0.5 text-xs text-blue-500">
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
                              Foto
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-400">{c.date}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Logout */}
                <button onClick={onLogout}
                  className="w-full mt-6 py-3 rounded-xl border border-gray-200 text-gray-500 text-sm font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                  </svg>
                  Keluar
                </button>
              </div>
            </div>
          )}

          {view === 'buat' && (
            <CreateComplaintView
              onBack={() => setView('home')}
              onSubmit={() => { setHasSubmittedToday(true); setSubmitted(true); setView('home'); }}
            />
          )}

          {view === 'detail' && selectedComplaint && (
            <DetailView complaint={selectedComplaint} onBack={() => setView('home')} />
          )}
        </div>

        {/* Bottom nav */}
        <div className="bg-white border-t border-gray-100 px-6 py-2 flex justify-around items-center shrink-0 shadow-lg">
          {[
            { id: 'home', label: 'Beranda', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg> },
            { id: 'buat', label: 'Buat', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg> },
            { id: 'riwayat', label: 'Riwayat', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
          ].map(n => (
            <button key={n.id} onClick={() => {
              if (n.id === 'buat') handleTryCreate();
              else if (n.id === 'riwayat') { setActiveTab('saya'); setView('home'); }
              else setView('home');
            }}
              className={`flex flex-col items-center gap-1 px-4 py-1 rounded-xl transition-all ${
                (view === 'home' && n.id === 'home') ? 'text-red-600' :
                (view === 'buat' && n.id === 'buat') ? 'text-red-600' : 'text-gray-400'
              }`}>
              {n.id === 'buat' ? (
                <div className={`w-12 h-12 -mt-6 rounded-2xl flex items-center justify-center shadow-lg relative ${hasSubmittedToday ? 'bg-gray-300 shadow-gray-100' : 'bg-red-600 shadow-red-200'}`}>
                  {hasSubmittedToday
                    ? <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
                    : <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                  }
                </div>
              ) : n.icon}
              <span className="text-[10px] font-semibold">{n.label}</span>
            </button>
          ))}
        </div>

        {/* Home indicator */}
        <div className="bg-white flex justify-center pb-2 pt-1 shrink-0">
          <div className="w-32 h-1 bg-gray-900 rounded-full opacity-20" />
        </div>
      </div>
    </div>
  );
}

function CreateComplaintView({ onBack, onSubmit }: { onBack: () => void; onSubmit: () => void }) {
  const [form, setForm] = useState({ category: '', title: '', description: '', isAnonymous: true });
  const [photo, setPhoto] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const categories: Category[] = ['Fasilitas', 'Layanan Akademik', 'Kebersihan', 'Keamanan', 'Lainnya'];

  if (submitted) return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
      <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-4">
        <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-2" style={{fontFamily: 'Plus Jakarta Sans'}}>Pengaduan Terkirim!</h2>
      <p className="text-gray-500 text-sm mb-1">Pengaduan Anda telah berhasil dikirim.</p>
      <p className="text-gray-400 text-xs mb-6">Admin akan segera menindaklanjuti pengaduan ini.</p>
      <button onClick={onSubmit}
        className="bg-red-600 text-white px-8 py-3 rounded-xl font-semibold text-sm hover:bg-red-700 transition-colors">
        Kembali ke Beranda
      </button>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-5 py-4 flex items-center gap-3 shrink-0">
        <button onClick={onBack} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors">
          <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <h1 className="font-bold text-gray-900" style={{fontFamily: 'Plus Jakarta Sans'}}>Buat Pengaduan</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5 bg-gray-50">
        {/* Anonymous toggle */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900 text-sm">Kirim Secara Anonim</p>
              <p className="text-xs text-gray-500 mt-0.5">Identitas Anda tidak akan ditampilkan</p>
            </div>
            <button onClick={() => setForm(f => ({...f, isAnonymous: !f.isAnonymous}))}
              className={`relative w-12 h-6 rounded-full transition-colors ${form.isAnonymous ? 'bg-red-600' : 'bg-gray-200'}`}>
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${form.isAnonymous ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
          {form.isAnonymous && (
            <div className="mt-3 flex items-center gap-2 bg-red-50 rounded-xl px-3 py-2">
              <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
              <p className="text-xs text-red-600 font-medium">Identitas Anda dijaga kerahasiaannya dari admin</p>
            </div>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Kategori <span className="text-red-500">*</span></label>
          <div className="grid grid-cols-2 gap-2">
            {categories.map(cat => (
              <button key={cat} onClick={() => setForm(f => ({...f, category: cat}))}
                className={`py-2.5 px-3 rounded-xl border text-xs font-semibold text-left transition-all flex items-center gap-2 ${
                  form.category === cat ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}>
                <CategoryIcon category={cat as Category} />
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Judul Pengaduan <span className="text-red-500">*</span></label>
          <input value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))}
            placeholder="Tuliskan judul pengaduan"
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-400 focus:ring-3 focus:ring-red-50 transition-all"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Deskripsi <span className="text-red-500">*</span></label>
          <textarea value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))}
            placeholder="Jelaskan pengaduan Anda secara detail (lokasi, waktu kejadian, dampak, dll.)"
            rows={4}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-400 focus:ring-3 focus:ring-red-50 transition-all resize-none"
          />
        </div>

        {/* Photo upload */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Foto Bukti <span className="text-gray-400 font-normal">(opsional, maks. 1 foto)</span></label>
          {photo ? (
            <div className="relative bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <img src={photo} alt="Foto bukti" className="w-full h-40 object-cover" />
              <button onClick={() => setPhoto(null)}
                className="absolute top-2 right-2 w-7 h-7 bg-black/60 rounded-full flex items-center justify-center hover:bg-black/80 transition-colors">
                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          ) : (
            <button onClick={() => setPhoto('https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&h=400&fit=crop&auto=format')}
              className="w-full bg-white border-2 border-dashed border-gray-200 rounded-2xl py-8 flex flex-col items-center gap-2 hover:border-red-300 hover:bg-red-50/30 transition-all">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-gray-600">Unggah Foto</p>
              <p className="text-xs text-gray-400">PNG, JPG hingga 5MB</p>
            </button>
          )}
        </div>
      </div>

      {/* Submit */}
      <div className="bg-white border-t border-gray-100 px-5 py-4 shrink-0">
        <button
          onClick={() => { if (form.category && form.title && form.description) setSubmitted(true); }}
          disabled={!form.category || !form.title || !form.description}
          className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold py-4 rounded-2xl transition-all text-sm disabled:cursor-not-allowed shadow-lg shadow-red-100 disabled:shadow-none">
          Kirim Pengaduan
        </button>
      </div>
    </div>
  );
}

function DetailView({ complaint: c, onBack }: { complaint: Complaint; onBack: () => void }) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="bg-white border-b border-gray-100 px-5 py-4 flex items-center gap-3 shrink-0">
        <button onClick={onBack} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors">
          <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <div className="flex-1">
          <h1 className="font-bold text-gray-900 text-sm" style={{fontFamily: 'Plus Jakarta Sans'}}>Detail Pengaduan</h1>
          <p className="text-xs text-gray-400">{c.code}</p>
        </div>
        <StatusBadge status={c.status} />
      </div>

      <div className="flex-1 overflow-y-auto bg-gray-50 pb-6">
        <div className="px-5 py-5 space-y-4">
          {/* Main card */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg"><CategoryIcon category={c.category} /></span>
              <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{c.category}</span>
            </div>
            <h2 className="font-bold text-gray-900 mb-2 leading-snug" style={{fontFamily: 'Plus Jakarta Sans'}}>{c.title}</h2>
            <p className="text-sm text-gray-600 leading-relaxed">{c.description}</p>

            {c.hasPhoto && (
              <div className="mt-4 rounded-xl overflow-hidden bg-gray-100">
                <img src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&h=400&fit=crop&auto=format"
                  alt="Foto bukti" className="w-full h-40 object-cover" />
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${c.isAnonymous ? 'bg-gray-400' : 'bg-green-500'}`} />
                <span className="text-xs text-gray-500">{c.isAnonymous ? 'Pengaduan Anonim' : 'Terverifikasi'}</span>
              </div>
              <span className="text-xs text-gray-400">{c.date}</span>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 text-sm mb-4" style={{fontFamily: 'Plus Jakarta Sans'}}>Riwayat Status</h3>
            <div className="space-y-3">
              {[
                { label: 'Pengaduan Dikirim', date: c.date, done: true },
                { label: 'Diterima Admin', date: c.date, done: true },
                { label: 'Sedang Diproses', date: c.responseDate ?? '—', done: c.status !== 'Baru' },
                { label: 'Selesai', date: c.status === 'Selesai' ? c.responseDate ?? '—' : '—', done: c.status === 'Selesai' },
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${step.done ? 'bg-red-600' : 'bg-gray-100'}`}>
                    {step.done
                      ? <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                      : <span className="w-2 h-2 rounded-full bg-gray-300" />
                    }
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${step.done ? 'text-gray-900' : 'text-gray-400'}`}>{step.label}</p>
                    <p className="text-xs text-gray-400">{step.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Response */}
          {c.response && (
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 bg-red-600 rounded-full flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" /></svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900" style={{fontFamily: 'Plus Jakarta Sans'}}>Tanggapan Admin</p>
                  <p className="text-xs text-gray-400">{c.responseDate}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-xl p-3">{c.response}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── ADMIN DESKTOP ────────────────────────────────────────────────────────────
type AdminView = 'dashboard' | 'list' | 'detail';

function AdminApp({ onLogout }: { onLogout: () => void }) {
  const [view, setView] = useState<AdminView>('dashboard');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [complaints, setComplaints] = useState<Complaint[]>(MOCK_COMPLAINTS);
  const [filterStatus, setFilterStatus] = useState<Status | 'Semua'>('Semua');
  const [filterCategory, setFilterCategory] = useState<Category | 'Semua'>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const selected = complaints.find(c => c.id === selectedId);

  const filtered = complaints.filter(c => {
    const matchStatus = filterStatus === 'Semua' || c.status === filterStatus;
    const matchCat = filterCategory === 'Semua' || c.category === filterCategory;
    const matchSearch = !searchQuery || c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchCat && matchSearch;
  });

  const stats = {
    total: complaints.length,
    baru: complaints.filter(c => c.status === 'Baru').length,
    diproses: complaints.filter(c => c.status === 'Diproses').length,
    selesai: complaints.filter(c => c.status === 'Selesai').length,
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-100 flex flex-col transition-all duration-300 shrink-0 shadow-sm`}>
        {/* Logo */}
        <div className="px-5 py-5 border-b border-gray-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          {sidebarOpen && (
            <div className="overflow-hidden">
              <p className="font-bold text-gray-900 text-sm" style={{fontFamily: 'Plus Jakarta Sans'}}>MDP Care</p>
              <p className="text-xs text-gray-400">Panel Admin</p>
            </div>
          )}
          <button onClick={() => setSidebarOpen(o => !o)} className="ml-auto text-gray-400 hover:text-gray-600 transition-colors shrink-0">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {sidebarOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                : <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              }
            </svg>
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25A2.25 2.25 0 0113.5 8.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg> },
            { id: 'list', label: 'Daftar Pengaduan', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg> },
          ].map(n => (
            <button key={n.id} onClick={() => setView(n.id as AdminView)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                view === n.id || (view === 'detail' && n.id === 'list')
                  ? 'bg-red-50 text-red-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}>
              <span className="shrink-0">{n.icon}</span>
              {sidebarOpen && <span className="text-sm font-semibold">{n.label}</span>}
              {sidebarOpen && n.id === 'list' && stats.baru > 0 && (
                <span className="ml-auto bg-red-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">{stats.baru}</span>
              )}
            </button>
          ))}
        </nav>

        {/* User & logout */}
        <div className="px-3 py-4 border-t border-gray-100 space-y-1">
          {sidebarOpen && (
            <div className="px-3 py-2 mb-2">
              <p className="text-xs font-semibold text-gray-900">Admin MDP</p>
              <p className="text-xs text-gray-400">admin@mdp.ac.id</p>
            </div>
          )}
          <button onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-all">
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
            {sidebarOpen && <span className="text-sm font-semibold">Keluar</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        {view === 'dashboard' && (
          <AdminDashboard stats={stats} complaints={complaints}
            onViewList={() => setView('list')}
            onViewDetail={(id) => { setSelectedId(id); setView('detail'); }} />
        )}
        {view === 'list' && (
          <AdminList
            complaints={filtered} filterStatus={filterStatus} filterCategory={filterCategory}
            searchQuery={searchQuery}
            setFilterStatus={setFilterStatus} setFilterCategory={setFilterCategory}
            setSearchQuery={setSearchQuery}
            onViewDetail={(id) => { setSelectedId(id); setView('detail'); }} />
        )}
        {view === 'detail' && selected && (
          <AdminDetail
            complaint={selected}
            onBack={() => setView('list')}
            onUpdateStatus={(id, status) => setComplaints(prev => prev.map(c => c.id === id ? {...c, status} : c))}
            onSendResponse={(id, response) => setComplaints(prev => prev.map(c => c.id === id ? {...c, response, responseDate: '17 Sep 2024', status: 'Selesai'} : c))}
          />
        )}
      </main>
    </div>
  );
}

function AdminDashboard({ stats, complaints, onViewList, onViewDetail }: {
  stats: { total: number; baru: number; diproses: number; selesai: number };
  complaints: Complaint[];
  onViewList: () => void;
  onViewDetail: (id: string) => void;
}) {
  const recentComplaints = complaints.slice(0, 4);
  const categoryData = ['Fasilitas', 'Layanan Akademik', 'Kebersihan', 'Keamanan', 'Lainnya'].map(cat => ({
    name: cat,
    count: complaints.filter(c => c.category === cat).length,
    color: { 'Fasilitas': 'bg-blue-500', 'Layanan Akademik': 'bg-purple-500', 'Kebersihan': 'bg-green-500', 'Keamanan': 'bg-orange-500', 'Lainnya': 'bg-gray-400' }[cat] || 'bg-gray-400',
  }));
  const maxCount = Math.max(...categoryData.map(d => d.count), 1);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900" style={{fontFamily: 'Plus Jakarta Sans'}}>Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Selamat datang, Admin. Berikut ringkasan pengaduan hari ini.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-5 mb-8">
        {[
          { label: 'Total Pengaduan', val: stats.total, color: 'bg-gray-900', text: 'text-white', sub: 'text-gray-300', icon: '📋' },
          { label: 'Pengaduan Baru', val: stats.baru, color: 'bg-blue-50', text: 'text-blue-700', sub: 'text-blue-400', icon: '🔔', badge: true },
          { label: 'Sedang Diproses', val: stats.diproses, color: 'bg-yellow-50', text: 'text-yellow-700', sub: 'text-yellow-400', icon: '⚙️' },
          { label: 'Selesai', val: stats.selesai, color: 'bg-green-50', text: 'text-green-700', sub: 'text-green-400', icon: '✅' },
        ].map(s => (
          <div key={s.label} className={`${s.color} rounded-2xl p-5 relative overflow-hidden`}>
            <div className="flex justify-between items-start mb-4">
              <span className="text-2xl">{s.icon}</span>
              {s.badge && s.val > 0 && (
                <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">Baru</span>
              )}
            </div>
            <p className={`text-3xl font-bold ${s.text}`} style={{fontFamily: 'Plus Jakarta Sans'}}>{s.val}</p>
            <p className={`text-sm font-medium mt-1 ${s.sub}`}>{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Recent */}
        <div className="col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900" style={{fontFamily: 'Plus Jakarta Sans'}}>Pengaduan Terbaru</h2>
            <button onClick={onViewList} className="text-red-600 text-sm font-semibold hover:text-red-700 transition-colors">
              Lihat Semua →
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {recentComplaints.map(c => (
              <button key={c.id} onClick={() => onViewDetail(c.id)}
                className="w-full px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors text-left">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center shrink-0 text-lg">
                  <CategoryIcon category={c.category} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm truncate">{c.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-gray-400">{c.code}</span>
                    <span className="text-gray-300">·</span>
                    <span className="text-xs text-gray-400">{c.category}</span>
                    <span className="text-gray-300">·</span>
                    <span className="text-xs text-gray-400">{c.isAnonymous ? 'Anonim' : 'Terverifikasi'}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <StatusBadge status={c.status} />
                  <span className="text-xs text-gray-400">{c.date}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Category chart */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-gray-900 mb-5" style={{fontFamily: 'Plus Jakarta Sans'}}>Kategori Pengaduan</h2>
          <div className="space-y-4">
            {categoryData.map(d => (
              <div key={d.name}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-medium text-gray-600">{d.name}</span>
                  <span className="text-xs font-bold text-gray-900">{d.count}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full ${d.color} rounded-full transition-all`}
                    style={{width: `${(d.count / maxCount) * 100}%`}} />
                </div>
              </div>
            ))}
          </div>

          {/* Status breakdown */}
          <div className="mt-6 pt-5 border-t border-gray-100">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Status</h3>
            <div className="space-y-2">
              {[
                { label: 'Baru', color: 'bg-blue-500', pct: Math.round((stats.baru / stats.total) * 100) || 0 },
                { label: 'Diproses', color: 'bg-yellow-500', pct: Math.round((stats.diproses / stats.total) * 100) || 0 },
                { label: 'Selesai', color: 'bg-green-500', pct: Math.round((stats.selesai / stats.total) * 100) || 0 },
              ].map(s => (
                <div key={s.label} className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${s.color} shrink-0`} />
                  <span className="text-xs text-gray-600 flex-1">{s.label}</span>
                  <span className="text-xs font-bold text-gray-900">{s.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminList({ complaints, filterStatus, filterCategory, searchQuery, setFilterStatus, setFilterCategory, setSearchQuery, onViewDetail }: {
  complaints: Complaint[];
  filterStatus: Status | 'Semua';
  filterCategory: Category | 'Semua';
  searchQuery: string;
  setFilterStatus: (s: Status | 'Semua') => void;
  setFilterCategory: (c: Category | 'Semua') => void;
  setSearchQuery: (q: string) => void;
  onViewDetail: (id: string) => void;
}) {
  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900" style={{fontFamily: 'Plus Jakarta Sans'}}>Daftar Pengaduan</h1>
        <p className="text-gray-500 text-sm mt-1">{complaints.length} pengaduan ditemukan</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-5 flex flex-wrap gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-60">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            placeholder="Cari pengaduan..."
            className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-300 focus:ring-2 focus:ring-red-50 transition-all" />
        </div>

        {/* Status filter */}
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as Status | 'Semua')}
          className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-red-300 transition-all">
          <option value="Semua">Semua Status</option>
          {(['Baru', 'Diproses', 'Selesai', 'Ditolak'] as Status[]).map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        {/* Category filter */}
        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value as Category | 'Semua')}
          className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-red-300 transition-all">
          <option value="Semua">Semua Kategori</option>
          {(['Fasilitas', 'Layanan Akademik', 'Kebersihan', 'Keamanan', 'Lainnya'] as Category[]).map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              {['Kode', 'Pengaduan', 'Kategori', 'Pengirim', 'Status', 'Tanggal', ''].map(h => (
                <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {complaints.map(c => (
              <tr key={c.id} className="hover:bg-gray-50/60 transition-colors">
                <td className="px-5 py-4">
                  <span className="text-xs font-mono font-semibold text-gray-500">{c.code}</span>
                </td>
                <td className="px-5 py-4 max-w-xs">
                  <p className="font-semibold text-gray-900 text-sm truncate">{c.title}</p>
                  <p className="text-xs text-gray-400 truncate mt-0.5">{c.description.slice(0, 60)}...</p>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1.5">
                    <CategoryIcon category={c.category} />
                    <span className="text-xs font-medium text-gray-600">{c.category}</span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${c.isAnonymous ? 'bg-gray-300' : 'bg-green-500'}`} />
                    <span className={`text-xs font-medium ${c.isAnonymous ? 'text-gray-400' : 'text-gray-600'}`}>
                      {c.isAnonymous ? 'Anonim' : 'Terverifikasi'}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-4"><StatusBadge status={c.status} /></td>
                <td className="px-5 py-4"><span className="text-xs text-gray-400">{c.date}</span></td>
                <td className="px-5 py-4">
                  <button onClick={() => onViewDetail(c.id)}
                    className="text-red-600 hover:text-red-700 font-semibold text-xs hover:underline transition-colors">
                    Detail →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {complaints.length === 0 && (
          <div className="py-16 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-3 text-2xl">📭</div>
            <p className="font-semibold text-gray-500">Tidak ada pengaduan ditemukan</p>
            <p className="text-xs text-gray-400 mt-1">Coba ubah filter pencarian Anda</p>
          </div>
        )}
      </div>
    </div>
  );
}

function AdminDetail({ complaint: c, onBack, onUpdateStatus, onSendResponse }: {
  complaint: Complaint;
  onBack: () => void;
  onUpdateStatus: (id: string, status: Status) => void;
  onSendResponse: (id: string, response: string) => void;
}) {
  const [response, setResponse] = useState(c.response ?? '');
  const [status, setStatus] = useState<Status>(c.status);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onUpdateStatus(c.id, status);
    if (response.trim()) onSendResponse(c.id, response.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-8">
      {/* Back + header */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 font-semibold text-sm transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Kembali
        </button>
        <div className="h-4 w-px bg-gray-200" />
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-gray-900" style={{fontFamily: 'Plus Jakarta Sans'}}>{c.title}</h1>
            <StatusBadge status={c.status} />
          </div>
          <p className="text-gray-400 text-sm mt-0.5">{c.code} · {c.date}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left: complaint detail */}
        <div className="col-span-2 space-y-5">
          {/* Info card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl"><CategoryIcon category={c.category} /></span>
              <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{c.category}</span>
              <span className={`ml-auto flex items-center gap-1.5 text-xs font-medium ${c.isAnonymous ? 'text-gray-400' : 'text-green-600'}`}>
                <div className={`w-2 h-2 rounded-full ${c.isAnonymous ? 'bg-gray-300' : 'bg-green-500'}`} />
                {c.isAnonymous ? 'Pengaduan Anonim — Identitas dirahasiakan' : 'Pengirim Terverifikasi'}
              </span>
            </div>
            <p className="text-gray-600 leading-relaxed">{c.description}</p>

            {c.hasPhoto && (
              <div className="mt-5">
                <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Foto Bukti</p>
                <div className="rounded-xl overflow-hidden bg-gray-100">
                  <img src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&h=400&fit=crop&auto=format"
                    alt="Foto bukti pengaduan" className="w-full h-52 object-cover" />
                </div>
              </div>
            )}
          </div>

          {/* Response */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-900 mb-4" style={{fontFamily: 'Plus Jakarta Sans'}}>Tanggapan Admin</h2>
            <textarea value={response} onChange={e => setResponse(e.target.value)}
              placeholder="Tuliskan tanggapan untuk pengaduan ini. Tanggapan akan dikirimkan kepada pengirim pengaduan."
              rows={5}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-400 focus:ring-3 focus:ring-red-50 transition-all resize-none"
            />
            <p className="text-xs text-gray-400 mt-2">Tanggapan ini akan terlihat oleh pengirim pengaduan.</p>
          </div>
        </div>

        {/* Right: actions */}
        <div className="space-y-5">
          {/* Status update */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-bold text-gray-900 text-sm mb-4" style={{fontFamily: 'Plus Jakarta Sans'}}>Ubah Status</h3>
            <div className="space-y-2">
              {(['Baru', 'Diproses', 'Selesai', 'Ditolak'] as Status[]).map(s => (
                <label key={s} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border cursor-pointer transition-all ${
                  status === s ? 'border-red-300 bg-red-50' : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                }`}>
                  <input type="radio" name="status" value={s} checked={status === s}
                    onChange={() => setStatus(s)} className="accent-red-600" />
                  <StatusBadge status={s} />
                </label>
              ))}
            </div>
          </div>

          {/* Meta */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-bold text-gray-900 text-sm mb-4" style={{fontFamily: 'Plus Jakarta Sans'}}>Informasi</h3>
            <div className="space-y-3">
              {[
                { label: 'Kode', val: c.code },
                { label: 'Tanggal', val: c.date },
                { label: 'Kategori', val: c.category },
                { label: 'Pengirim', val: c.isAnonymous ? 'Anonim' : 'Terverifikasi' },
                { label: 'Foto', val: c.hasPhoto ? 'Ada' : 'Tidak ada' },
              ].map(m => (
                <div key={m.label} className="flex justify-between items-start gap-2">
                  <span className="text-xs text-gray-400 shrink-0">{m.label}</span>
                  <span className="text-xs font-semibold text-gray-700 text-right">{m.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Save button */}
          <button onClick={handleSave}
            className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all ${
              saved
                ? 'bg-green-500 text-white shadow-lg shadow-green-100'
                : 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-100'
            }`}>
            {saved ? '✓ Tersimpan!' : 'Simpan Perubahan'}
          </button>

          {saved && (
            <p className="text-center text-xs text-gray-400">Status dan tanggapan berhasil diperbarui</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [role, setRole] = useState<Role | null>(null);

  if (!role) return <LoginPage onLogin={setRole} />;
  if (role === 'admin') return <AdminApp onLogout={() => setRole(null)} />;
  return <MobileApp role={role} onLogout={() => setRole(null)} />;
}
