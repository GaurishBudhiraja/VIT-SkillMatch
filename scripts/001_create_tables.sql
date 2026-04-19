-- VIT SkillMatch Database Schema

-- 1. Create profiles table (references auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'employer', 'admin')),
  full_name TEXT,
  email TEXT,
  avatar_url TEXT,
  phone VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- 2. Create students table
CREATE TABLE IF NOT EXISTS public.students (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  department VARCHAR(100) NOT NULL,
  current_semester INT NOT NULL,
  cgpa DECIMAL(3,2) NOT NULL DEFAULT 0,
  skills TEXT[], -- Array of skills
  resume_url TEXT,
  bio TEXT,
  batch_year INT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(id)
);

ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "students_select_own" ON public.students FOR SELECT USING (auth.uid() = id OR auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'));
CREATE POLICY "students_insert_own" ON public.students FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "students_update_own" ON public.students FOR UPDATE USING (auth.uid() = id);

-- 3. Create companies table
CREATE TABLE IF NOT EXISTS public.companies (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  company_name VARCHAR(255) NOT NULL,
  company_email VARCHAR(255) NOT NULL UNIQUE,
  website_url TEXT,
  description TEXT,
  industry VARCHAR(100),
  location VARCHAR(255),
  company_size VARCHAR(50),
  logo_url TEXT,
  verified BOOLEAN DEFAULT FALSE,
  approval_status VARCHAR(20) DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(id)
);

ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "companies_select_all" ON public.companies FOR SELECT USING (approval_status = 'approved' OR auth.uid() = id);
CREATE POLICY "companies_insert_own" ON public.companies FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "companies_update_own" ON public.companies FOR UPDATE USING (auth.uid() = id);

-- 4. Create internship_positions table
CREATE TABLE IF NOT EXISTS public.internship_positions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  required_skills TEXT[], -- Array of required skills
  min_cgpa DECIMAL(3,2) DEFAULT 0,
  allowed_departments TEXT[], -- Array of allowed departments
  location VARCHAR(255),
  duration_weeks INT,
  stipend_amount DECIMAL(10,2),
  opening_count INT DEFAULT 1,
  filled_count INT DEFAULT 0,
  application_deadline DATE,
  status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'closed', 'filled')),
  posted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.internship_positions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "internship_positions_select_all" ON public.internship_positions FOR SELECT USING (status != 'closed');
CREATE POLICY "internship_positions_insert_own_company" ON public.internship_positions FOR INSERT WITH CHECK (company_id IN (SELECT id FROM public.companies WHERE id = auth.uid()));
CREATE POLICY "internship_positions_update_own_company" ON public.internship_positions FOR UPDATE USING (company_id IN (SELECT id FROM public.companies WHERE id = auth.uid()));

-- 5. Create applications table
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  internship_id UUID NOT NULL REFERENCES public.internship_positions(id) ON DELETE CASCADE,
  cover_letter TEXT,
  application_status VARCHAR(20) DEFAULT 'pending' CHECK (application_status IN ('pending', 'reviewing', 'shortlisted', 'rejected', 'accepted')),
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(student_id, internship_id)
);

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "applications_select_own" ON public.applications FOR SELECT USING (student_id = auth.uid() OR internship_id IN (SELECT id FROM public.internship_positions WHERE company_id = auth.uid()));
CREATE POLICY "applications_insert_own" ON public.applications FOR INSERT WITH CHECK (student_id = auth.uid());
CREATE POLICY "applications_update_company" ON public.applications FOR UPDATE USING (internship_id IN (SELECT id FROM public.internship_positions WHERE company_id = auth.uid()));

-- 6. Create saved_internships table
CREATE TABLE IF NOT EXISTS public.saved_internships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  internship_id UUID NOT NULL REFERENCES public.internship_positions(id) ON DELETE CASCADE,
  saved_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(student_id, internship_id)
);

ALTER TABLE public.saved_internships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "saved_internships_select_own" ON public.saved_internships FOR SELECT USING (student_id = auth.uid());
CREATE POLICY "saved_internships_insert_own" ON public.saved_internships FOR INSERT WITH CHECK (student_id = auth.uid());
CREATE POLICY "saved_internships_delete_own" ON public.saved_internships FOR DELETE USING (student_id = auth.uid());

-- 7. Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject VARCHAR(255),
  content TEXT NOT NULL,
  read_status BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "messages_select_own" ON public.messages FOR SELECT USING (sender_id = auth.uid() OR receiver_id = auth.uid());
CREATE POLICY "messages_insert_own" ON public.messages FOR INSERT WITH CHECK (sender_id = auth.uid());

-- 8. Create admin_approvals table
CREATE TABLE IF NOT EXISTS public.admin_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  reviewed_by UUID REFERENCES auth.users(id),
  approval_status VARCHAR(20) NOT NULL CHECK (approval_status IN ('approved', 'rejected')),
  rejection_reason TEXT,
  reviewed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.admin_approvals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_approvals_select_admin" ON public.admin_approvals FOR SELECT USING (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'));
CREATE POLICY "admin_approvals_insert_admin" ON public.admin_approvals FOR INSERT WITH CHECK (auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_students_department ON public.students(department);
CREATE INDEX IF NOT EXISTS idx_students_cgpa ON public.students(cgpa);
CREATE INDEX IF NOT EXISTS idx_internship_company_id ON public.internship_positions(company_id);
CREATE INDEX IF NOT EXISTS idx_internship_status ON public.internship_positions(status);
CREATE INDEX IF NOT EXISTS idx_applications_student_id ON public.applications(student_id);
CREATE INDEX IF NOT EXISTS idx_applications_internship_id ON public.applications(internship_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications(application_status);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON public.messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_companies_status ON public.companies(approval_status);
