// Official school data — extracted from VICTORY VALUES.docx

export const schoolInfo = {
  name: 'Nyenga Victory High School',
  shortName: 'NVHS',
  location: 'Ssunga, Nyenga, Buikwe, Uganda',
  motto: 'Now or Never',
  tagline: 'Victory is not just a destination, but a journey of growth, learning and self-discovery',
  founded: '2024',
  address: 'Ssunga, Nyenga, Buikwe District, Uganda',
  phone: '+256 701 781 310',
  phone2: '+256 704 337 894',
  phone3: '+256 702 774 552',
  email: 'nyengavictoryhighschool24@gmail.com',
  admissionsEmail: 'nyengavictoryhighschool24@gmail.com',
  website: 'www.nyengavictoryhs.ac.ug',
  whatsapp: '256701781310',
};

export const schoolVision = `Building generations that diligently value new initiatives, innovations, suggestions, ideas and alternatives — especially if they can help realise and fulfil the school's vision, mission, aims, objectives and activities.

The school greatly believes in providing a well-rounded education that prepares students for the challenges and opportunities of a rapidly changing world.`;

export const schoolMission = `To produce responsible, disciplined, self-motivated and cultured members of the wide community.`;

export const schoolPhilosophy = `"Victory is not just a destination, but a journey of growth, learning and self-discovery."`;

export const schoolValues = [
  {
    title: 'Community & Inclusion',
    description: 'Nyenga Victory High School is a community school. We welcome all individuals of different religious sectors, celebrating diversity and ensuring every person feels at home.',
    icon: '🤝',
    color: 'from-sky-500 to-blue-600',
  },
  {
    title: 'Networking, Hard Work & Team Spirit',
    description: 'We believe in networking, hard work and team spirit as the main cores to success. Together we achieve more than we ever could alone.',
    icon: '💪',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    title: 'Excellence & Perfection',
    description: 'The school believes in and encourages hard work, perfection, excellence and servanthood for both staff and students — in every task and every endeavour.',
    icon: '🏆',
    color: 'from-amber-400 to-orange-500',
  },
  {
    title: 'Respect for Individual Differences',
    description: 'We respect and value individual differences as long as they are not detrimental to the realisation of our vision, mission, aims, objectives and activities.',
    icon: '🌍',
    color: 'from-violet-500 to-purple-600',
  },
  {
    title: 'Mutual Respect & Understanding',
    description: 'We encourage and promote mutual respect and understanding for everybody within the school premises — creating a safe, harmonious environment for all.',
    icon: '🕊️',
    color: 'from-cyan-500 to-teal-500',
  },
  {
    title: 'Integrity & Honesty',
    description: 'Integrity and honesty are greatly encouraged in all the dealings of the school — in academics, administration, and every interaction within our community.',
    icon: '⚖️',
    color: 'from-indigo-500 to-blue-700',
  },
];

export const coreValues = schoolValues.map((v, i) => ({
  letter: ['C', 'N', 'E', 'R', 'M', 'I'][i],
  word: v.title.split(' ')[0],
  description: v.description,
  icon: 'FaStar',
  color: v.color,
}));

export const schoolAims = [
  'To ensure and promote effective use of school resources without compromising better standards.',
  'To promote holistic development of learners by imparting in them good academics, social, economic and spiritual skills.',
  'To attract, motivate and retain outstanding staff for school administration and academic excellence.',
  'To mentor, discipline, equip, train and network the learners with an aim of promoting professional growth and development in their God-given callings.',
  'To be a model school in consistently developing generations that diligently fear God in all actions, words and thoughts.',
  'To ensure that the school is sensitive and adapts to external changes and is able to respond to them adequately and decisively.',
  'To ensure that the school meets and surpasses the expectations of its stakeholders by provision of outstanding qualitative services.',
];

export const schoolObjectives = [
  'Deliver measurable academic excellence through dedicated teaching staff and a rigorous, well-structured curriculum.',
  'Foster a disciplined, values-driven school culture where every student can discover and develop their God-given potential.',
  'Build a strong professional network connecting students, staff, alumni, and the wider community for mutual growth.',
  'Maintain outstanding school facilities and continuously upgrade resources to support modern, quality education.',
  'Develop students who are self-motivated, responsible, and prepared for the challenges of a rapidly changing world.',
  'Provide holistic education encompassing academics, sports, arts, spiritual development, and community service.',
  'Surpass stakeholder expectations through transparent administration and consistently outstanding service delivery.',
];

export const statistics = [
  { number: 500, label: 'Students Enrolled', suffix: '+' },
  { number: 99, label: 'Pass Rate', suffix: '%' },
  { number: 30, label: 'Teaching Staff', suffix: '+' },
  { number: 3, label: 'Religious Sectors Welcomed', suffix: '+' },
  { number: 10, label: 'Clubs & Societies', suffix: '+' },
  { number: 100, label: 'Alumni Network', suffix: '+' },
];

export const leadership = [
  {
    name: '[Headteacher Name]',
    role: 'Headteacher',
    image: '/images/staff/headteacher.jpg',
    message: `Welcome to Nyenga Victory High School — a place where the motto "Now or Never" is not just a phrase, but a way of life. We believe that every moment is an opportunity to grow, to learn, and to become the best version of yourself. Our school is a community built on hard work, integrity, teamwork, and excellence. We are committed to producing responsible, disciplined, self-motivated graduates who are ready to make a positive impact on the world. I warmly welcome you to our school family.`,
    qualifications: 'B.Ed, PGDE',
  },
  {
    name: '[Deputy Head — Academics]',
    role: 'Deputy Headteacher – Academics',
    image: '/images/staff/deputy-head.jpg',
    message: 'Our academic programme is designed to challenge every student, nurture their potential, and prepare them for success in examinations and in life.',
    qualifications: 'B.Ed (Science)',
  },
  {
    name: '[Deputy Head — Administration]',
    role: 'Deputy Headteacher – Administration',
    image: '/images/staff/deputy-admin.jpg',
    message: 'A well-organised, transparent school is a thriving school. We are dedicated to ensuring that every process runs smoothly in service of our students and community.',
    qualifications: 'B.A (Education)',
  },
];

export const departments = [
  {
    name: 'Sciences',
    subjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science'],
    color: 'from-blue-500 to-blue-700',
  },
  {
    name: 'Humanities & Social Sciences',
    subjects: ['English Language', 'Literature in English', 'History', 'Geography', 'Religious Education'],
    color: 'from-emerald-500 to-emerald-700',
  },
  {
    name: 'Languages',
    subjects: ['English Language', 'Luganda', 'French', 'Kiswahili'],
    color: 'from-yellow-500 to-yellow-700',
  },
  {
    name: 'Business & Commerce',
    subjects: ['Commerce', 'Entrepreneurship', 'Economics', 'Accounting'],
    color: 'from-purple-500 to-purple-700',
  },
  {
    name: 'Technical & Creative Arts',
    subjects: ['Technical Drawing', 'Fine Art & Design', 'Food & Nutrition', 'ICT'],
    color: 'from-red-500 to-red-700',
  },
  {
    name: 'Physical Education & Sports',
    subjects: ['Physical Education', 'Games & Sports', 'Health Education'],
    color: 'from-teal-500 to-teal-700',
  },
];

// Basketball, School Band, Environmental Club removed
export const clubs = [
  { name: 'Football', category: 'Sports' },
  { name: 'Netball', category: 'Sports' },
  { name: 'Athletics', category: 'Sports' },
  { name: 'Volleyball', category: 'Sports' },
  { name: 'Drama Club', category: 'Arts' },
  { name: 'Debate Club', category: 'Academic' },
  { name: 'Science Club', category: 'Academic' },
  { name: 'ICT Club', category: 'Academic' },
  { name: 'Scripture Union', category: 'Spiritual' },
  { name: 'Student Leadership', category: 'Leadership' },
];

// Admission guidelines — no online application form
export const admissionSteps = [
  {
    step: 1,
    title: 'Pick Up Application Form',
    description: 'Visit the school office at Ssunga, Nyenga, Buikwe District to collect the official admission form. Forms can also be requested by calling our admissions line.',
  },
  {
    step: 2,
    title: 'Fill in the Form Accurately',
    description: 'Complete all sections of the admission form clearly and accurately. Ensure the student\'s name matches exactly as it appears on official documents.',
  },
  {
    step: 3,
    title: 'Gather Required Documents',
    description: 'Prepare all necessary supporting documents including PLE results, birth certificate, passport photos, and previous school reports.',
  },
  {
    step: 4,
    title: 'Submit to the School Office',
    description: 'Bring the completed form and all supporting documents to the school office at Ssunga, Nyenga. Our admissions team will review your application.',
  },
  {
    step: 5,
    title: 'Entrance Assessment',
    description: 'Applicants sit a short entrance assessment in English, Mathematics, and Science to help the school place students appropriately.',
  },
  {
    step: 6,
    title: 'Receive Offer & Report',
    description: 'Successful applicants receive an admission offer letter. Pay the required fees to confirm the place and attend the scheduled orientation day before term begins.',
  },
];

export const faqs = [
  {
    question: 'What type of school is Nyenga Victory High School?',
    answer: 'Nyenga Victory High School is a community school located in Ssunga, Nyenga, Buikwe District, Uganda. We welcome students of all religious backgrounds and believe in an inclusive, diverse school community.',
  },
  {
    question: 'What classes does Nyenga Victory High School offer?',
    answer: 'We offer classes from Senior One (S1) to Senior Six (S6), covering both Ordinary Level (O-Level) and Advanced Level (A-Level) programmes under the Uganda National Curriculum.',
  },
  {
    question: 'What is the school motto?',
    answer: '"Now or Never" — a powerful call to action reminding every student that there is no better time than today to work hard, grow, and seize every opportunity.',
  },
  {
    question: 'What are the admission requirements?',
    answer: 'For S1 entry, students must have completed Primary Seven (P7) and present their PLE results slip. We also require a birth certificate, passport photos, and previous school report. An entrance assessment is conducted.',
  },
  {
    question: 'Where do I get an admission form?',
    answer: 'Admission forms are available at the school office at Ssunga, Nyenga, Buikwe District. You can also call +256 701 781 310 or +256 704 337 894 to enquire.',
  },
  {
    question: 'How do I contact the school?',
    answer: 'You can reach us on +256 701 781 310, +256 704 337 894, or +256 702 774 552. You can also email us at nyengavictoryhighschool24@gmail.com.',
  },
  {
    question: 'Does the school welcome students from all religions?',
    answer: 'Yes. Nyenga Victory High School is a community school that warmly welcomes individuals from all religious backgrounds, while upholding a strong culture of mutual respect and God-fearing values.',
  },
  {
    question: 'Is there a boarding option?',
    answer: 'Please contact the school office directly for information about boarding arrangements and availability.',
  },
];

export const testimonials = [
  {
    name: 'Sarah Nakamya',
    role: 'Former Student',
    text: 'The motto "Now or Never" changed my mindset completely. I stopped procrastinating and started working hard every single day. The teachers here genuinely care about your success.',
    avatar: '/images/testimonials/student1.jpg',
    rating: 5,
  },
  {
    name: 'Mr. Robert Ssekandi',
    role: 'Parent',
    text: 'I love that this school is a community school — it is truly open to everyone. The values they teach, especially integrity and hard work, have transformed my child.',
    avatar: '/images/testimonials/parent1.jpg',
    rating: 5,
  },
  {
    name: 'James Mugisha',
    role: 'Former Student',
    text: 'Nyenga Victory taught me that victory is not a destination — it is a journey. The teamwork and networking culture here prepared me for the real world better than I expected.',
    avatar: '/images/testimonials/student2.jpg',
    rating: 5,
  },
  {
    name: 'Ms. Agnes Nantale',
    role: 'Parent',
    text: 'A school that respects individual differences and promotes mutual understanding is exactly what Uganda needs. My daughter has grown academically, spiritually, and socially.',
    avatar: '/images/testimonials/parent2.jpg',
    rating: 5,
  },
  {
    name: 'David Ochieng',
    role: 'Former Student',
    text: 'The school philosophy — "Victory is a journey, not a destination" — resonates with me every day. NVHS equipped me with skills, values, and confidence I carry everywhere.',
    avatar: '/images/testimonials/student3.jpg',
    rating: 5,
  },
];

export const latestNews = [
  {
    id: 1,
    title: 'NVHS Students Achieve Outstanding Examination Results',
    excerpt: 'We are proud to announce excellent results in the national examinations, reflecting the hard work, teamwork and determination that define the NVHS spirit.',
    date: '2025-01-15',
    category: 'Achievements',
    image: '/images/news/news1.jpg',
    slug: 'exam-results-2024',
  },
  {
    id: 2,
    title: 'New Science Laboratory Commissioned at NVHS',
    excerpt: 'A new, fully equipped science laboratory has been officially commissioned, further enhancing our capacity for practical, hands-on learning in line with our mission of holistic education.',
    date: '2025-02-10',
    category: 'News',
    image: '/images/news/news2.jpg',
    slug: 'new-science-lab',
  },
  {
    id: 3,
    title: 'Annual Sports Day 2025 — Team Spirit in Full Display',
    excerpt: 'Our annual sports day was a spectacular demonstration of the teamwork and hard work that Nyenga Victory High School champions. Congratulations to all participants.',
    date: '2025-03-05',
    category: 'Sports',
    image: '/images/news/news3.jpg',
    slug: 'sports-day-2025',
  },
  {
    id: 4,
    title: 'Drama Club Wins Regional Festival Award',
    excerpt: 'Our talented Drama Club brought home top honours at the regional schools drama festival, showcasing excellence, creativity and confidence — the hallmarks of an NVHS student.',
    date: '2025-03-20',
    category: 'Arts',
    image: '/images/news/news4.jpg',
    slug: 'drama-award-2025',
  },
  {
    id: 5,
    title: 'Career Guidance Day Inspires S6 Students',
    excerpt: 'Professionals, university lecturers and NVHS alumni gathered to inspire our S6 students, reminding them that the motto "Now or Never" applies most powerfully at this stage of their lives.',
    date: '2025-04-08',
    category: 'Events',
    image: '/images/news/news5.jpg',
    slug: 'career-day-2025',
  },
  {
    id: 6,
    title: 'Scripture Union Leads Community Outreach in Ssunga',
    excerpt: 'Our Scripture Union students organised a community outreach programme in Ssunga village, demonstrating the servant-hood and community values at the heart of NVHS.',
    date: '2025-04-22',
    category: 'Community',
    image: '/images/news/news6.jpg',
    slug: 'su-outreach-2025',
  },
];

export const upcomingEvents = [
  {
    id: 1,
    title: 'Term 2 Begins',
    date: '2025-06-02',
    type: 'Academic',
    description: 'Students report for the second term of the 2025 academic year. All students to report by 7:00 AM.',
  },
  {
    id: 2,
    title: "Parents' Day — S4 & S6",
    date: '2025-06-28',
    type: 'Parents',
    description: 'Parents and guardians of S4 and S6 students are invited for academic progress review meetings with class teachers.',
  },
  {
    id: 3,
    title: 'Inter-School Debate Championship',
    date: '2025-07-12',
    type: 'Academic',
    description: 'NVHS hosts the regional inter-school debate championship. Come and cheer our team!',
  },
  {
    id: 4,
    title: 'Music, Dance & Drama Festival',
    date: '2025-07-25',
    type: 'Arts',
    description: 'Annual MDD festival showcasing the incredible artistic talents of our students. All are welcome.',
  },
  {
    id: 5,
    title: 'End of Term 2 Examinations',
    date: '2025-08-11',
    type: 'Academic',
    description: 'End-of-term examinations begin for all classes. Students to adhere to the examination timetable.',
  },
];

export const galleryCategories = [
  'All', 'Campus', 'Classrooms', 'Laboratories', 'Library', 'Sports',
  'Events', 'Students', 'Achievements',
];

export const galleryImages = Array.from({ length: 24 }, (_, i) => ({
  id: i + 1,
  src: `/images/gallery/img${i + 1}.jpg`,
  thumb: `/images/gallery/thumb${i + 1}.jpg`,
  title: `School Photo ${i + 1}`,
  category: galleryCategories[Math.floor(Math.random() * (galleryCategories.length - 1)) + 1],
}));

export const socialLinks = {
  facebook: 'https://facebook.com/nyengavictoryhs',
  twitter: 'https://twitter.com/nyengavictoryhs',
  instagram: 'https://instagram.com/nyengavictoryhs',
  youtube: 'https://youtube.com/nyengavictoryhs',
  whatsapp: 'https://wa.me/256701781310',
};

export const downloads = [
  { name: 'Admission Form 2025', file: '/downloads/admission-form-2025.pdf', category: 'Admissions', size: '245 KB' },
  { name: 'School Prospectus', file: '/downloads/prospectus.pdf', category: 'General', size: '1.2 MB' },
  { name: 'School Rules & Regulations', file: '/downloads/school-rules.pdf', category: 'General', size: '380 KB' },
  { name: 'Term Dates 2025', file: '/downloads/term-dates-2025.pdf', category: 'Academic', size: '120 KB' },
  { name: 'S1 Holiday Work – Term 1', file: '/downloads/s1-holiday-work-t1.pdf', category: 'Academics', size: '560 KB' },
  { name: 'S3 Past Papers – Mathematics', file: '/downloads/s3-math-past-papers.pdf', category: 'Past Papers', size: '890 KB' },
  { name: 'S4 Past Papers – English', file: '/downloads/s4-english-past-papers.pdf', category: 'Past Papers', size: '720 KB' },
  { name: 'School Circular – Term 2 2025', file: '/downloads/circular-t2-2025.pdf', category: 'Circulars', size: '210 KB' },
];
