# MCP GitHub Integration

Model Context Protocol (MCP) servers for GitHub integration, sequential thinking, and git operations.

## Features

✅ **GitHub MCP** - Create issues, access repositories, manage GitHub resources
✅ **Sequential Thinking MCP** - Break down complex tasks into sequential steps  
✅ **GitMCP** - Perform git operations

## Requirements

- Node.js 16+ and npm
- GitHub Personal Access Token (for GitHub MCP)

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure GitHub Token

Add your GitHub Personal Access Token to `.env` file:

```env
GITHUB_PERSONAL_ACCESS_TOKEN=your_github_pat_here
```

**How to create a GitHub PAT:**
1. Go to [GitHub Settings → Tokens](https://github.com/settings/tokens)
2. Click "Generate new token"
3. Select scopes: `repo`, `gist`, `user`
4. Copy the token and paste it in `.env`

### 3. Build the Project

```bash
npm run build
```

### 4. Run

```bash
npm run dev
```

or 

```bash
npm start
```

## MCP Configuration

The MCP servers are configured in `cline_mcp_config.json`:

```json
{
  "servers": {
    "github": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${env:GITHUB_PERSONAL_ACCESS_TOKEN}"
      }
    },
    "sequential-thinking": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
    },
    "gitmcp": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://gitmcp.io/docs"]
    }
  }
}
```

## Usage

### Creating GitHub Issues Programmatically

Once the GitHub token is configured, you can use the GitHub MCP server to:
- Create issues in repositories
- Check repository information
- Manage pull requests
- Access repository contents

### Environment Variables

- `GITHUB_PERSONAL_ACCESS_TOKEN` - GitHub Personal Access Token (required for GitHub operations)
- `MCP_GITHUB_ENABLED` - Enable/disable GitHub MCP (default: true)
- `MCP_SEQUENTIAL_THINKING_ENABLED` - Enable/disable sequential thinking (default: true)
- `MCP_GITMCP_ENABLED` - Enable/disable GitMCP (default: true)

## Project Structure

```
.
├── src/
│   └── index.ts           # Main MCP manager
├── dist/                  # Compiled JavaScript output
├── cline_mcp_config.json  # MCP configuration
├── .env                   # Environment variables (add your token here)
├── .env.example           # Example environment variables
├── package.json           # Project dependencies
├── tsconfig.json          # TypeScript configuration
└── README.md              # This file
```

## Troubleshooting

### GitHub token not recognized
- Make sure `.env` file exists in the project root
- Verify the token is valid: `GITHUB_PERSONAL_ACCESS_TOKEN=your_token`
- Check that required scopes are enabled on the token

### Module not found errors
```bash
npm install
npm run build
```

### Permission denied on macOS/Linux
```bash
chmod +x node_modules/.bin/*
```

## Security Note

⚠️ **Never commit `.env` file to version control!**
- The `.env` file is already in `.gitignore`
- Use `.env.example` as a template
- Each developer should create their own `.env` file

## Resources

- [MCP GitHub Server](https://github.com/modelcontextprotocol/servers/tree/main/src/github)
- [GitHub Personal Access Tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
- [MCP Documentation](https://modelcontextprotocol.io/)

## License

MIT
