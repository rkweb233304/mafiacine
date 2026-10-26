import { google } from 'googleapis';

const sheets = google.sheets('v4');

export async function getSheetData(spreadsheetId: string, range: string, auth: any) {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
    auth,
  });
  return response.data.values;
}
