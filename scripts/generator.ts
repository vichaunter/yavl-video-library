import { Project } from 'ts-morph';
import fs from 'fs';
import path from 'path';

function generateApiKeys() {
  const rootPath = path.resolve(__dirname, '..');

  const project = new Project();
  const sourceFile = project.addSourceFileAtPath(
    path.join(rootPath, 'src', 'main', 'api', 'api.ts'),
  );

  const apiClass = sourceFile.getClass('Api');

  if (!apiClass) {
    throw Error(`Api class not found in the source file. ${sourceFile}`);
  }

  const apiKeys = apiClass.getProperties().map((prop) => prop.getName());

  const content = `
    export const apiKeys = ${JSON.stringify(apiKeys, null, 2)};
    
    `;

  const folderPath = path.join(rootPath, 'src', 'generated');
  const filePath = path.join(folderPath, 'apiKeys.ts');

  fs.mkdirSync(folderPath, { recursive: true });
  fs.writeFile(filePath, content, (err) => {
    if (err) {
      console.error('Error writing file:', err);
    } else {
      console.log('File written successfully.');
    }
  });
}
generateApiKeys();
