import {createWriteStream, promises as fs} from 'fs';
import {NextResponse} from 'next/server';
import pandoc from 'node-pandoc';
import {tmpdir} from 'os';
import {join} from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};


// Handles POST requests to /api/convert
export async function POST(req) {
  try {
    // Create a temporary directory for the conversion process
    const tempDir = join(tmpdir(), 'conversion');
    await fs.promises.mkdir(tempDir, {recursive: true});

    // Assume the markdown content is sent as a stream in the request body
    const markdownPath = join(tempDir, 'input.md');
    const writableStream =
        createWriteStream(markdownPath);  // Adjusted this line
    req.body.pipe(writableStream);

    await new Promise((resolve, reject) => {
      writableStream.on('finish', resolve);
      writableStream.on('error', reject);
    });

    // Prepare arguments for pandoc
    const args = `-f markdown -t docx -o ${join(tempDir, 'output.docx')}`;

    // Convert Markdown to DOCX
    return new Promise((resolve, reject) => {
      pandoc(markdownPath, args, async (err, result) => {
        if (err) {
          console.error('Error in file conversion: ', err);
          resolve(NextResponse.json(
              {error: 'Error during conversion. Please try again.'},
              {status: 500}));
          return;
        }

        // Read the generated DOCX file
        const buf = await fs.readFile(join(tempDir, 'output.docx'));

        // Create a response with the DOCX file
        const res = NextResponse.blob(buf, {
          headers: {
            'Content-Disposition': 'attachment; filename="output.docx"',
            'Content-Type':
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          }
        });
        resolve(res);
      });
    });
  } catch (error) {
    console.error('Error in /api/convert:', error);
    return NextResponse.json({error: 'Internal Server Error'}, {status: 500});
  }
}
