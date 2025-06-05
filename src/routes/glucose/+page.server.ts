import type { Actions } from './$types';
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import Papa from 'papaparse';

import fs from 'fs/promises';
import path from 'path';
//  My environment variable for the data path
import { DATA_PATH } from '$env/static/private';

export const load: PageServerLoad = async () => {
  try {
    // Read the CSV file limiting to the last COUNT_TO_SHOW entries
    const filePath = path.join(DATA_PATH, 'glic.csv');
    let data = await fs
      .readFile(filePath, 'utf8')
      .catch(() => ''); // Handle file not found or empty file

    // Parse the CSV data
    const parsedData = Papa.parse(data, {
      header: true,
      delimiter: ';',
      skipEmptyLines: true,
    });
    // Convert the parsed data to a more usable format
    const glucData = parsedData.data.map((row: any) => {
      const year = parseInt(row.year, 10);
      const month = parseInt(row.month, 10); // JS months are 0-indexed
      const day = parseInt(row.day, 10);
      const hour = parseInt(row.hour, 10);
      const minute = parseInt(row.minute, 10);
      const glucose = parseFloat(row.glucose);
      const obs = row.obs || '';
      const date = new Date(year, month, day, hour, minute);
      const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;

      return {
        year: year,
        month: month,
        day: day,
        hour: hour,
        minute: minute,
        glucose: glucose,
        obs: obs,
        date: date,
        time: time,
      };
    }
    );
    return {
      glucData: glucData
    }
  } catch (error) {
    console.error('Error loading weight data:', error);
    return { error: 'Failed to load weight data.' };
  }
};

export const actions = {
  insertGluc: async ({ request }) => {
    const formData = await request.formData();
    const glucose = formData.get('glucose');
    const date = formData.get('date');
    const time = formData.get('time');
    const obs = formData.get('obs');
    let glucNumber: number = 0;

    // extract year, month, and day from the date string
    if (typeof date !== 'string') {
      return { error: 'Invalid date. Please provide a valid date string.' };
    }
    const dateParts = date.split('-');
    if (dateParts.length !== 3) {
      return { error: 'Invalid date format. Please use YYYY-MM-DD.' };
    }
    const year = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10) 
    const day = parseInt(dateParts[2], 10);

    // Extract time parts
    if (typeof time !== 'string') {
      return { error: 'Invalid time. Please provide a valid time string.' };
    }
    const timeParts = time.split(':');
    if (timeParts.length !== 2) {
      return { error: 'Invalid time format. Please use HH:MM.' };
    }
    const hour = parseInt(timeParts[0], 10);
    const minute = parseInt(timeParts[1], 10);

    try {
      // Append the new weight data to the CSV file
      const filePath = path.join(DATA_PATH, 'glic.csv');

      if (glucose === null) {
        return { error: 'Weight is required.' };
      }
      const glucNumber = Number(glucose);
      if (isNaN(glucNumber)) {
        return { error: 'Invalid weight. Please provide a valid number.' };
      }
      
      const newGlucData = `${String(year)};${String(month)};${String(day)};${String(hour)};${String(minute)};${glucNumber};${obs}\n`;
      await fs.appendFile(filePath, newGlucData);

      return redirect(303, '/glucose'); // Redirect on success
    } catch (error) {
      return { error: 'Submission failed.' };
    }
  }
} satisfies Actions;