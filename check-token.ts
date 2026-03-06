import * as dotenv from 'dotenv';
import * as https from 'https';

dotenv.config();

async function checkTokenAndAccess(): Promise<void> {
  const token = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;

  if (!token) {
    console.error('❌ GitHub token not found');
    return;
  }

  console.log('🔍 Checking token scope and repository access...\n');

  // Check token scope
  const scopeOptions = {
    hostname: 'api.github.com',
    path: '/user',
    method: 'GET',
    headers: {
      'Authorization': `token ${token}`,
      'User-Agent': 'MCP-GitHub-Client',
      'Accept': 'application/vnd.github.v3+json'
    }
  };

  return new Promise((resolve) => {
    https.request(scopeOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const scopes = res.headers['x-oauth-scopes'] || 'none';
        console.log(`✅ Token Status: Valid`);
        console.log(`📋 Token Scopes: ${scopes}`);
        console.log(`👤 User: ${JSON.parse(data).login}`);
        console.log('');

        // Check repository
        const repoOptions = {
          hostname: 'api.github.com',
          path: '/repos/leventozada/Se-3318',
          method: 'GET',
          headers: {
            'Authorization': `token ${token}`,
            'User-Agent': 'MCP-GitHub-Client',
            'Accept': 'application/vnd.github.v3+json'
          }
        };

        https.request(repoOptions, (res2) => {
          let repoData = '';
          res2.on('data', chunk => repoData += chunk);
          res2.on('end', () => {
            try {
              const repo = JSON.parse(repoData);
              console.log(`📦 Repository: ${repo.full_name}`);
              console.log(`👁️  Status: ${repo.private ? 'Private' : 'Public'}`);
              console.log(`✏️  Permission: ${repo.permissions ? Object.keys(repo.permissions).filter(k => repo.permissions[k]).join(', ') : 'Unknown'}`);
              console.log('');
              
              if (res2.statusCode !== 200) {
                console.log(`⚠️  Status Code: ${res2.statusCode}`);
                console.log(`📝 Message: ${repo.message}`);
              }
            } catch (e) {
              console.error('Error parsing response:', e);
            }
            resolve();
          });
        }).end();
      });
    }).end();
  });
}

checkTokenAndAccess();
