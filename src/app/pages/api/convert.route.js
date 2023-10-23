// app/api/convert.route.js

import {promises as fs} from 'fs';
import pandoc from 'node-pandoc';
import {tmpdir} from 'os';
import {join} from 'path';

// The handler function for the API route
export default async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
    return;
  }

  try {
    // Create a temporary directory for the conversion process
    const tempDir = join(tmpdir(), 'conversion');
    await fs.mkdir(tempDir, {recursive: true});

    // Assume the markdown content is sent in the request body
    const markdownContent = req.body.markdown;
    const markdownPath = join(tempDir, 'input.md');
    await fs.writeFile(markdownPath, markdownContent);

    // Prepare arguments for pandoc
    const args = `-f markdown -t docx -o ${join(tempDir, 'output.docx')}`;

    // Convert Markdown to DOCX
    pandoc(markdownPath, args, async (err, result) => {
      if (err) {
        console.error('Error in file conversion: ', err);
        res.status(500).json(
            {error: 'Error during conversion. Please try again.'});
        return;
      }

      // Read the generated DOCX file
      const buf = await fs.readFile(join(tempDir, 'output.docx'));

      // Set headers for downloading the file
      res.setHeader(
          'Content-Disposition', 'attachment; filename="output.docx"');
      res.setHeader(
          'Content-Type',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document');

      // Send the DOCX file as the response
      res.send(buf);
    });
  } catch (error) {
    console.error('Error in /api/convert:', error);
    res.status(500).json({error: 'Internal Server Error'});
  }
};
