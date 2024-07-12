import { promises as fs } from 'fs';
import { simpleGit } from 'simple-git';

await import("dotenv").then((m) => m.config())

const randomString = Math.random().toString(36).substring(7);
const tempDir = `./temp-repo-${randomString}`;

async function writeToGitFile(repoUrl, filePath, content, commitMessage, branch = 'main', auth = {}) {
  let authenticatedUrl = repoUrl;
  const git = simpleGit();

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

  try {
    // Clone the repository if it doesn't exist
    if (!await fs.access(tempDir).then(() => true).catch(() => false)) {
      await git.clone(authenticatedUrl, tempDir);
    }

    // Change to the repository directory
    git.cwd(tempDir);

    // Fetch the latest changes and checkout the specified branch
    await git.fetch('origin');
    await git.checkout(branch);
    await git.pull('origin', branch);

    // Write the content to the file
    await fs.writeFile(`${tempDir}/${filePath}`, content);

    // Stage the changes
    await git.add(filePath);

    // Commit the changes
    await git.commit(commitMessage);

    // Push the changes to the remote repository
    await git.push('origin', branch);

    console.info('Changes successfully pushed to the repository');
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export async function saveKeyValue({ repoUrl = process.env.GIT_REPO_URL, commitMessage = 'updated file content', key, value }) {
  // Usage example
  const filePath = key; // 'cron_action_cache.txt';
  const newContent = value; // 'This is the new content of the file. 2';

  // // Authentication options
  // const authBasic = {
  //   type: 'basic',
  //   username: process.env.GIT_USERNAME,
  //   password: process.env.GIT_PASSWORD
  // };

  const authToken = {
    type: 'token',
    token: process.env.GIT_ACCESS_TOKEN
  };

  // Choose one of the auth methods
  const auth = authToken; // or authBasic

  writeToGitFile(repoUrl, filePath, newContent, commitMessage, 'main', auth)
    .then(() => console.info('File updated successfully'))
    .catch(error => console.error('Failed to update file:', error));
}
