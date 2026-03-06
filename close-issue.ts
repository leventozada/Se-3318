import * as dotenv from 'dotenv';
import * as https from 'https';

dotenv.config();

async function closeIssue(): Promise<void> {
  const token = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;

  if (!token) {
    console.error('❌ GitHub token not found');
    return;
  }

  const commentBody = `✅ **Implementation Complete!**

This issue has been successfully addressed with the following deliverables:

## 🎯 Completed Tasks

### Design & Layout
- ✅ Modern gradient color scheme (Purple → Pink)
- ✅ Improved typography hierarchy
- ✅ Responsive layout for all devices (Desktop, Tablet, Mobile)
- ✅ Smooth animations and transitions

### Visual Elements
- ✅ Professional hero section with animations
- ✅ Smooth scroll effects and transitions
- ✅ Hover effects on all interactive elements
- ✅ Professional task card designs

### Navigation & UX
- ✅ Sticky navigation bar with gradient
- ✅ Mobile-friendly hamburger menu
- ✅ Smooth section scrolling
- ✅ "Back to Top" floating button

### Additional Features
- ✅ Task management system (Add, Edit, Delete)
- ✅ Real-time task statistics
- ✅ Task filtering (All, Active, Completed)
- ✅ Automatic checkbox management
- ✅ Bootstrap Icons (Font Awesome 6.4)
- ✅ Contact form with social media links
- ✅ SQLite database integration

## 🛠️ Technology Stack

**Backend:** Java Servlet Architecture, RESTful API, SQLite Database
**Frontend:** HTML5, CSS3, Vanilla JavaScript, Responsive Design

## 📦 Deployment

✅ Application deployed and running on localhost:8080
✅ All backend APIs functional
✅ Database persistence working
✅ Code pushed to GitHub via MCP integration

**Status:** ✅ **COMPLETED**
**Branch:** main
**Commit:** feat: Implement Modern TODO List Application with Full-Stack Architecture

Implementation assisted with Model Context Protocol (MCP) integration.`;

  const commentData = JSON.stringify({
    body: commentBody
  });

  const options = {
    hostname: 'api.github.com',
    path: '/repos/leventozada/Se-3318/issues/5/comments',
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
            console.log('✅ Completion comment posted successfully!');
            console.log(`📝 Comment URL: ${response.html_url}`);
          } else {
            console.error(`❌ Error: ${res.statusCode}`);
            console.error(response.message);
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

    req.write(commentData);
    req.end();
  });
}

console.log('🚀 Posting completion comment to issue #5...');
console.log('Repository: leventozada/Se-3318');
console.log('');

closeIssue();
