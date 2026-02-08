import { ServerResponse } from "http";
import { AuthenticatedRequest } from "../interfaces/request.interface";
import { sendJson } from "../utils/response";
import { parseJsonBody } from "../utils/bodyParser";
import { parseCsvLine } from "../utils/parseCsvLine";

import {
  getArtistsService,
  createArtistService,
  updateArtistService,
  deleteArtistService,
} from "../services/artist.service";

import {
  validateCreateArtist,
  validateUpdateArtist,
} from "../validators/artist.validator";
import { parseMultipartFormData } from "../utils/parseMultipartFormData";
import { CsvRow } from "../interfaces/csv.interfaces";

export async function getAllArtistsController(
  req: AuthenticatedRequest,
  res: ServerResponse,
) {
  try {
    const url = new URL(req.url!, `http://${req.headers.host}`);
    const limit = Math.min(
      parseInt(url.searchParams.get("limit") || "50"),
      100,
    );
    const offset = parseInt(url.searchParams.get("offset") || "0");

    const artists = await getArtistsService(limit, offset);
    return sendJson(res, 200, { artists, limit, offset });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return sendJson(res, 500, { error: err.message });
    }
    return sendJson(res, 500, { error: "Internal error" });
  }
}

export async function createArtistController(
  req: AuthenticatedRequest,
  res: ServerResponse,
) {
  try {
    const body = await parseJsonBody<unknown>(req);
    validateCreateArtist(body);

    const artist = await createArtistService(body);
    return sendJson(res, 201, artist);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return sendJson(res, 400, { error: error.message });
    }
    return sendJson(res, 500, { error: "Internal error" });
  }
}

export async function updateArtistController(
  req: AuthenticatedRequest,
  res: ServerResponse,
  id: number,
) {
  try {
    const body = await parseJsonBody<unknown>(req);
    validateUpdateArtist(body);
    const artist = await updateArtistService(id, body);
    return sendJson(res, 200, artist);
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === "Artist not found") {
        return sendJson(res, 404, { error: error.message });
      }
      return sendJson(res, 400, { error: error.message });
    }
    return sendJson(res, 500, { error: "Internal error" });
  }
}

export async function deleteArtistController(
  _req: AuthenticatedRequest,
  res: ServerResponse,
  id: number,
) {
  try {
    await deleteArtistService(id);
    return sendJson(res, 200, { message: "Artist deleted successfully" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === "Artist not found") {
        return sendJson(res, 404, { error: error.message });
      }
      return sendJson(res, 400, { error: error.message });
    }
    return sendJson(res, 500, { error: "Internal error" });
  }
}

export async function importArtistCsvController(
  req: AuthenticatedRequest,
  res: ServerResponse,
) {
  try {
    // Parse multipart form data
    const { file, filename } = await parseMultipartFormData(req);

    if (!file) {
      return sendJson(res, 400, { error: "No file uploaded" });
    }

    if (!filename.endsWith(".csv")) {
      return sendJson(res, 400, { error: "File must be a CSV" });
    }

    // Parse CSV
    const csvText = file.toString("utf-8");
    const lines = csvText.split("\n").filter((line) => line.trim());

    if (lines.length < 2) {
      return sendJson(res, 400, { error: "CSV file is empty" });
    }

    // Parse header
    const headers = lines[0]
      .split(",")
      .map((h) => h.trim().replace(/^"|"$/g, ""));

    // Validate headers
    const requiredHeaders = [
      "name",
      "dob",
      "gender",
      "address",
      "first_release_year",
      "no_of_albums_released",
    ];
    const missingHeaders = requiredHeaders.filter((h) => !headers.includes(h));

    if (missingHeaders.length > 0) {
      return sendJson(res, 400, {
        error: `Missing required columns: ${missingHeaders.join(", ")}`,
      });
    }

    // Parse rows
    const rows: CsvRow[] = [];
    const errors: string[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (!line.trim()) continue;

      const values = parseCsvLine(line);

      if (values.length !== headers.length) {
        errors.push(`Row ${i + 1}: Column count mismatch`);
        continue;
      }

      const row: any = {};
      headers.forEach((header, index) => {
        row[header] = values[index];
      });

      rows.push(row);
    }

    // Import artists
    let imported = 0;
    let failed = 0;

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];

      try {
        // Validate row data
        if (!row.name || !row.dob || !row.gender || !row.address) {
          errors.push(`Row ${i + 2}: Missing required fields`);
          failed++;
          continue;
        }

        if (!["male", "female", "other"].includes(row.gender.toLowerCase())) {
          errors.push(`Row ${i + 2}: Invalid gender value`);
          failed++;
          continue;
        }

        const firstReleaseYear = parseInt(row.first_release_year);
        const noOfAlbums = parseInt(row.no_of_albums_released);

        if (
          isNaN(firstReleaseYear) ||
          firstReleaseYear < 1900 ||
          firstReleaseYear > new Date().getFullYear()
        ) {
          errors.push(`Row ${i + 2}: Invalid first_release_year`);
          failed++;
          continue;
        }

        if (isNaN(noOfAlbums) || noOfAlbums < 0) {
          errors.push(`Row ${i + 2}: Invalid no_of_albums_released`);
          failed++;
          continue;
        }

        await createArtistService({
          name: row.name.trim(),
          dob: row.dob.trim(),
          gender: row.gender.toLowerCase() as "male" | "female" | "other",
          address: row.address.trim(),
          first_release_year: firstReleaseYear,
          no_of_albums_released: noOfAlbums,
        });

        imported++;
      } catch (error) {
        errors.push(
          `Row ${i + 2}: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
        failed++;
      }
    }

    return sendJson(res, 200, {
      success: true,
      imported,
      failed,
      errors: errors.slice(0, 10), // Return first 10 errors only
    });
  } catch (error) {
    return sendJson(res, 500, {
      error: error instanceof Error ? error.message : "Failed to import CSV",
    });
  }
}

export async function exportArtistCsvController(
  req: AuthenticatedRequest,
  res: ServerResponse,
) {
  try {
    const artists = await getArtistsService(1000, 0);

    // Build CSV
    const headers = [
      "id",
      "name",
      "dob",
      "gender",
      "address",
      "first_release_year",
      "no_of_albums_released",
      "created_at",
    ];
    const csvLines = [headers.join(",")];

    for (const artist of artists) {
      const row = [
        artist.id,
        `"${artist.name}"`,
        artist.dob,
        artist.gender,
        `"${artist.address}"`,
        artist.first_release_year,
        artist.no_of_albums_released,
        artist.created_at,
      ];
      csvLines.push(row.join(","));
    }

    const csv = csvLines.join("\n");

    res.writeHead(200, {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="artists-${new Date().toISOString().split("T")[0]}.csv"`,
    });
    res.end(csv);
  } catch (error) {
    return sendJson(res, 500, { error: "Failed to export CSV" });
  }
}
