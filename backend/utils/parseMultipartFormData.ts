import { IncomingMessage } from "http";

export async function parseMultipartFormData(
  req: IncomingMessage,
): Promise<{ file: Buffer; filename: string }> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];

    req.on("data", (chunk) => {
      chunks.push(chunk);
    });

    req.on("end", () => {
      try {
        const buffer = Buffer.concat(chunks);
        const boundary = req.headers["content-type"]?.split("boundary=")[1];

        if (!boundary) {
          return reject(new Error("No boundary found in multipart form data"));
        }

        const parts = buffer.toString("binary").split(`--${boundary}`);

        for (const part of parts) {
          if (part.includes("filename=")) {
            const filenameMatch = part.match(/filename="(.+?)"/);
            const filename = filenameMatch ? filenameMatch[1] : "file.csv";

            // Extract file content (after double CRLF)
            const fileStartIndex = part.indexOf("\r\n\r\n") + 4;
            const fileEndIndex = part.lastIndexOf("\r\n");
            const fileContent = part.substring(fileStartIndex, fileEndIndex);

            const file = Buffer.from(fileContent, "binary");

            return resolve({ file, filename });
          }
        }

        reject(new Error("No file found in form data"));
      } catch (error) {
        reject(error);
      }
    });

    req.on("error", reject);
  });
}
