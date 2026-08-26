# Google Search Console API Kurulumu

Sitenizin gerçek SEO verilerini çekebilmek için bu adımları takip ederek `service-account.json` dosyasını oluşturmalısınız.

### 1. Google Cloud Projesi Oluşturma
1.  [Google Cloud Console](https://console.cloud.google.com/) adresine gidin.
2.  Sol üstteki proje seçiciden **"New Project"** (Yeni Proje) oluşturun. Adına "Travel Blog SEO" diyebilirsiniz.

### 2. API'yi Etkinleştirme
1.  Soldaki menüden **"APIs & Services" > "Library"** (API ve Hizmetler > Kitaplık) kısmına gidin.
2.  Arama çubuğuna **"Google Search Console API"** yazın.
3.  Çıkan sonuca tıklayıp **"ENABLE"** (Etkinleştir) butonuna basın.

### 3. Servis Hesabı (Service Account) Oluşturma
1.  Soldaki menüden **"APIs & Services" > "Credentials"** (Kimlik Bilgileri) kısmına gidin.
2.  Üstteki **"+ CREATE CREDENTIALS"** butonuna basıp **"Service Account"** seçeneğini seçin.
3.  Hesap adı girin (örn: `seo-bot`) ve "Create" deyin. Sonraki adımları "Done" diyerek geçebilirsiniz.

### 4. Anahtar (Key) Oluşturma ve İndirme
1.  Oluşturduğunuz servis hesabının üzerine tıklayın (Email adresine benzeyen kısım).
2.  Üst sekmelerden **"KEYS"** (Anahtarlar) sekmesine gelin.
3.  **"ADD KEY" > "Create new key"** butonuna basın.
4.  **JSON** seçeneğini seçip "Create" deyin.
5.  Bilgisayarınıza bir dosya inecek. **Bu dosyanın adını `service-account.json` olarak değiştirin.**

### 5. Dosyayı Projeye Ekleme
1.  İndirdiğiniz `service-account.json` dosyasını projenizin **`backend/config/`** klasörünün içine yapıştırın.
    *   Yol: `travel-blog/backend/config/service-account.json`

### 6. ÇOK ÖNEMLİ ADIM: Search Console Yetkilendirmesi
Bunu yapmazsanız **"403 Forbidden"** hatası alırsınız!

1.  `service-account.json` dosyasını not defteri ile açın ve **`client_email`** yazan yerdeki adresi kopyalayın (örn: `seo-bot@project-id.iam.gserviceaccount.com`).
2.  [Google Search Console](https://search.google.com/search-console)'a gidin ve sitenizi seçin.
3.  Sol menüden **"Ayarlar" > "Kullanıcılar ve İzinler"** kısmına gidin.
4.  **"Kullanıcı Ekle"** butonuna basın.
5.  Kopyaladığınız email adresini yapıştırın ve İzin olarak **"Tam" (Full)** seçin.
6.  "Ekle" diyerek tamamlayın.

Artık sistem sitenizin verilerini okuyabilir! 🎉
