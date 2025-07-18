/*
  # Kullanıcı Profilleri ve KVKK Onay Tabloları

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `full_name` (text, ad soyad)
      - `phone` (text, telefon numarası)
      - `email` (text, e-posta adresi)
      - `avatar_url` (text, profil fotoğrafı URL)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `user_kvkk_consents`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `consent_type` (text, onay türü - 'registration', 'marketing', vs.)
      - `consent_given` (boolean, onay verildi mi)
      - `consent_date` (timestamp, onay tarihi)
      - `ip_address` (text, IP adresi)
      - `user_agent` (text, tarayıcı bilgisi)
      - `kvkk_version` (text, KVKK metin versiyonu)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for user access
*/

-- Kullanıcı profilleri tablosu
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  full_name text,
  phone text,
  email text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- KVKK onayları tablosu
CREATE TABLE IF NOT EXISTS user_kvkk_consents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  consent_type text NOT NULL DEFAULT 'registration' CHECK (consent_type IN ('registration', 'marketing', 'communication', 'analytics')),
  consent_given boolean NOT NULL DEFAULT true,
  consent_date timestamptz NOT NULL DEFAULT now(),
  ip_address text,
  user_agent text,
  kvkk_version text DEFAULT '1.0',
  created_at timestamptz DEFAULT now()
);

-- RLS etkinleştir
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_kvkk_consents ENABLE ROW LEVEL SECURITY;

-- Kullanıcılar sadece kendi profillerini görebilir/düzenleyebilir
CREATE POLICY "Users can view own profile"
  ON user_profiles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Kullanıcılar kendi KVKK onaylarını görebilir
CREATE POLICY "Users can view own KVKK consents"
  ON user_kvkk_consents
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own KVKK consents"
  ON user_kvkk_consents
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- İndeksler
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_kvkk_consents_user_id ON user_kvkk_consents(user_id);
CREATE INDEX IF NOT EXISTS idx_user_kvkk_consents_type ON user_kvkk_consents(consent_type);
CREATE INDEX IF NOT EXISTS idx_user_kvkk_consents_date ON user_kvkk_consents(consent_date);

-- Otomatik updated_at güncelleme fonksiyonu (eğer yoksa)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger oluştur
CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON user_profiles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Kullanıcı kaydı sırasında otomatik profil oluşturma fonksiyonu
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, full_name, email, phone, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.email,
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  
  -- KVKK onayını kaydet (eğer verilmişse)
  IF NEW.raw_user_meta_data->>'kvkk_accepted' = 'true' THEN
    INSERT INTO public.user_kvkk_consents (
      user_id, 
      consent_type, 
      consent_given, 
      consent_date,
      kvkk_version
    )
    VALUES (
      NEW.id,
      'registration',
      true,
      COALESCE((NEW.raw_user_meta_data->>'kvkk_accepted_at')::timestamptz, now()),
      '1.0'
    );
  END IF;
  
  RETURN NEW;
END;
$$ language plpgsql security definer;

-- Trigger oluştur: Yeni kullanıcı oluşturulduğunda otomatik profil oluştur
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user(); 