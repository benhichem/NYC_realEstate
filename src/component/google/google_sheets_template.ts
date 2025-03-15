import { GoogleSpreadsheet } from 'google-spreadsheet';
import { GoogleAuth } from 'google-auth-library';
import { Payload } from '../../types';

/**
 * Exports data to a Google Spreadsheet using Workload Identity Federation authentication
 * 
 * @param docs - Array of data to export (rows)
 * @param headers - Array of column headers
 * @param spreadSheetID - ID of the Google Spreadsheet
 */
export async function ExportDocument(docs: Array<any>, headers: Array<string>, spreadSheetID: string) {
    try {
        // Create auth client using Workload Identity Federation
        // This will automatically use the credentials from the environment
        const auth = new GoogleAuth({
            scopes: ['https://www.googleapis.com/auth/spreadsheets']
        });

        // Get JWT client from GoogleAuth
        const authClient = await auth.getClient();

        // Get credentials info - we'll need the client_email
        const credentials = await auth.getCredentials();

        // Create the Google Spreadsheet instance
        const doc = new GoogleSpreadsheet(spreadSheetID, authClient);


        console.log('==========================================================================================');
        console.log(doc)
        let docInfo = await doc.loadInfo();
        console.log(docInfo)
        console.log('==========================================================================================');
        console.log(doc.title);
        console.log(doc.sheetCount);
        const worksheet = doc.sheetsByIndex[0];
        await worksheet.setHeaderRow(headers)

        await worksheet.addRows(docs).catch((error) => {
            console.log(error)
        })


    } catch (error) {
        console.error('Failed to export to Google Spreadsheet:', error);
        throw error;
    }
}


/* (async () => {
    const myData = [
        { name: 'John', age: 30, email: 'john@example.com' },
        { name: 'Jane', age: 28, email: 'jane@example.com' }
    ];

    const headers = ['name', 'age', 'email'];
    const spreadsheetId = '1agc7jJHn4-3Qlv8-_32F7AFwyiBqjJwhiDDqLJrVnHw';
    await ExportDocument(myData, headers, spreadsheetId)
})() */