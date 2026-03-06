import * as dotenv from 'dotenv';
import * as https from 'https';

dotenv.config();

interface GraphQLResponse {
  data?: {
    repository?: {
      createIssue?: {
        issue?: {
          number: number;
          url: string;
          title: string;
        };
      };
    };
  };
  errors?: Array<{
    message: string;
  }>;
}

async function createIssueGraphQL(): Promise<void> {
  const token = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;

  if (!token) {
    console.error('❌ GitHub token not found');
    return;
  }

  const query = `mutation CreateIssue {
    createIssue(input: {
      repositoryId: "R_kgDOLmq1dA"
      title: "✨ Enhance UI/UX Design - Portfolio Website Redesign"
      body: "## 🎯 Objective\\nImprove the overall aesthetic and user experience of the portfolio website to create a more professional and modern appearance that better showcases your work and skills.\\n\\n## 📋 Proposed Improvements\\n\\n### Design & Layout\\n- [ ] Implement a modern, clean design system with improved color palette\\n- [ ] Add gradient backgrounds or subtle animations for visual interest\\n- [ ] Improve spacing and typography hierarchy across all sections\\n- [ ] Create a responsive layout that works seamlessly on mobile, tablet, and desktop\\n\\n### Visual Elements\\n- [ ] Add professional hero section with eye-catching headline\\n- [ ] Implement smooth scroll animations and transitions\\n- [ ] Add hover effects to interactive elements (buttons, cards, links)\\n- [ ] Include professional portfolio card designs for projects section\\n\\n### Navigation & UX\\n- [ ] Create a sticky/fixed navigation bar for better usability\\n- [ ] Add smooth navigation between sections\\n- [ ] Implement a mobile-friendly hamburger menu\\n- [ ] Add a Back to Top button\\n\\n### Additional Content\\n- [ ] Add profile image/avatar section\\n- [ ] Include social media links with hover effects\\n- [ ] Add call-to-action buttons\\n- [ ] Implement a contact form or section\\n\\n## 🎨 Design Principles\\n- Modern and professional appearance\\n- High contrast for better readability\\n- Consistent color scheme throughout\\n- Smooth animations without being overwhelming\\n- Mobile-first responsive design"
    }) {
      issue {
        number
        url
        title
      }
    }
  }`;

  const data = JSON.stringify({ query });

  const options = {
    hostname: 'api.github.com',
    path: '/graphql',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length,
      'Authorization': `Bearer ${token}`,
      'User-Agent': 'MCP-GitHub-Client'
    }
  };

  return new Promise((resolve) => {
    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const response: GraphQLResponse = JSON.parse(responseData);
          console.log('📤 Full Response:', responseData);
          console.log('');

          if (response.errors) {
            console.error('❌ GraphQL Error:');
            response.errors.forEach(err => {
              console.error(`   ${err.message}`);
            });
          } else if (response.data?.repository?.createIssue?.issue) {
            const issue = response.data.repository.createIssue.issue;
            console.log('✅ Issue successfully created!');
            console.log('');
            console.log('📋 Issue Details:');
            console.log(`   Title: ${issue.title}`);
            console.log(`   Number: #${issue.number}`);
            console.log(`   URL: ${issue.url}`);
            console.log('');
            console.log(`🔗 View on GitHub: ${issue.url}`);
          } else {
            console.error('❌ Unexpected response:', responseData);
          }
        } catch (e) {
          console.error('Error parsing response:', e);
        }
        resolve();
      });
    });

    req.on('error', (e) => {
      console.error('❌ Request failed:', e.message);
    });

    req.write(data);
    req.end();
  });
}

console.log('🚀 Creating GitHub Issue via GraphQL...');
console.log('Repository: leventozada/Se-3318');
console.log('');

createIssueGraphQL();
