import { promises as fs } from 'fs';
import { simpleGit } from 'simple-git';

const randomString = Math.random().toString(36).substring(7);
const tempDir = `./temp-repo-${randomString}`;

export async function loadFileFromGit({ repoUrl, filePath, branch = 'main' }) {
  const git = simpleGit();

  try {
    // Clone the repository
    await git.clone(repoUrl, tempDir);

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
