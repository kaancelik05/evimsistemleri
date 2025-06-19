/*
  # Finansman Hesaplamaları Tablosu

  1. New Tables
    - `calculations`
      - `id` (uuid, primary key)
      - `user_session` (varchar, kullanıcı oturumu)
      - `calculation_type` (varchar, 'ev' veya 'araba')
      - `financing_type` (varchar, 'cekilisli' veya 'cekilissiz')
      - `financing_amount` (decimal, finansman tutarı)
      - `down_payment` (decimal, peşinat tutarı)
      - `organization_fee_rate` (decimal, organizasyon ücreti oranı)
      - `monthly_payment` (decimal, aylık taksit tutarı)
      - `total_installments` (integer, toplam taksit sayısı)
      - `created_at` (timestamp, oluşturulma tarihi)

  2. Security
    - Enable RLS on `calculations` table
    - Add policy for public access (session-based)
*/

CREATE TABLE IF NOT EXISTS calculations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_session varchar,
  calculation_type varchar NOT NULL CHECK (calculation_type IN ('ev', 'araba')),
  financing_type varchar NOT NULL CHECK (financing_type IN ('cekilisli', 'cekilissiz')),
  financing_amount decimal NOT NULL CHECK (financing_amount >= 50000 AND financing_amount <= 5000000),
  down_payment decimal DEFAULT 0 CHECK (down_payment >= 0),
  organization_fee_rate decimal NOT NULL CHECK (organization_fee_rate >= 5 AND organization_fee_rate <= 10),
  monthly_payment decimal NOT NULL CHECK (monthly_payment >= 1000),
  total_installments integer NOT NULL CHECK (total_installments > 0),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE calculations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public access to calculations"
  ON calculations
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- İndeksler
CREATE INDEX IF NOT EXISTS idx_calculations_user_session ON calculations(user_session);
CREATE INDEX IF NOT EXISTS idx_calculations_type ON calculations(calculation_type);
CREATE INDEX IF NOT EXISTS idx_calculations_created_at ON calculations(created_at);