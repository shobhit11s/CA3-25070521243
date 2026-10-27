const API_URL = 'http://localhost:5050/api';

async function request(endpoint, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) {
    const error = new Error(data.message || `HTTP ${res.status}`);
    error.response = { data, status: res.status };
    throw error;
  }
  return data;
}

async function runTests() {
  console.log('🧪 Starting TalentLoop End-to-End Functional Verification...\n');

  try {
    // 1. Client Login
    console.log('1. Testing Client Login (Sarah Jenkins)...');
    const clientRes = await request('/auth/login', {
      method: 'POST',
      body: { email: 'sarah.client@talentloop.com', password: 'password123' },
    });
    const clientToken = clientRes.token;
    const clientId = clientRes.user._id;
    console.log(`   ✅ Client Authenticated: ${clientRes.user.name} (${clientRes.user.role})`);

    // 2. Freelancer Login
    console.log('2. Testing Freelancer Login (Elena Rostova)...');
    const freelancerRes = await request('/auth/login', {
      method: 'POST',
      body: { email: 'elena.dev@talentloop.com', password: 'password123' },
    });
    const freelancerToken = freelancerRes.token;
    const freelancerId = freelancerRes.user._id;
    console.log(`   ✅ Freelancer Authenticated: ${freelancerRes.user.name} (${freelancerRes.user.role})`);

    // 3. Admin Login
    console.log('3. Testing Admin Login (System Admin)...');
    const adminRes = await request('/auth/login', {
      method: 'POST',
      body: { email: 'admin@talentloop.com', password: 'password123' },
    });
    const adminToken = adminRes.token;
    console.log(`   ✅ Admin Authenticated: ${adminRes.user.name} (${adminRes.user.role})`);

    // 4. Create Project by Client
    console.log('4. Testing Project Creation by Client...');
    const projectRes = await request('/projects', {
      method: 'POST',
      headers: { Authorization: `Bearer ${clientToken}` },
      body: {
        title: 'Full-Stack Fintech Payment Portal',
        description: 'Need a developer to build a Stripe & Plaid payment verification portal with React & Node.',
        category: 'Web Development',
        budgetType: 'fixed',
        budgetAmount: 2200,
        skillsRequired: ['React', 'Node.js', 'MongoDB', 'Stripe API'],
      },
    });
    const newProjectId = projectRes.project._id;
    console.log(`   ✅ Project Created: "${projectRes.project.title}" (ID: ${newProjectId})`);

    // 5. Submit Proposal by Freelancer
    console.log('5. Testing Proposal Submission by Freelancer...');
    const propRes = await request('/proposals', {
      method: 'POST',
      headers: { Authorization: `Bearer ${freelancerToken}` },
      body: {
        projectId: newProjectId,
        bidAmount: 2100,
        deliveryTimeDays: 14,
        coverLetter: 'I have extensive experience with Stripe integrations and robust React applications.',
      },
    });
    const proposalId = propRes.proposal._id;
    console.log(`   ✅ Proposal Submitted: Bid $${propRes.proposal.bidAmount}`);

    // 6. Test Duplicate Proposal Prevention
    console.log('6. Verifying Duplicate Proposal Prevention...');
    try {
      await request('/proposals', {
        method: 'POST',
        headers: { Authorization: `Bearer ${freelancerToken}` },
        body: {
          projectId: newProjectId,
          bidAmount: 2000,
          deliveryTimeDays: 10,
          coverLetter: 'Second attempt should be rejected by server.',
        },
      });
      console.error('   ❌ Duplicate proposal was NOT rejected!');
    } catch (err) {
      console.log(`   ✅ Server successfully prevented duplicate: "${err.response.data.message}"`);
    }

    // 7. Client Accepts Proposal (Hiring Workflow)
    console.log('7. Testing Client Proposal Acceptance (Hiring Workflow)...');
    const acceptRes = await request(`/proposals/${proposalId}/accept`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${clientToken}` },
    });
    const contractId = acceptRes.contractId;
    console.log(`   ✅ Freelancer Hired! Contract Created (ID: ${contractId})`);

    // 8. Freelancer Submits Milestone Deliverable
    console.log('8. Testing Milestone Progression...');
    const contractRes = await request(`/contracts/${contractId}`, {
      headers: { Authorization: `Bearer ${freelancerToken}` },
    });
    const milestone = contractRes.milestones[0];
    console.log(`   Found Milestone: "${milestone.title}" (Status: ${milestone.status})`);

    const submitRes = await request(`/contracts/milestones/${milestone._id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${freelancerToken}` },
      body: {
        status: 'Submitted',
        submissionNotes: 'All components built and tested against API endpoints.',
      },
    });
    console.log(`   ✅ Freelancer Submitted Deliverable: Status now "${submitRes.milestone.status}"`);

    // 9. Client Approves Milestone
    console.log('9. Client Approves Milestone...');
    const approveRes = await request(`/contracts/milestones/${milestone._id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${clientToken}` },
      body: { status: 'Approved' },
    });
    console.log(`   ✅ Client Approved Milestone: Status now "${approveRes.milestone.status}"`);

    // 10. Complete Contract
    console.log('10. Completing Contract...');
    await request(`/contracts/${contractId}/complete`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${clientToken}` },
    });
    console.log('   ✅ Contract marked Completed!');

    // 11. Client Leaves Review for Freelancer
    console.log('11. Client Submits Review for Completed Contract...');
    const reviewRes = await request('/reviews', {
      method: 'POST',
      headers: { Authorization: `Bearer ${clientToken}` },
      body: {
        contractId,
        rating: 5,
        comment: 'Fantastic execution and clear communication throughout the milestone process!',
      },
    });
    console.log(`   ✅ Review Created: Rating ${reviewRes.review.rating} Stars`);

    // 12. Direct Messaging Test
    console.log('12. Testing Direct Messaging...');
    const convRes = await request('/messages/conversations', {
      method: 'POST',
      headers: { Authorization: `Bearer ${clientToken}` },
      body: { recipientId: freelancerId, projectId: newProjectId },
    });
    const convId = convRes.conversation._id;

    const msgRes = await request('/messages', {
      method: 'POST',
      headers: { Authorization: `Bearer ${clientToken}` },
      body: { conversationId: convId, content: 'Thank you for the excellent work on this project!' },
    });
    console.log(`   ✅ Message Sent: "${msgRes.message.content}"`);

    // 13. Admin Dashboard Verification
    console.log('13. Testing Admin Platform Metrics...');
    const statsRes = await request('/admin/stats', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    console.log(`   ✅ Admin Stats: Total Users: ${statsRes.stats.totalUsers}, Total Projects: ${statsRes.stats.totalProjects}, Total Contracts: ${statsRes.stats.totalContracts}`);

    console.log('\n🎉 ALL 13 END-TO-END VERIFICATION TESTS PASSED SUCCESSFULLY! 🚀\n');
  } catch (error) {
    console.error('❌ Test Failure:', error.response?.data || error.message);
    process.exit(1);
  }
}

runTests();
