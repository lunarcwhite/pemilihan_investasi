-- Create Criterias Table
CREATE TABLE public.criterias (
    id VARCHAR(5) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    weight NUMERIC NOT NULL,
    type VARCHAR(10) NOT NULL CHECK (type IN ('cost', 'benefit'))
);

-- Create Alternatives Table
CREATE TABLE public.alternatives (
    id VARCHAR(5) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    tagline VARCHAR(200),
    description TEXT,
    legality_desc VARCHAR(200),
    legality_link VARCHAR(255)
);

-- Create Alternative Scores Table
CREATE TABLE public.alternative_scores (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    alternative_id VARCHAR(5) NOT NULL REFERENCES public.alternatives(id) ON DELETE CASCADE,
    criteria_id VARCHAR(5) NOT NULL REFERENCES public.criterias(id) ON DELETE CASCADE,
    score INTEGER NOT NULL CHECK (score >= 1 AND score <= 5),
    CONSTRAINT unique_alternative_criteria UNIQUE (alternative_id, criteria_id)
);

-- Seed Criterias
INSERT INTO public.criterias (id, name, weight, type) VALUES
('C1', 'Modal/Kapital', 1.0, 'cost'),
('C2', 'Horizon Investasi', 1.0, 'benefit'),
('C3', 'Toleransi Risiko', 1.0, 'cost'),
('C4', 'Likuiditas', 1.0, 'benefit');

-- Seed Alternatives
INSERT INTO public.alternatives (id, name, tagline, description, legality_desc, legality_link) VALUES
('A1', 'Deposito Bank', 'Simpanan bank aman berjangka', 'Pilihan investasi sangat aman yang dijamin oleh negara (LPS). Sangat cocok untuk mengamankan nilai modal jangka pendek.', 'Dijamin LPS (UU No. 24 Tahun 2004)', 'https://lps.go.id'),
('A2', 'Emas Fisik', 'Logam mulia lindung nilai', 'Investasi safe-haven tradisional yang sangat likuid. Nilainya cenderung naik dalam jangka panjang sebagai perlindungan inflasi.', 'Diawasi Bappebti & OJK', 'https://ojk.go.id'),
('A3', 'Reksadana Pasar Uang', 'Portofolio likuiditas tinggi', 'Investasi reksadana dengan risiko sangat rendah dan likuiditas harian. Modal awal sangat terjangkau.', 'Diawasi OJK (UU No. 8 Tahun 1995)', 'https://ojk.go.id'),
('A4', 'Reksadana Saham', 'Pertumbuhan agresif jangka panjang', 'Menginvestasikan mayoritas dana ke instrumen ekuitas/saham. Fluktuasi tinggi namun menawarkan potensi imbal hasil besar.', 'Diawasi OJK (UU No. 8 Tahun 1995)', 'https://ojk.go.id'),
('A5', 'Saham Blue Chip', 'Ekuitas perusahaan papan atas', 'Kepemilikan langsung pada perusahaan besar yang mapan dengan likuiditas saham harian sangat tinggi di Bursa Efek.', 'Diawasi OJK & BEI', 'https://www.idx.co.id'),
('A6', 'Obligasi Negara (SBN)', 'Surat berharga negara berkupon', 'Pemberian pinjaman dana ke pemerintah dengan imbalan kupon bunga tetap bulanan. Dijamin 100% aman oleh APBN negara.', 'Dijamin Kementerian Keuangan RI', 'https://www.djppr.kemenkeu.go.id');

-- Seed Alternative Scores
INSERT INTO public.alternative_scores (alternative_id, criteria_id, score) VALUES
('A1', 'C1', 2), ('A1', 'C2', 2), ('A1', 'C3', 1), ('A1', 'C4', 2),
('A2', 'C1', 1), ('A2', 'C2', 4), ('A2', 'C3', 2), ('A2', 'C4', 4),
('A3', 'C1', 1), ('A3', 'C2', 1), ('A3', 'C3', 1), ('A3', 'C4', 5),
('A4', 'C1', 1), ('A4', 'C2', 5), ('A4', 'C3', 5), ('A4', 'C4', 4),
('A5', 'C1', 2), ('A5', 'C2', 5), ('A5', 'C3', 5), ('A5', 'C4', 5),
('A6', 'C1', 3), ('A6', 'C2', 3), ('A6', 'C3', 1), ('A6', 'C4', 2);
