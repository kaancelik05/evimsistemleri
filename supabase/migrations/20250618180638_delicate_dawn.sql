/*
  # Blog CMS Tabloları

  1. New Tables
    - `blog_posts`
      - `id` (uuid, primary key)
      - `title` (text, başlık)
      - `slug` (text, URL dostu başlık)
      - `excerpt` (text, özet)
      - `content` (text, içerik)
      - `author` (text, yazar)
      - `category` (text, kategori)
      - `tags` (text[], etiketler)
      - `image_url` (text, görsel URL)
      - `featured` (boolean, öne çıkan)
      - `published` (boolean, yayınlanmış)
      - `read_time` (text, okuma süresi)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `blog_categories`
      - `id` (uuid, primary key)
      - `name` (text, kategori adı)
      - `slug` (text, URL dostu ad)
      - `description` (text, açıklama)
      - `icon` (text, ikon adı)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access
    - Add policies for authenticated admin access
*/

-- Blog kategorileri tablosu
CREATE TABLE IF NOT EXISTS blog_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  description text,
  icon text DEFAULT 'BookOpen',
  created_at timestamptz DEFAULT now()
);

-- Blog yazıları tablosu
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  excerpt text,
  content text NOT NULL,
  author text NOT NULL,
  category_id uuid REFERENCES blog_categories(id),
  tags text[] DEFAULT '{}',
  image_url text,
  featured boolean DEFAULT false,
  published boolean DEFAULT false,
  read_time text DEFAULT '5 dk',
  meta_title text,
  meta_description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- RLS etkinleştir
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Herkes okuyabilir politikaları
CREATE POLICY "Anyone can read published blog posts"
  ON blog_posts
  FOR SELECT
  TO anon, authenticated
  USING (published = true);

CREATE POLICY "Anyone can read blog categories"
  ON blog_categories
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Admin kullanıcıları için tam erişim (gelecekte kullanım için)
CREATE POLICY "Authenticated users can manage blog posts"
  ON blog_posts
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage categories"
  ON blog_categories
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- İndeksler
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON blog_posts(featured);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON blog_posts(created_at);
CREATE INDEX IF NOT EXISTS idx_blog_categories_slug ON blog_categories(slug);

-- Otomatik updated_at güncelleme fonksiyonu
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger oluştur
CREATE TRIGGER update_blog_posts_updated_at 
    BEFORE UPDATE ON blog_posts 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Örnek kategoriler ekle
INSERT INTO blog_categories (name, slug, description, icon) VALUES
  ('Finansman', 'finansman', 'Faizsiz finansman ve bankacılık konuları', 'TrendingUp'),
  ('Ev', 'ev', 'Ev satın alma ve emlak konuları', 'Home'),
  ('Araba', 'araba', 'Araba finansmanı ve otomotiv konuları', 'Car'),
  ('Bankacılık', 'bankacilik', 'Katılım bankacılığı ve İslami finans', 'Shield'),
  ('Planlama', 'planlama', 'Finansal planlama ve bütçe yönetimi', 'Calculator'),
  ('Yatırım', 'yatirim', 'Emlak yatırımı ve yatırım stratejileri', 'BarChart3')
ON CONFLICT (slug) DO NOTHING;