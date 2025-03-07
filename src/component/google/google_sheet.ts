import { GoogleSpreadsheet } from 'google-spreadsheet';
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
}