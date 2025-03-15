/* import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import Constants from '../config/constants';
import {
    Payload,
    source
} from '../../types';

export async function ExportDocument(docs: Payload, headers: Array<string>, spreadSHeetID: string) {

    const serviceAccountAuth = new JWT({
        email: Constants.CLIENT_EMAIL,
        key: Constants.PRIVATE_KEY,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    const doc = new GoogleSpreadsheet(spreadSHeetID, serviceAccountAuth);
    await doc.loadInfo();
    const worksheet = doc.sheetsByIndex[0];
    await worksheet.setHeaderRow(headers)

    await worksheet.addRows(docs).catch((error) => {
        console.log(error)
    })
} */


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
export async function ExportDocument(docs: Payload, headers: Array<string>, spreadSheetID: string) {
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


