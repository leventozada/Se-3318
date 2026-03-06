import * as dotenv from 'dotenv';
import * as https from 'https';

// Load environment variables
dotenv.config();

interface GitHubIssue {
  title: string;
  body: string;
  labels?: string[];
}

async function createGitHubIssue(
  owner: string,
  repo: string,
  issue: GitHubIssue
): Promise<void> {
  const token = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;

  if (!token) {
    console.error('❌ GitHub token not found in .env file');
    process.exit(1);
  }

  const data = JSON.stringify({
    title: issue.title,
    body: issue.body
  });

  const options = {
    hostname: 'api.github.com',
    port: 443,
    path: `/repos/${owner}/${repo}/issues`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length,
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'MCP-GitHub-Client'
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(responseData);

          if (res.statusCode === 201) {
            console.log('✅ Issue successfully created!');
            console.log('');
            console.log('📋 Issue Details:');
            console.log(`   Title: ${response.title}`);
            console.log(`   Number: #${response.number}`);
            console.log(`   URL: ${response.url}`);
            console.log(`   State: ${response.state}`);
            console.log('');
            console.log(`🔗 View on GitHub: ${response.html_url}`);
          } else {
            console.error(`❌ Error: ${res.statusCode}`);
            console.error(response.message);
            reject(new Error(response.message));
          }
        } catch (e) {
          reject(e);
        }
        resolve();
      });
    });

    req.on('error', (e) => {
      console.error('❌ Request failed:', e.message);
      reject(e);
    });

    req.write(data);
    req.end();
  });
}

// Create the issue
const issueData: GitHubIssue = {
  title: '✨ Enhance UI/UX Design - Portfolio Website Redesign',
  body: `## 🎯 Objective
Improve the overall aesthetic and user experience of the portfolio website to create a more professional and modern appearance that better showcases your work and skills.

## 📋 Proposed Improvements

### Design & Layout
- [ ] Implement a modern, clean design system with improved color palette
- [ ] Add gradient backgrounds or subtle animations for visual interest
- [ ] Improve spacing and typography hierarchy across all sections
- [ ] Create a responsive layout that works seamlessly on mobile, tablet, and desktop

### Visual Elements
- [ ] Add professional hero section with eye-catching headline
- [ ] Implement smooth scroll animations and transitions
- [ ] Add hover effects to interactive elements (buttons, cards, links)
- [ ] Include professional portfolio card designs for projects section

### Navigation & UX
- [ ] Create a sticky/fixed navigation bar for better usability
- [ ] Add smooth navigation between sections
- [ ] Implement a mobile-friendly hamburger menu
- [ ] Add a "Back to Top" button

### Additional Content
- [ ] Add profile image/avatar section
- [ ] Include social media links with hover effects
- [ ] Add call-to-action buttons (e.g., "Download CV", "Get In Touch")
- [ ] Implement a contact form or section

## 🎨 Design Principles
- Modern and professional appearance
- High contrast for better readability
- Consistent color scheme throughout
- Smooth animations without being overwhelming
- Mobile-first responsive design

## 📁 Affected Files
- \`index.html\` - Main structure updates
- CSS styling improvements (inline or external stylesheet)
- Potential addition of JS libraries for animations

## ✅ Acceptance Criteria
- Website displays professionally on all devices
- Load time is optimized
- Animations are smooth and enhance UX
- All interactive elements have proper hover/active states
- Accessibility standards are met

## 📚 Resources
- Modern CSS: Flexbox, Grid, Custom Properties
- Animation libraries: AOS, GSAP, or vanilla CSS transitions
- Icons: Font Awesome or similar icon library
- Color palette tools: Coolors.co, Color Hunt

## 🔗 Related
Part of ongoing portfolio improvement initiative`,
  labels: ['enhancement', 'UI/UX', 'design', 'website']
};

console.log('🚀 Creating GitHub Issue...');
console.log('Repository: leventozada/Se-3318');
console.log('');

createGitHubIssue('leventozada', 'Se-3318', issueData)
  .catch((error) => {
    console.error('Failed to create issue:', error);
    process.exit(1);
  });
