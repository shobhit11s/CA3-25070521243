const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('./models/User');
const Project = require('./models/Project');
const Proposal = require('./models/Proposal');
const Contract = require('./models/Contract');
const Milestone = require('./models/Milestone');
const Conversation = require('./models/Conversation');
const Message = require('./models/Message');
const Review = require('./models/Review');

const seedData = async () => {
  try {
    console.log('[Seed] Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('[Seed] Connected. Clearing old collections...');

    await Promise.all([
      User.deleteMany({}),
      Project.deleteMany({}),
      Proposal.deleteMany({}),
      Contract.deleteMany({}),
      Milestone.deleteMany({}),
      Conversation.deleteMany({}),
      Message.deleteMany({}),
      Review.deleteMany({}),
    ]);

    // 1. Admin
    const admin = await User.create({
      name: 'System Admin',
      email: 'admin@talentloop.com',
      password: 'password123',
      role: 'admin',
      title: 'TalentLoop Platform Administrator',
      location: 'San Francisco, CA',
    });

    // 2. Clients
    const client1 = await User.create({
      name: 'Sarah Jenkins',
      email: 'sarah.client@talentloop.com',
      password: 'password123',
      role: 'client',
      title: 'Founder & CEO at Apex Cloud',
      bio: 'Leading fintech and cloud SaaS product builder. Always searching for high-caliber engineers and product designers for high-impact MVPs.',
      location: 'New York, NY',
      rating: 4.9,
      reviewsCount: 8,
    });

    const client2 = await User.create({
      name: 'Marcus Vance',
      email: 'marcus.client@talentloop.com',
      password: 'password123',
      role: 'client',
      title: 'Head of Growth at NextWave Media',
      bio: 'Creative director and digital marketing head looking for top-tier video editors and brand strategists.',
      location: 'Austin, TX',
      rating: 5.0,
      reviewsCount: 5,
    });

    // 3. Freelancers
    const freelancer1 = await User.create({
      name: 'Elena Rostova',
      email: 'elena.dev@talentloop.com',
      password: 'password123',
      role: 'freelancer',
      title: 'Senior Full-Stack Web Developer (React / Node / MERN)',
      bio: 'Over 7 years of experience engineering high-speed React SPAs, robust Express REST APIs, and responsive database architectures. Passionate about clean code and delightful UX.',
      skills: ['React', 'Node.js', 'MongoDB', 'Express', 'JavaScript', 'REST APIs', 'Tailwind CSS'],
      hourlyRate: 65,
      experienceLevel: 'Expert',
      location: 'Seattle, WA',
      rating: 4.9,
      reviewsCount: 14,
      portfolioLinks: [
        { title: 'SaaS Analytics Dashboard', url: 'https://github.com/example/analytics-app' },
        { title: 'Modern E-Commerce Portal', url: 'https://github.com/example/ecommerce-vite' },
      ],
    });

    const freelancer2 = await User.create({
      name: 'David Chen',
      email: 'david.design@talentloop.com',
      password: 'password123',
      role: 'freelancer',
      title: 'Lead Brand & UI/UX Designer',
      bio: 'Designing intuitive digital products, responsive web design systems, and memorable brand identities. 5+ years working with startups from seed to Series B.',
      skills: ['Figma', 'UI/UX Design', 'Graphic Design', 'Brand Identity', 'Prototyping', 'Design Systems'],
      hourlyRate: 55,
      experienceLevel: 'Expert',
      location: 'Toronto, Canada',
      rating: 5.0,
      reviewsCount: 9,
      portfolioLinks: [
        { title: 'Dribbble Portfolio', url: 'https://dribbble.com/example' },
        { title: 'Fintech Mobile UI Case Study', url: 'https://behance.net/example' },
      ],
    });

    const freelancer3 = await User.create({
      name: 'Maya Brooks',
      email: 'maya.content@talentloop.com',
      password: 'password123',
      role: 'freelancer',
      title: 'Growth Marketer & Video Production Specialist',
      bio: 'Specialized in viral short-form video editing (Reels, TikTok, YouTube Shorts), B2B copywriting, and conversion-optimized ad creative.',
      skills: ['Video Editing', 'Premiere Pro', 'Content Creation', 'Digital Marketing', 'SEO', 'Copywriting'],
      hourlyRate: 45,
      experienceLevel: 'Intermediate',
      location: 'Chicago, IL',
      rating: 4.8,
      reviewsCount: 6,
      portfolioLinks: [
        { title: 'Video Portfolio Reel', url: 'https://vimeo.com/example' },
      ],
    });

    console.log('[Seed] Users created.');

    // 4. Projects
    console.log('[Seed] Creating demo projects...');
    const project1 = await Project.create({
      title: 'Modern E-Commerce Customer Portal & Dashboard',
      description: 'We are seeking a senior full-stack developer to create a responsive, lightning-fast customer portal with order tracking, profile management, and interactive analytics. Must be proficient in React, Node.js, and MongoDB.',
      category: 'Web Development',
      budget: { type: 'fixed', amount: 1800 },
      skillsRequired: ['React', 'Node.js', 'MongoDB', 'REST APIs', 'CSS3'],
      deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
      client: client1._id,
      status: 'In Progress',
      hiredFreelancer: freelancer1._id,
      proposalsCount: 2,
    });

    const project2 = await Project.create({
      title: 'Complete SaaS Brand Identity & Design System',
      description: 'Looking for a talented UI/UX and graphic designer to develop a comprehensive brand identity including logo, typography guidelines, color palette, and a high-fidelity 15-screen component design system in Figma.',
      category: 'Graphic Design',
      budget: { type: 'fixed', amount: 1200 },
      skillsRequired: ['Figma', 'UI/UX Design', 'Graphic Design', 'Brand Identity'],
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      client: client1._id,
      status: 'Open',
      proposalsCount: 1,
    });

    const project3 = await Project.create({
      title: 'High-Impact Product Video Ads (5 Reels & Shorts)',
      description: 'Need a fast-paced, creative video editor to transform raw screen recordings and founder voiceovers into 5 punchy 30-45s viral videos for YouTube Shorts and Instagram Ads. High attention to sound design and motion captions required.',
      category: 'Video Editing',
      budget: { type: 'fixed', amount: 850 },
      skillsRequired: ['Video Editing', 'Premiere Pro', 'Motion Graphics', 'Sound Design'],
      deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      client: client2._id,
      status: 'Open',
      proposalsCount: 1,
    });

    const project4 = await Project.create({
      title: 'SEO Content Strategy & Technical Blog Writing (8 Articles)',
      description: 'We need an experienced tech copywriter to produce eight 1,500-word authoritative blog articles on AI workflow automation, developer tools, and cloud deployment. Must conduct keyword research and incorporate target keywords naturally.',
      category: 'Content Creation',
      budget: { type: 'fixed', amount: 950 },
      skillsRequired: ['Content Creation', 'SEO', 'Copywriting', 'Technical Writing'],
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      client: client2._id,
      status: 'Open',
      proposalsCount: 0,
    });

    const project5 = await Project.create({
      title: 'Cross-Platform Mobile App Redesign (Completed)',
      description: 'Full redesign of our client-facing mobile web application to streamline the checkout conversion funnel and reduce abandonment.',
      category: 'Web Development',
      budget: { type: 'fixed', amount: 2400 },
      skillsRequired: ['React', 'CSS3', 'UI/UX Design', 'Mobile Web'],
      deadline: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      client: client1._id,
      status: 'Completed',
      hiredFreelancer: freelancer1._id,
      proposalsCount: 3,
    });

    // 5. Proposals
    console.log('[Seed] Creating demo proposals...');
    const proposal1 = await Proposal.create({
      project: project1._id,
      freelancer: freelancer1._id,
      coverLetter: 'Hi Sarah! I have built several similar React/Node/MongoDB dashboards with live filters, clean modular components, and responsive layouts. I can deliver the core structure within the first 10 days followed by milestone reviews.',
      bidAmount: 1800,
      deliveryTimeDays: 18,
      status: 'accepted',
    });

    const proposal2 = await Proposal.create({
      project: project1._id,
      freelancer: freelancer2._id,
      coverLetter: 'Hello! While I specialize in UI design, I also partner with senior front-end engineers to deliver turnkey React web applications. Excited about your vision for Apex Cloud.',
      bidAmount: 2000,
      deliveryTimeDays: 20,
      status: 'rejected',
    });

    await Proposal.create({
      project: project2._id,
      freelancer: freelancer2._id,
      coverLetter: 'Hi Sarah, I would love to build the brand identity and Figma design system for your SaaS. I have over 5 years designing sleek, cohesive design systems for tech startups.',
      bidAmount: 1200,
      deliveryTimeDays: 14,
      status: 'pending',
    });

    await Proposal.create({
      project: project3._id,
      freelancer: freelancer3._id,
      coverLetter: 'Hey Marcus, I specialize in dynamic product ad reels with energetic pacing, animated subtitles, and sound effects that capture attention in the first 3 seconds.',
      bidAmount: 800,
      deliveryTimeDays: 7,
      status: 'pending',
    });

    // 6. Active Contract and Milestones for Project 1
    console.log('[Seed] Creating demo contract and milestones...');
    const activeContract = await Contract.create({
      project: project1._id,
      client: client1._id,
      freelancer: freelancer1._id,
      proposal: proposal1._id,
      totalAmount: 1800,
      status: 'active',
      startDate: new Date(),
    });

    project1.activeContract = activeContract._id;
    await project1.save();

    await Milestone.create([
      {
        contract: activeContract._id,
        project: project1._id,
        title: 'Phase 1: Architecture & Auth System',
        description: 'Setup project scaffolding, MongoDB schemas, and user authentication with JWT.',
        amount: 600,
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        status: 'Approved',
        approvedAt: new Date(),
      },
      {
        contract: activeContract._id,
        project: project1._id,
        title: 'Phase 2: Customer Portal & Order History',
        description: 'Build interactive order tracking screens with filter and search capabilities.',
        amount: 700,
        dueDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
        status: 'Submitted',
        submissionNotes: 'All responsive UI views completed and connected to mock data endpoints. Ready for client review!',
        submittedAt: new Date(),
      },
      {
        contract: activeContract._id,
        project: project1._id,
        title: 'Phase 3: Final Testing & Deployment Prep',
        description: 'End-to-end testing, error boundary checks, and production build readiness.',
        amount: 500,
        dueDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
        status: 'Pending',
      },
    ]);

    // 7. Completed Contract & Reviews for Project 5
    const completedContract = await Contract.create({
      project: project5._id,
      client: client1._id,
      freelancer: freelancer1._id,
      proposal: proposal1._id,
      totalAmount: 2400,
      status: 'completed',
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    });

    project5.activeContract = completedContract._id;
    await project5.save();

    await Review.create({
      project: project5._id,
      contract: completedContract._id,
      reviewer: client1._id,
      reviewee: freelancer1._id,
      role: 'client_to_freelancer',
      rating: 5,
      comment: 'Elena did an exceptional job re-architecting our mobile web experience. Clean code, prompt communication, and delivered ahead of schedule!',
    });

    await Review.create({
      project: project5._id,
      contract: completedContract._id,
      reviewer: freelancer1._id,
      reviewee: client1._id,
      role: 'freelancer_to_client',
      rating: 5,
      comment: 'Sarah is an outstanding client with clear requirements and prompt milestone approvals. Would gladly collaborate again.',
    });

    // 8. Demo Conversation & Messages
    console.log('[Seed] Creating demo conversation and messages...');
    const conversation = await Conversation.create({
      participants: [client1._id, freelancer1._id],
      project: project1._id,
      lastMessage: 'Phase 2 deliverables look great! Reviewing the order tracking component now.',
      lastMessageAt: new Date(),
    });

    await Message.create([
      {
        conversation: conversation._id,
        sender: client1._id,
        receiver: freelancer1._id,
        content: 'Hi Elena, thrilled to have you on board for the E-Commerce Portal project!',
      },
      {
        conversation: conversation._id,
        sender: freelancer1._id,
        receiver: client1._id,
        content: 'Thanks Sarah! I have already set up the project repository and completed Phase 1 milestone.',
      },
      {
        conversation: conversation._id,
        sender: client1._id,
        receiver: freelancer1._id,
        content: 'Phase 2 deliverables look great! Reviewing the order tracking component now.',
      },
    ]);

    console.log('[Seed] Database seeded successfully!');
    console.log('\n================ DEMO CREDENTIALS ================');
    console.log('1. Admin:      admin@talentloop.com        / password123');
    console.log('2. Client 1:   sarah.client@talentloop.com / password123');
    console.log('3. Client 2:   marcus.client@talentloop.com/ password123');
    console.log('4. Freelancer: elena.dev@talentloop.com    / password123');
    console.log('5. Freelancer: david.design@talentloop.com / password123');
    console.log('6. Freelancer: maya.content@talentloop.com / password123');
    console.log('===================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedData();
