export const initialTrips = [
  {
    id: 'trip-1',
    title: 'Liburan Eksotis Bali',
    destination: 'Bali, Indonesia',
    weather: { location: 'Kuta, Bali', temp: '31°C', condition: 'Cerah', icon: 'fa-sun' },
    startDate: '2026-09-10',
    endDate: '2026-09-15',
    budget: 8500000,
    spent: 3200000,
    status: 'Direncanakan',
    coverImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
    description: 'Petualangan 6 hari menikmati pantai eksotis, pura megah, dan kuliner khas Bali.',
    shareCode: 'BALI-2026-88',
    collaborators: [
      { id: 'u2', name: 'Siti Rahma', email: 'siti.rahma@email.com', role: 'Bisa Mengedit', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80' },
      { id: 'u3', name: 'Andi Wijaya', email: 'andi.w@email.com', role: 'Lihat Saja', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80' }
    ],
    activities: [
      { id: 'act-1', day: 1, time: '09:00', title: 'Tiba di Bandara Ngurah Rai', category: 'Transportasi', cost: 150000, lat: -8.7482, lng: 115.1672, notes: 'Jemput mobil sewaan di area kedatangan.' },
      { id: 'act-2', day: 1, time: '14:00', title: 'Pura Tanah Lot', category: 'Budaya', cost: 60000, lat: -8.6212, lng: 115.0868, notes: 'Foto sunset dengan latar belakang pura ikonik.' },
      { id: 'act-3', day: 1, time: '19:00', title: 'Makan Malam Seafood Jimbaran', category: 'Kuliner', cost: 350000, lat: -8.7675, lng: 115.1636, notes: 'Meja outdoor pinggir pantai.' },
      { id: 'act-4', day: 2, time: '08:30', title: 'Ubud Monkey Forest', category: 'Alam', cost: 80000, lat: -8.5194, lng: 115.2606, notes: 'Simpan kacamata dan HP dalam tas rapat.' },
      { id: 'act-5', day: 2, time: '13:00', title: 'Tegalalang Rice Terrace', category: 'Alam', cost: 50000, lat: -8.4312, lng: 115.2810, notes: 'Coba wahana ayunan ekstrem.' }
    ],
    wishlist: [
      { id: 'wl-1', day: 1, title: 'Warung Nasi Campur Ibu Raya', cost: 45000, votes: 3, proposedBy: 'Siti Rahma', notes: 'Rekomendasi kuliner pedas rasa lokal.', mapUrl: 'https://maps.google.com' },
      { id: 'wl-2', day: 2, title: 'Atlas Beach Club Canggu', cost: 250000, votes: 5, proposedBy: 'Andi Wijaya', notes: 'Tempat santai sore menikmati DJ & pool bar.', mapUrl: 'https://maps.google.com' },
      { id: 'wl-3', day: 3, title: 'Diving di Pulau Nusa Penida', cost: 750000, votes: 2, proposedBy: 'Budi Pratama', notes: 'Berenang bersama Ikan Manta.', mapUrl: 'https://maps.google.com' }
    ],
    dresscode: {
      1: { theme: 'Tropical Casual & Sunset Vibe', color: 'White & Blue Floral', notes: 'Baju santai bahan adem & kacamata hitam untuk pantai sunset.' },
      2: { theme: 'Jungle & Terrace Earth Tone', color: 'Beige & Sage Green', notes: 'Sepatu kets nyaman untuk jalan di terasering & hutan Ubud.' },
      3: { theme: 'Water Sport & Beachwear', color: 'Neon & Bright Colors', notes: 'Pakaian renang, sunblock, dan baju ganti kering.' }
    }
  },
  {
    id: 'trip-2',
    title: 'Eksplorasi Budaya Yogyakarta',
    destination: 'Yogyakarta, Indonesia',
    weather: { location: 'Malioboro, Jogja', temp: '29°C', condition: 'Berawan', icon: 'fa-cloud-sun' },
    startDate: '2026-10-05',
    endDate: '2026-10-08',
    budget: 4500000,
    spent: 1200000,
    status: 'Direncanakan',
    coverImage: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=800&q=80',
    description: 'Menjelajahi keajaiban Candi Borobudur, Malioboro, dan kuliner Gudeg Jogja.',
    shareCode: 'JOGJA-2026-12',
    collaborators: [
      { id: 'u4', name: 'Dewi Lestari', email: 'dewi.l@email.com', role: 'Bisa Mengedit', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80' }
    ],
    activities: [
      { id: 'act-6', day: 1, time: '06:00', title: 'Sunrise di Candi Borobudur', category: 'Budaya', cost: 150000, lat: -7.6079, lng: 110.2038, notes: 'Tiket naik stupa utama.' },
      { id: 'act-7', day: 1, time: '12:00', title: 'Gudeg Yu Djum Wijilan', category: 'Kuliner', cost: 60000, lat: -7.8045, lng: 110.3642, notes: 'Beli paket besek untuk makan siang.' },
      { id: 'act-8', day: 1, time: '16:00', title: 'Jalan Santai di Malioboro', category: 'Belanja', cost: 200000, lat: -7.7926, lng: 110.3658, notes: 'Beli batik & kerajinan tangan.' }
    ],
    wishlist: [
      { id: 'wl-4', day: 1, title: 'Kopi Joss Angkringan Lik Man', cost: 20000, votes: 4, proposedBy: 'Dewi Lestari', notes: 'Sensasi kopi dengan arang membara.', mapUrl: 'https://maps.google.com' }
    ],
    dresscode: {
      1: { theme: 'Traditional Batik & Heritage Casual', color: 'Brown & Terracotta Batik', notes: 'Pakaian batik santai cocok untuk candi & Malioboro.' }
    }
  }
];

export const initialSpots = [
  {
    id: 'spot-1',
    name: 'Pura Tanah Lot',
    category: 'Budaya',
    destination: 'Bali',
    rating: 4.8,
    price: 60000,
    lat: -8.6212,
    lng: 115.0868,
    image: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=600&q=80',
    description: 'Pura kuno di atas pulau batu kecil yang diterjang ombak samudra.',
    address: 'Beraban, Kediri, Kabupaten Tabanan, Bali'
  },
  {
    id: 'spot-2',
    name: 'Pantai Kuta',
    category: 'Alam',
    destination: 'Bali',
    rating: 4.6,
    price: 0,
    lat: -8.7183,
    lng: 115.1686,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    description: 'Pantai pasir putih paling populer dengan pemandangan matahari terbenam spektakuler.',
    address: 'Kuta, Badung, Bali'
  },
  {
    id: 'spot-3',
    name: 'Candi Borobudur',
    category: 'Budaya',
    destination: 'Yogyakarta',
    rating: 4.9,
    price: 150000,
    lat: -7.6079,
    lng: 110.2038,
    image: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=600&q=80',
    description: 'Candi Buddha terbesar di dunia abad ke-9 dan Situs Warisan Dunia UNESCO.',
    address: 'Magelang, Jawa Tengah'
  }
];

export const initialUser = {
  name: 'Budi Pratama',
  email: 'budi.pratama@traveler.id',
  phone: '+62 812-3456-7890',
  bio: 'Pengelana alam & pencari sunset di seluruh pelosok Nusantara 📸🌴',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
  isLoggedIn: false
};

export const initialSettings = {
  notifications: {
    tripReminder: true,
    promoAlerts: true,
    friendActivity: false
  },
  appearance: {
    darkMode: false,
    language: 'id',
    currency: 'IDR'
  },
  sync: {
    autoSync: true,
    lastSynced: '11 Agt 2026, 18:45 WIB',
    status: 'Tersinkronisasi'
  }
};

export const travelTips = [
  "Bawa kacamata hitam, tabur sunblock SPF 50, dan pastikan baterai kamera/HP selalu terisi penuh! 📸",
  "Selalu siapkan uang tunai pecahan kecil untuk pembayaran tiket retribusi parkir & jajanan pasar lokal. 🪙",
  "Gunakan fitur 'Wishlist Grup' di aplikasi ini untuk menentukan destinasi impian bersama kawan perjalananmu! 💖",
  "Jangan lupa untuk melihat panduan 'Dresscode' harian agar foto rombongan kalian makin kompak dan estetik! 👕",
  "Perhatikan estimasi jam perjalanan agar tidak terjebak kemacetan saat jam sibuk sore hari. 🚗"
];
