import { google } from 'googleapis';
import { GoogleAuth } from 'google-auth-library';

/**
 * Type definition for the payload - adjust according to your data structure
 */
type Payload = Array<Record<string, any>>;

/**
 * Exports data to a Google Spreadsheet using Workload Identity Federation authentication
 * 
 * @param docs - Array of data to export (rows)
 * @param headers - Array of column headers
 * @param spreadSheetID - ID of the Google Spreadsheet
 * @param sheetName - Optional name of the sheet to write to (defaults to first sheet)
 */
export async function ExportDocument(
    docs: Payload,
    headers: Array<string>,
    spreadSheetID: string,
    sheetName?: string
) {
    try {
        // Create auth client using Workload Identity Federation
        const auth = new GoogleAuth({
            scopes: ['https://www.googleapis.com/auth/spreadsheets']
        });

        // Get JWT client
        const authClient = await auth.getClient();

        // Create Google Sheets API client
        const sheets = google.sheets({ version: 'v4', auth: authClient as any });

        // Get sheet metadata to identify sheet ID if sheetName is provided
        let sheetId = 0; // Default to first sheet

        if (sheetName) {
            const spreadsheet = await sheets.spreadsheets.get({
                spreadsheetId: spreadSheetID
            });

            const targetSheet = spreadsheet.data.sheets?.find(
                (sheet) => sheet.properties?.title === sheetName
            );

            if (targetSheet && targetSheet.properties?.sheetId !== undefined) {
                sheetId = targetSheet.properties.sheetId!;
            } else {
                console.warn(`Sheet "${sheetName}" not found. Using first sheet.`);
            }
        }

        // Clear existing content (optional)
        await sheets.spreadsheets.values.clear({
            spreadsheetId: spreadSheetID,
            range: sheetName || 'Sheet1'
        });

        // Prepare data: convert headers and rows to the format expected by Sheets API
        const values = [
            headers, // First row is headers
            ...docs.map(doc => {
                // Map each doc to an array of values in the same order as headers
                return headers.map(header => doc[header] ?? '');
            })
        ];

        // Update the sheet with headers and data
        await sheets.spreadsheets.values.update({
            spreadsheetId: spreadSheetID,
            range: `${sheetName || 'Sheet1'}!A1`,
            valueInputOption: 'RAW',
            requestBody: {
                values
            }
        });

        console.log(`Successfully exported ${docs.length} rows to spreadsheet`);

    } catch (error) {
        console.error('Failed to export to Google Spreadsheet:', error);
        throw error;
    }
}

// Example usage
const myData = [
    { name: 'John', age: 30, email: 'john@example.com' },
    { name: 'Jane', age: 28, email: 'jane@example.com' }
];

const headers = ['name', 'age', 'email'];
const spreadsheetId = '1agc7jJHn4-3Qlv8-_32F7AFwyiBqjJwhiDDqLJrVnHw';

(async () => {
    await ExportDocument(myData, headers, spreadsheetId);
})()