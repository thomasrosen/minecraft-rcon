import { promises as fs } from 'fs';
import { simpleGit } from 'simple-git';

const randomString = Math.random().toString(36).substring(7);
const tempDir = `./temp-repo-${randomString}`;

export async function loadFileFromGit({ repoUrl, filePath, branch = 'main' }) {
  const git = simpleGit();

  const auth = {
    type: 'token',
    token: process.env.GITHUB_TOKEN
  };

  // Apply authentication
  if (auth.type === 'basic') {
    const { username, password } = auth;
    const urlObj = new URL(repoUrl);
    urlObj.username = encodeURIComponent(username);
    urlObj.password = encodeURIComponent(password);
    authenticatedUrl = urlObj.toString();
  } else if (auth.type === 'token') {
    const { token } = auth;
    const urlObj = new URL(repoUrl);
    urlObj.username = 'oauth2';
    urlObj.password = encodeURIComponent(token);
    authenticatedUrl = urlObj.toString();
  }

  console.log('repoUrl', String(authenticatedUrl).replace('http', '???'))

  try {
    // Clone the repository if it doesn't exist
    if (!await fs.access(tempDir).then(() => true).catch(() => false)) {
      await git.clone(authenticatedUrl, tempDir);
    }

    // Change to the specified branch
    await git.cwd(tempDir).checkout(branch);

    // Read the file contents
    const fileContent = await fs.readFile(`${tempDir}/${filePath}`, 'utf8');

    // Clean up: remove the temporary directory
    await fs.rm(tempDir, { recursive: true, force: true });

    return fileContent;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
