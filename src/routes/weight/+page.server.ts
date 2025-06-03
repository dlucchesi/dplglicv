import type { Actions } from './$types';
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import Papa from 'papaparse';
import {
    type DateValue,
    DateFormatter,
    getLocalTimeZone,
  } from "@internationalized/date"
import fs from 'fs/promises';
import path from 'path';
//  My environment variable for the data path
import { DATA_PATH } from '$env/static/private';
import { number } from 'echarts';

  const df = new DateFormatter("pt-BR", {
    dateStyle: "short",
  });

  export const actions: Actions = {
    insertWeight: async ({ request }) => {
      const formData = await request.formData();
      console.log('[SERVER] Form Data:', formData);
      const weight = formData.get('weight');
      const date = formData.get('date');
      let weightNumber: number = 0;

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

      try {
        // Append the new weight data to the CSV file
        const filePath = path.join(DATA_PATH, 'weight.csv');

        if (weight === null) {
          return { error: 'Weight is required.' };
        }
        const parsedWeight = Number(weight);
        if (isNaN(parsedWeight)) {
          return { error: 'Invalid weight. Please provide a valid number.' };
        }
        weightNumber += parsedWeight;
        console.log('Weight Number:', weightNumber);

        const newWeightData = `${String(year)};${String(month)};${String(day)};${weightNumber}\n`;
        console.log('New weight data to append:', newWeightData);
        await fs.appendFile(filePath, newWeightData);
        console.log('Weight data appended successfully:', newWeightData);

        return redirect(303, '/weight'); // Redirect on success
      } catch (error) {
        console.error('Error:', error);
        return { error: 'Submission failed.' };
      }
    }
  } satisfies Actions;