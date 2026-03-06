import * as dotenv from 'dotenv';
import * as https from 'https';

dotenv.config();

async function createIssueSimple(): Promise<void> {
  const token = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;

  if (!token) {
    console.error('❌ GitHub token not found');
    process.exit(1);
  }

  const issueData = {
    title: '✨ Enhance UI/UX Design - Portfolio Website Redesign',
    body: `## 🎯 Objective
Improve the overall aesthetic and user experience of the portfolio website to create a more professional and modern appearance that better showcases your work and skills.

## 📋 Proposed Improvements

### Design & Layout
- Implement a modern, clean design system with improved color palette
- Add gradient backgrounds or subtle animations for visual interest
- Improve spacing and typography hierarchy across all sections
- Create a responsive layout that works seamlessly on mobile, tablet, and desktop

### Visual Elements
- Add professional hero section with eye-catching headline
- Implement smooth scroll animations and transitions
- Add hover effects to interactive elements (buttons, cards, links)
- Include professional portfolio card designs for projects section

### Navigation & UX
- Create a sticky/fixed navigation bar for better usability
- Add smooth navigation between sections
- Implement a mobile-friendly hamburger menu
- Add a "Back to Top" button

### Additional Content
- Add profile image/avatar section
- Include social media links with hover effects
- Add call-to-action buttons
- Implement a contact form or section

## 🎨 Design Principles
- Modern and professional appearance
- High contrast for better readability
- Consistent color scheme throughout
- Smooth animations without being overwhelming
- Mobile-first responsive design`
  };

  const payload = JSON.stringify(issueData);

  const options = {
    hostname: 'api.github.com',
    path: '/repos/leventozada/Se-3318/issues',
    method: 'POST',
    headers: {
      'Accept': 'application/vnd.github+json',
      'Authorization': `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
      'User-Agent': 'Node.js'
    }
  };

  return new Promise((resolve) => {
    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(data);

          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            console.log('✅ Issue successfully created!');
            console.log('');
            console.log('📋 Issue Details:');
            console.log(`   Title: ${response.title}`);
            console.log(`   Number: #${response.number}`);
            console.log(`   State: ${response.state}`);
            console.log('');
            console.log(`🔗 View on GitHub: ${response.html_url}`);
          } else {
            console.error(`❌ Error: ${res.statusCode}`);
            console.error(`Message: ${response.message}`);
            if (response.errors) {
              console.error('Details:', JSON.stringify(response.errors, null, 2));
            }
          }
        } catch (e) {
          console.error('Error parsing response:', e);
          console.error('Response:', data);
        }
        resolve();
      });
    });

    req.on('error', (e) => {
      console.error('❌ Request failed:', e.message);
    });

    req.write(payload);
    req.end();
  });
}

console.log('🚀 Creating GitHub Issue...');
console.log('Repository: leventozada/Se-3318');
console.log('');

createIssueSimple();
