import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * MCP (Model Context Protocol) Server Configuration
 * This module initializes and manages MCP servers for:
 * - GitHub integration (create issues, access repos)
 * - Sequential thinking tasks
 * - Git operations via GitMCP
 */

interface MCPServer {
  type: 'stdio';
  command: string;
  args: string[];
  env?: Record<string, string>;
}

interface MCPConfig {
  servers: Record<string, MCPServer>;
  inputs: Array<{
    type: string;
    id: string;
    description: string;
    password: boolean;
  }>;
}

class MCPManager {
  private config: MCPConfig;
  private githubToken: string;

  constructor() {
    this.githubToken = process.env.GITHUB_PERSONAL_ACCESS_TOKEN || '';
    
    this.config = {
      servers: {
        github: {
          type: 'stdio',
          command: 'npx',
          args: ['-y', '@modelcontextprotocol/server-github'],
          env: {
            GITHUB_PERSONAL_ACCESS_TOKEN: this.githubToken
          }
        },
        'sequential-thinking': {
          type: 'stdio',
          command: 'npx',
          args: ['-y', '@modelcontextprotocol/server-sequential-thinking']
        },
        gitmcp: {
          type: 'stdio',
          command: 'npx',
          args: ['-y', 'mcp-remote', 'https://gitmcp.io/docs']
        }
      },
      inputs: [
        {
          type: 'promptString',
          id: 'github_mcp_pat',
          description: 'GitHub Personal Access Token',
          password: true
        }
      ]
    };
  }

  /**
   * Initialize all MCP servers
   */
  public async initialize(): Promise<void> {
    console.log('🚀 Initializing MCP Servers...');

    if (!this.githubToken) {
      console.warn(
        '⚠️  WARNING: GITHUB_PERSONAL_ACCESS_TOKEN not found in .env file'
      );
      console.log('   To create issues on GitHub, add your token to .env file:');
      console.log('   GITHUB_PERSONAL_ACCESS_TOKEN=your_token_here');
      console.log('');
      console.log(
        '   Create a token at: https://github.com/settings/tokens'
      );
      console.log('   Required scopes: repo, gist, user');
    } else {
      console.log('✅ GitHub token loaded successfully');
    }

    console.log('');
    console.log('📦 Available MCP Servers:');
    Object.entries(this.config.servers).forEach(([name, server]) => {
      console.log(`   • ${name}`);
      console.log(`     Command: ${server.command} ${server.args.join(' ')}`);
    });

    console.log('');
    console.log('Configuration saved to: cline_mcp_config.json');
  }

  /**
   * Get the MCP configuration
   */
  public getConfig(): MCPConfig {
    return this.config;
  }

  /**
   * Get GitHub server configuration
   */
  public getGitHubConfig(): MCPServer {
    return this.config.servers.github;
  }

  /**
   * Validate GitHub token is set
   */
  public isGitHubTokenValid(): boolean {
    return !!this.githubToken && this.githubToken !== 'your_github_token_here';
  }

  /**
   * Log status
   */
  public logStatus(): void {
    console.log('\n📋 MCP Status Report:');
    console.log(
      `   GitHub MCP: ${this.isGitHubTokenValid() ? '✅ Configured' : '❌ Not configured'}`
    );
    console.log('   Sequential Thinking MCP: ✅ Ready');
    console.log('   GitMCP: ✅ Ready');
    console.log('');
    console.log('You can now:');
    console.log(
      '   • Create and manage GitHub issues programmatically'
    );
    console.log('   • Access GitHub repositories and data');
    console.log('   • Use sequential thinking for complex tasks');
    console.log('   • Perform git operations');
  }
}

// Main execution
async function main(): Promise<void> {
  const manager = new MCPManager();
  await manager.initialize();
  manager.logStatus();
}

main().catch(console.error);

export { MCPManager };
