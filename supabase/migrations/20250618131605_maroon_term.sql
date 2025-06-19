/*
  # Ödeme Planları Tablosu

  1. New Tables
    - `payment_schedules`
      - `id` (uuid, primary key)
      - `calculation_id` (uuid, foreign key to calculations)
      - `month_number` (integer, ay numarası)
      - `payment_date` (date, ödeme tarihi)
      - `payment_amount` (decimal, ödeme tutarı)
      - `remaining_balance` (decimal, kalan bakiye)
      - `can_access_financing` (boolean, finansmana erişim durumu)
      - `status` (varchar, ödeme durumu)

  2. Security
    - Enable RLS on `payment_schedules` table
    - Add policy for public access
*/

CREATE TABLE IF NOT EXISTS payment_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  calculation_id uuid NOT NULL REFERENCES calculations(id) ON DELETE CASCADE,
  month_number integer NOT NULL CHECK (month_number > 0),
  payment_date date NOT NULL,
  payment_amount decimal NOT NULL CHECK (payment_amount >= 0),
  remaining_balance decimal NOT NULL CHECK (remaining_balance >= 0),
  can_access_financing boolean DEFAULT false,
  status varchar NOT NULL CHECK (status IN ('waiting', 'lucky', 'unlucky', 'accessible')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE payment_schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public access to payment schedules"
  ON payment_schedules
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- İndeksler
CREATE INDEX IF NOT EXISTS idx_payment_schedules_calculation_id ON payment_schedules(calculation_id);
CREATE INDEX IF NOT EXISTS idx_payment_schedules_month_number ON payment_schedules(month_number);
CREATE INDEX IF NOT EXISTS idx_payment_schedules_status ON payment_schedules(status);

-- Unique constraint
CREATE UNIQUE INDEX IF NOT EXISTS idx_payment_schedules_unique 
  ON payment_schedules(calculation_id, month_number);