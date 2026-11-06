import { PrismaClient, UserRole, ProjectCategory, ProjectStatus, ApplicationStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Senabil Community Impact Platform database...');

  // Clean existing data
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.application.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  const volunteerPasswordHash = await bcrypt.hash('volunteer123', 10);
  const beneficiaryPasswordHash = await bcrypt.hash('beneficiary123', 10);

  // 1. Create Admin User
  const admin = await prisma.user.create({
    data: {
      email: 'admin@senabil.org',
      passwordHash: adminPasswordHash,
      firstName: 'Senabil',
      lastName: 'Administrator',
      phone: '+970 59 900 0001',
      governorate: 'Gaza',
      address: 'Al-Rimal, Gaza City',
      bio: 'Executive Director of Humanitarian Aid Operations at Senabil Community Impact Platform.',
      role: UserRole.ADMIN,
      birthDate: new Date('1985-05-15'),
    },
  });

  // 2. Create Volunteers
  const volunteer1 = await prisma.user.create({
    data: {
      email: 'tariq.volunteer@senabil.org',
      passwordHash: volunteerPasswordHash,
      firstName: 'Tariq',
      lastName: 'Al-Masri',
      phone: '+970 59 912 3456',
      governorate: 'Gaza',
      address: 'Tal Al-Hawa, Gaza City',
      bio: 'Certified STEM educator and volunteer coordinator with 6 years experience in displaced camp schooling.',
      role: UserRole.VOLUNTEER,
      birthDate: new Date('1994-03-20'),
    },
  });

  const volunteer2 = await prisma.user.create({
    data: {
      email: 'nour.volunteer@senabil.org',
      passwordHash: volunteerPasswordHash,
      firstName: 'Nour',
      lastName: 'Hassan',
      phone: '+970 59 923 4567',
      governorate: 'Khan Younis',
      address: 'Al-Amal Neighborhood, Khan Younis',
      bio: 'Software Engineer passionate about teaching coding and digital skills to youth in temporary learning shelters.',
      role: UserRole.VOLUNTEER,
      birthDate: new Date('1997-08-11'),
    },
  });

  const volunteer3 = await prisma.user.create({
    data: {
      email: 'yousef.volunteer@senabil.org',
      passwordHash: volunteerPasswordHash,
      firstName: 'Yousef',
      lastName: 'Najar',
      phone: '+970 59 934 5678',
      governorate: 'Rafah',
      address: 'Al-Shaboura, Rafah',
      bio: 'Logistics officer and field volunteer assisting with emergency water trucking and food pack offloading.',
      role: UserRole.VOLUNTEER,
      birthDate: new Date('1992-11-05'),
    },
  });

  // 3. Create Beneficiaries
  const beneficiary1 = await prisma.user.create({
    data: {
      email: 'ahmed.beneficiary@gmail.com',
      passwordHash: beneficiaryPasswordHash,
      firstName: 'Ahmed',
      lastName: 'Radi',
      phone: '+970 59 876 5432',
      governorate: 'Deir al-Balah',
      address: 'Al-Bassa Displaced Camp, Deir al-Balah',
      bio: 'Head of a family of 7 displaced from Beit Hanoun. Currently residing in temporary shelter.',
      role: UserRole.BENEFICIARY,
      birthDate: new Date('1980-04-12'),
    },
  });

  const beneficiary2 = await prisma.user.create({
    data: {
      email: 'fatima.beneficiary@gmail.com',
      passwordHash: beneficiaryPasswordHash,
      firstName: 'Fatima',
      lastName: 'Al-Najjar',
      phone: '+970 59 865 4321',
      governorate: 'North Gaza',
      address: 'Jabalia Camp, Block 4',
      bio: 'Mother caring for four orphaned children following the loss of our primary breadwinner.',
      role: UserRole.BENEFICIARY,
      birthDate: new Date('1988-09-24'),
    },
  });

  const beneficiary3 = await prisma.user.create({
    data: {
      email: 'khaled.beneficiary@gmail.com',
      passwordHash: beneficiaryPasswordHash,
      firstName: 'Khaled',
      lastName: 'Qudaih',
      phone: '+970 59 854 3210',
      governorate: 'Khan Younis',
      address: 'Al-Mawasi Coastal Area, Khan Younis',
      bio: 'Displaced craftsman seeking economic revitalization support to restart a small carpentry repairs workshop.',
      role: UserRole.BENEFICIARY,
      birthDate: new Date('1976-01-30'),
    },
  });

  // 4. Create Projects
  const projectsData = [
    {
      title: 'Emergency Nutritional Baskets for Displaced Families',
      slug: 'emergency-nutritional-baskets-displaced-families',
      category: ProjectCategory.FOOD,
      status: ProjectStatus.RUNNING,
      shortDescription: 'Distributing monthly essential dry food and protein rations to vulnerable families across middle governorates.',
      description: 'The Food Security Unit at Senabil provides vital nutritional packages containing flour, rice, pulses, cooking oil, canned proteins, and infant nutritional supplements to displaced families sheltering in informal camp settlements. Priority is given to female-headed households, families with elderly members, and children under five.',
      objectives: '1. Alleviate acute food shortages in informal shelters.\n2. Prevent severe child malnutrition through targeted protein packs.\n3. Ensure dignified distribution with biometric cardless verification.',
      eligibility: 'Displaced families residing in Deir al-Balah and Khan Younis camps with no regular breadwinner.',
      requirements: 'Valid proof of displacement or local camp committee registration; ID number of family head.',
      imageUrl: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=80',
      targetBeneficiaries: 1200,
      targetVolunteers: 35,
      startDate: new Date('2026-01-10'),
      endDate: new Date('2026-12-31'),
    },
    {
      title: 'Solar-Powered Potable Water Well Rehabilitation',
      slug: 'solar-powered-water-well-rehabilitation',
      category: ProjectCategory.WATER,
      status: ProjectStatus.RUNNING,
      shortDescription: 'Restoring community groundwater wells and installing off-grid solar desalinators to supply clean drinking water.',
      description: 'Clean drinking water is scarce across Gaza. This engineering initiative installs high-yield solar inverters and reverse osmosis desalination units on community municipal wells, delivering up to 40,000 liters of safe, potable drinking water daily directly to surrounding neighborhood distribution points.',
      objectives: '1. Restore reliable power to 6 municipal groundwater wells using solar arrays.\n2. Eliminate waterborne diseases through UV and RO filtration.\n3. Establish neighborhood water filling stations free of charge.',
      eligibility: 'All residents and displaced shelters within 2 km of well stations.',
      requirements: 'Volunteers with civil, electrical, or plumbing engineering skills; field organizers.',
      imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=1200&q=80',
      targetBeneficiaries: 8500,
      targetVolunteers: 20,
      startDate: new Date('2026-02-01'),
      endDate: new Date('2026-11-30'),
    },
    {
      title: 'Safe Learning Spaces & Emergency Digital Tutoring',
      slug: 'safe-learning-spaces-emergency-tutoring',
      category: ProjectCategory.EDUCATION,
      status: ProjectStatus.RUNNING,
      shortDescription: 'Constructing temporary classroom tents and mobilizing volunteer educators to help children resume schooling.',
      description: 'Thousands of children have faced disruptions to formal schooling. Senabil operates 12 weatherproof learning tents equipped with whiteboards, battery-backed lighting, and portable digital tablets. Volunteer educators conduct literacy, numeracy, and psychosocial activities to restore hope and academic continuity.',
      objectives: '1. Provide uninterrupted basic schooling for 1,500 displaced primary school students.\n2. Offer specialized remedial learning for Arabic reading and arithmetic.\n3. Train volunteer teachers on trauma-informed education techniques.',
      eligibility: 'Children aged 6-14 in tent encampments; volunteer educators and university graduates.',
      requirements: 'Volunteers must commit to at least 6 hours weekly.',
      imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80',
      targetBeneficiaries: 1500,
      targetVolunteers: 50,
      startDate: new Date('2026-03-01'),
      endDate: new Date('2026-12-15'),
    },
    {
      title: 'Winterized Emergency Tent Insulation & Heavy Blankets',
      slug: 'winterized-tent-insulation-heavy-blankets',
      category: ProjectCategory.CLOTHING,
      status: ProjectStatus.PAUSED,
      shortDescription: 'Reinforcing tent floors with wooden thermal pallets and distributing high-density thermal blankets.',
      description: 'Winter storms and torrential rains bring severe dampness and flooding to coastal displacement sites. This winterization campaign distributes heavy thermal blankets, rainproof tarpaulins, elevated wooden flooring pallets, and warm winter clothing sets for infants and children.',
      objectives: '1. Protect 900 vulnerable family tents from ground rainwater seepage.\n2. Distribute 3,000 thermal wool blankets and children jackets.\n3. Provide emergency repair kits for damaged tent canvas.',
      eligibility: 'Families residing in coastal sand areas with high flood vulnerability.',
      requirements: 'Camp verification slip.',
      imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80',
      targetBeneficiaries: 900,
      targetVolunteers: 25,
      startDate: new Date('2025-11-01'),
      endDate: new Date('2026-02-28'),
    },
    {
      title: 'Mobile Primary Healthcare & Chronic Disease Clinics',
      slug: 'mobile-primary-healthcare-clinics',
      category: ProjectCategory.HEALTH,
      status: ProjectStatus.RUNNING,
      shortDescription: 'Deploying doctor-led mobile medical vans for triage, maternal checkups, and diabetes/hypertension medications.',
      description: 'With hospitals operating under immense strain, Senabil mobile medical units travel to remote camp clusters to provide on-site diagnostics, antibiotic supplies, pediatrics consultations, wound dressings, and free maintenance prescriptions for chronic hypertension and diabetes patients.',
      objectives: '1. Conduct 500 mobile clinic visits across isolated camp communities.\n2. Dispense free continuous 60-day supply of essential chronic disease meds.\n3. Screen children and pregnant women for anemia and dehydration.',
      eligibility: 'Displaced community members needing primary medical attention.',
      requirements: 'Medical, nursing, or pharmaceutical background for volunteers.',
      imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80',
      targetBeneficiaries: 4000,
      targetVolunteers: 30,
      startDate: new Date('2026-01-15'),
      endDate: new Date('2026-12-31'),
    },
    {
      title: 'Comprehensive Orphan Sponsorship & Mental Health Care',
      slug: 'orphan-sponsorship-mental-health-care',
      category: ProjectCategory.ORPHAN_SUPPORT,
      status: ProjectStatus.RUNNING,
      shortDescription: 'Direct monthly living allowances paired with specialized child trauma recovery counseling.',
      description: 'Dedicated support program for children who have lost one or both parents. Each sponsored orphan receives an unconditional monthly living stipend for clothing and education, coupled with weekly expressive arts therapy sessions supervised by certified mental health professionals.',
      objectives: '1. Provide reliable financial stability for 600 orphan households.\n2. Deliver trauma-informed child psychology sessions.\n3. Sponsor school bags and seasonal clothing.',
      eligibility: 'Children under 18 who have lost breadwinner parents.',
      requirements: 'Death certificate of parent; guardianship documentation.',
      imageUrl: 'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?auto=format&fit=crop&w=1200&q=80',
      targetBeneficiaries: 600,
      targetVolunteers: 15,
      startDate: new Date('2026-01-01'),
      endDate: new Date('2027-01-01'),
    },
    {
      title: 'Youth Digital Freelancing & Remote Work Bootcamp',
      slug: 'youth-digital-freelancing-bootcamp',
      category: ProjectCategory.TRAINING,
      status: ProjectStatus.RUNNING,
      shortDescription: 'Intensive 8-week virtual bootcamp teaching web development, translation, and UI design to earn online income.',
      description: 'Empowering unemployed university graduates in Gaza to overcome geographical blockades through the global digital economy. Trainees receive mentorship from senior remote engineers, laptop access in powered tech hubs, and guidance on landing international freelance contracts.',
      objectives: '1. Upskill 120 young graduates in modern software development and digital design.\n2. Provide reliable internet and solar electricity co-working workspace.\n3. Achieve 70% freelance contract conversion rate within 90 days.',
      eligibility: 'University graduates in IT, English, or Multimedia residing in Gaza.',
      requirements: 'Basic proficiency in English and commitment to 20 hours weekly.',
      imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
      targetBeneficiaries: 120,
      targetVolunteers: 10,
      startDate: new Date('2026-04-01'),
      endDate: new Date('2026-08-30'),
    },
    {
      title: 'Micro-Grant Support for Small Local Home Businesses',
      slug: 'micro-grant-support-small-businesses',
      category: ProjectCategory.ECONOMIC_SUPPORT,
      status: ProjectStatus.COMPLETED,
      shortDescription: 'Provided seed capital and equipment grants for small home bakeries, tailoring, and electrical repairs.',
      description: 'Phase 1 of our economic revitalization initiative successfully disbursed 80 seed capital micro-grants of $600 each to restore home baking, solar battery repairs, and clothing alterations businesses across Central Gaza.',
      objectives: '1. Re-establish sustainable home livelihoods.\n2. Stimulate local camp micro-economies.\n3. Encourage women entrepreneurs.',
      eligibility: 'Small business owners with destroyed workshops.',
      requirements: 'Feasibility proposal and technical skills assessment.',
      imageUrl: 'https://images.unsplash.com/photo-1556742049-0a67e557224f?auto=format&fit=crop&w=1200&q=80',
      targetBeneficiaries: 80,
      targetVolunteers: 8,
      startDate: new Date('2025-06-01'),
      endDate: new Date('2025-12-31'),
    },
  ];

  const createdProjects = [];
  for (const p of projectsData) {
    const project = await prisma.project.create({
      data: {
        ...p,
        createdById: admin.id,
      },
    });
    createdProjects.push(project);
  }

  // 5. Create Applications
  // Ahmed applied to Food Support (Approved)
  await prisma.application.create({
    data: {
      userId: beneficiary1.id,
      projectId: createdProjects[0].id,
      motivation: 'We are a family of seven displaced from Beit Hanoun. We have no steady income or access to food markets in our current location in Deir al-Balah.',
      notes: 'Have two children under age 4 with special dietary needs.',
      status: ApplicationStatus.APPROVED,
      reviewedBy: admin.id,
      reviewedAt: new Date('2026-01-20'),
      adminNotes: 'Verified displacement status through local camp committee. Enrolled for monthly dry food parcel.',
    },
  });

  // Fatima applied to Orphan Support (Approved)
  await prisma.application.create({
    data: {
      userId: beneficiary2.id,
      projectId: createdProjects[5].id,
      motivation: 'I am taking care of my four grandchildren who lost both parents. We need urgent support to provide food and schooling materials.',
      notes: 'All documents and guardianship papers are available.',
      status: ApplicationStatus.APPROVED,
      reviewedBy: admin.id,
      reviewedAt: new Date('2026-01-18'),
      adminNotes: 'Documentation verified. Monthly living stipend approved and referred to trauma counseling.',
    },
  });

  // Khaled applied to Youth Digital/Economic Support (Pending review)
  await prisma.application.create({
    data: {
      userId: beneficiary3.id,
      projectId: createdProjects[2].id,
      motivation: 'My teenage children need to continue their education. They have been out of school for over a year.',
      status: ApplicationStatus.PENDING,
    },
  });

  // Tariq (Volunteer) applied to Safe Learning Spaces (Approved)
  await prisma.application.create({
    data: {
      userId: volunteer1.id,
      projectId: createdProjects[2].id,
      motivation: 'I have 6 years experience teaching science and math. I want to organize daily math circles for displaced students.',
      notes: 'Available every morning from 8:00 AM to 1:00 PM.',
      status: ApplicationStatus.APPROVED,
      reviewedBy: admin.id,
      reviewedAt: new Date('2026-02-15'),
      adminNotes: 'Qualified educator. Assigned to Classroom Tent 3 in Deir al-Balah.',
    },
  });

  // Nour (Volunteer) applied to Youth Digital Bootcamp (Approved)
  await prisma.application.create({
    data: {
      userId: volunteer2.id,
      projectId: createdProjects[6].id,
      motivation: 'As a full stack engineer, I can lead the React and TypeScript workshops and mentor youth in finding online jobs.',
      status: ApplicationStatus.APPROVED,
      reviewedBy: admin.id,
      reviewedAt: new Date('2026-03-05'),
      adminNotes: 'Accepted as lead technical mentor for web development track.',
    },
  });

  // Yousef (Volunteer) applied to Water Well Rehabilitation (Approved)
  await prisma.application.create({
    data: {
      userId: volunteer3.id,
      projectId: createdProjects[1].id,
      motivation: 'I have practical plumbing and generator maintenance experience. Ready to assist with pump installation.',
      status: ApplicationStatus.APPROVED,
      reviewedBy: admin.id,
      reviewedAt: new Date('2026-02-10'),
      adminNotes: 'Experienced field worker. Joined mechanical installation team.',
    },
  });

  // 6. Create Notifications
  await prisma.notification.create({
    data: {
      userId: beneficiary1.id,
      title: 'Application Approved! 🎉',
      message: 'Your application for "Emergency Nutritional Baskets for Displaced Families" was approved. Collection details have been dispatched.',
      isRead: true,
    },
  });

  await prisma.notification.create({
    data: {
      userId: beneficiary2.id,
      title: 'Application Approved! 🎉',
      message: 'Your application for "Comprehensive Orphan Sponsorship & Mental Health Care" has been approved.',
      isRead: false,
    },
  });

  await prisma.notification.create({
    data: {
      userId: volunteer1.id,
      title: 'Welcome to Senabil Team!',
      message: 'Your volunteer application for "Safe Learning Spaces & Emergency Digital Tutoring" was approved.',
      isRead: true,
    },
  });

  // 7. Create Audit Logs
  const auditLogs = [
    {
      actorId: admin.id,
      action: 'SYSTEM_INITIALIZED',
      entityType: 'System',
      entityId: 'senabil-core',
      description: 'Platform initialized with humanitarian modules and Gazan relief projects.',
    },
    {
      actorId: admin.id,
      action: 'PROJECT_CREATED',
      entityType: 'Project',
      entityId: createdProjects[0].id,
      description: `Created project "${createdProjects[0].title}" in category FOOD.`,
    },
    {
      actorId: beneficiary1.id,
      action: 'USER_REGISTERED',
      entityType: 'User',
      entityId: beneficiary1.id,
      description: `New BENEFICIARY registered: Ahmed Radi (ahmed.beneficiary@gmail.com).`,
    },
    {
      actorId: beneficiary1.id,
      action: 'APPLICATION_SUBMITTED',
      entityType: 'Application',
      entityId: createdProjects[0].id,
      description: `User Ahmed Radi submitted application for "${createdProjects[0].title}".`,
    },
    {
      actorId: admin.id,
      action: 'APPLICATION_APPROVED',
      entityType: 'Application',
      entityId: createdProjects[0].id,
      description: `Admin approved application for Ahmed Radi on "${createdProjects[0].title}".`,
    },
    {
      actorId: admin.id,
      action: 'PROJECT_PAUSED',
      entityType: 'Project',
      entityId: createdProjects[3].id,
      description: `Admin paused project "${createdProjects[3].title}" due to seasonal transition.`,
    },
  ];

  for (const log of auditLogs) {
    await prisma.auditLog.create({ data: log });
  }

  console.log('✅ Seeding completed successfully!');
  console.log('--- DEFAULT CREDENTIALS ---');
  console.log('Admin:       admin@senabil.org / admin123');
  console.log('Volunteer:   tariq.volunteer@senabil.org / volunteer123');
  console.log('Beneficiary: ahmed.beneficiary@gmail.com / beneficiary123');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

