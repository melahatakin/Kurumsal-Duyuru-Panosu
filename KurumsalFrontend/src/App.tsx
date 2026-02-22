import { useState, useEffect } from 'react';
import './App.css';

// 1. TİP TANIMI
interface IDuyuru {
  id: number;
  baslik: string;
  icerik: string;
  tarih: string;
}

function App() {
  // STATE'LER
  const [duyurular, setDuyurular] = useState<IDuyuru[]>([]);
  const [yeniBaslik, setYeniBaslik] = useState<string>("");
  const [yeniIcerik, setYeniIcerik] = useState<string>("");
  
  // EKRAN YÖNETİMİ (Routing Mantığı)
  // 'liste' -> Duyuruları gösterir
  // 'ekle' -> Formu gösterir
  const [aktifSayfa, setAktifSayfa] = useState<'liste' | 'ekle'>('liste');

  // Backend Adresi (Portunu Kontrol Et!)
  const backendUrl = "https://localhost:7173/api/duyuru"; 

  // Verileri Çekme Fonksiyonu
  const verileriGetir = () => {
    fetch(backendUrl)
      .then(res => res.json())
      .then(data => setDuyurular(data))
      .catch(err => console.error("Veri çekme hatası:", err));
  };

  // Sayfa ilk açıldığında verileri çek
  useEffect(() => {
    verileriGetir();
  }, []);

  // Ekleme Fonksiyonu
  const duyuruEkle = async () => {
    if(!yeniBaslik || !yeniIcerik) {
        alert("Lütfen tüm alanları doldurun!");
        return;
    }

    const gonderilecekVeri = {
      Baslik: yeniBaslik,
      Icerik: yeniIcerik
    };

    try {
        await fetch(backendUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(gonderilecekVeri)
        });

        // Temizlik
        setYeniBaslik("");
        setYeniIcerik("");
        
        // Önce verileri güncelle
        verileriGetir();
        
        // Sonra kullanıcıyı listeye geri gönder (Otomatik Geçiş)
        setAktifSayfa('liste'); 
        
    } catch (error) {
        console.error("Ekleme hatası:", error);
    }
  };

  // --- HTML / TASARIM KISMI ---
  return (
    // ANA KAPLAYICI (FLEXBOX İLE YAN YANA DİZME)
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "Arial, sans-serif" }}>
      
      {/* 1. SOL TARAFTAKİ MENÜ (Sidebar) */}
      <div style={{ 
          width: "250px", 
          backgroundColor: "#2c3e50", 
          color: "white", 
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "10px"
      }}>
        <h2 style={{ borderBottom: "1px solid #7f8c8d", paddingBottom: "10px" }}>Yönetim Paneli</h2>
        
        <button 
            onClick={() => setAktifSayfa('liste')}
            style={{ 
                padding: "15px", 
                backgroundColor: aktifSayfa === 'liste' ? "#34495e" : "transparent", 
                color: "white", 
                border: "none", 
                textAlign: "left", 
                cursor: "pointer",
                fontWeight: "bold"
            }}>
            📋 Duyuru Listesi
        </button>

        <button 
            onClick={() => setAktifSayfa('ekle')}
            style={{ 
                padding: "15px", 
                backgroundColor: aktifSayfa === 'ekle' ? "#27ae60" : "transparent", 
                color: "white", 
                border: "none", 
                textAlign: "left", 
                cursor: "pointer",
                fontWeight: "bold"
            }}>
            ➕ Yeni Duyuru Ekle
        </button>
      </div>

      {/* 2. SAĞ TARAFTAKİ İÇERİK ALANI (Main Content) */}
      <div style={{ flex: 1, padding: "40px", backgroundColor: "#ecf0f1" }}>
        
        {/* BAŞLIK KISMI */}
        <h1 style={{ color: "#2c3e50", marginTop: 0 }}>
            {aktifSayfa === 'liste' ? "📢 Güncel Duyurular" : "📝 Yeni Duyuru Oluştur"}
        </h1>

        {/* KOŞULLU RENDER (IF-ELSE MANTIĞI) */}
        {aktifSayfa === 'liste' ? (
            
            // --- LİSTE GÖRÜNÜMÜ ---
            <div style={{ display: "grid", gap: "20px" }}>
                {duyurular.length === 0 ? <p>Yükleniyor veya hiç duyuru yok...</p> : null}
                
                {duyurular.map((duyuru) => (
                <div key={duyuru.id} style={{ 
                    backgroundColor: "white", 
                    padding: "20px", 
                    borderRadius: "8px", 
                    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                    borderLeft: "5px solid #3498db"
                }}>
                    <h3 style={{ margin: "0 0 10px 0", color: "#2980b9" }}>{duyuru.baslik}</h3>
                    <p style={{ color: "#7f8c8d", lineHeight: "1.6" }}>{duyuru.icerik}</p>
                    <small style={{ color: "#bdc3c7", fontWeight: "bold" }}>
                        {new Date(duyuru.tarih).toLocaleDateString("tr-TR")}
                    </small>
                </div>
                ))}
            </div>

        ) : (
            
            // --- EKLEME FORMU GÖRÜNÜMÜ ---
            <div style={{ backgroundColor: "white", padding: "30px", borderRadius: "10px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)", maxWidth: "600px" }}>
                <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Başlık</label>
                    <input 
                        type="text" 
                        value={yeniBaslik}
                        onChange={(e) => setYeniBaslik(e.target.value)}
                        style={{ width: "100%", padding: "10px", border: "1px solid #bdc3c7", borderRadius: "5px" }}
                        placeholder="Örn: Ofis Tadilatı"
                    />
                </div>

                <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>İçerik</label>
                    <textarea 
                        value={yeniIcerik}
                        onChange={(e) => setYeniIcerik(e.target.value)}
                        rows={5}
                        style={{ width: "100%", padding: "10px", border: "1px solid #bdc3c7", borderRadius: "5px" }}
                        placeholder="Duyuru detaylarını buraya yazın..."
                    />
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                    <button 
                        onClick={duyuruEkle}
                        style={{ backgroundColor: "#27ae60", color: "white", padding: "12px 24px", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}>
                        Kaydet ve Yayınla
                    </button>
                    <button 
                        onClick={() => setAktifSayfa('liste')}
                        style={{ backgroundColor: "#95a5a6", color: "white", padding: "12px 24px", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" }}>
                        İptal
                    </button>
                </div>
            </div>

        )}
      </div>
    </div>
  );
}

export default App;