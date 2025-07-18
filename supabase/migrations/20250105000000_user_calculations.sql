-- Kullanıcı hesaplamalarını kaydetmek için yeni tablo
CREATE TABLE IF NOT EXISTS user_calculations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    user_email TEXT,
    calculation_type TEXT NOT NULL CHECK (calculation_type IN ('ev', 'araba')),
    financing_type TEXT NOT NULL CHECK (financing_type IN ('cekilisli', 'cekilissiz')),
    financing_amount DECIMAL(15,2) NOT NULL,
    down_payment DECIMAL(15,2) DEFAULT 0,
    organization_fee_rate DECIMAL(5,2) NOT NULL,
    monthly_payment DECIMAL(15,2) NOT NULL,
    annual_increase_rate DECIMAL(5,2),
    total_payment DECIMAL(15,2) NOT NULL,
    installment_count INTEGER NOT NULL,
    organization_fee DECIMAL(15,2) NOT NULL,
    net_financing DECIMAL(15,2) NOT NULL,
    required_payment DECIMAL(15,2) NOT NULL,
    accessible_month INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Kullanıcı hesaplamalarının ödeme planlarını kaydetmek için tablo
CREATE TABLE IF NOT EXISTS user_payment_schedules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_calculation_id UUID REFERENCES user_calculations(id) ON DELETE CASCADE,
    month_number INTEGER NOT NULL,
    payment_date DATE NOT NULL,
    payment_amount DECIMAL(15,2) NOT NULL,
    remaining_balance DECIMAL(15,2) NOT NULL,
    can_access_financing BOOLEAN NOT NULL DEFAULT FALSE,
    status TEXT NOT NULL CHECK (status IN ('waiting', 'lucky', 'unlucky', 'accessible', 'financing_obtained')),
    cumulative_payment DECIMAL(15,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS (Row Level Security) policies
ALTER TABLE user_calculations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_payment_schedules ENABLE ROW LEVEL SECURITY;

-- Kullanıcılar sadece kendi hesaplamalarını görebilir
CREATE POLICY "Users can view own calculations" ON user_calculations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own calculations" ON user_calculations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own calculations" ON user_calculations
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own calculations" ON user_calculations
    FOR DELETE USING (auth.uid() = user_id);

-- Kullanıcılar sadece kendi ödeme planlarını görebilir
CREATE POLICY "Users can view own payment schedules" ON user_payment_schedules
    FOR SELECT USING (
        auth.uid() = (
            SELECT user_id 
            FROM user_calculations 
            WHERE id = user_payment_schedules.user_calculation_id
        )
    );

CREATE POLICY "Users can insert own payment schedules" ON user_payment_schedules
    FOR INSERT WITH CHECK (
        auth.uid() = (
            SELECT user_id 
            FROM user_calculations 
            WHERE id = user_payment_schedules.user_calculation_id
        )
    );

-- Indexes for better performance
CREATE INDEX idx_user_calculations_user_id ON user_calculations(user_id);
CREATE INDEX idx_user_calculations_created_at ON user_calculations(created_at);
CREATE INDEX idx_user_payment_schedules_calculation_id ON user_payment_schedules(user_calculation_id);
CREATE INDEX idx_user_payment_schedules_month_number ON user_payment_schedules(month_number);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_user_calculations_updated_at
    BEFORE UPDATE ON user_calculations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 