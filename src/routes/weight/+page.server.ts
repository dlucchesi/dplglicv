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
import { COUNT_TO_SHOW } from '$env/static/private';

  const df = new DateFormatter("pt-BR", {
    dateStyle: "short",
  });

  export const load: PageServerLoad = async () => {
    try {
      // Read the CSV file limiting to the last COUNT_TO_SHOW entries
      const filePath = path.join(DATA_PATH, 'weight.csv');
      let data = await fs
        .readFile(filePath, 'utf8')
        .catch(() => ''); // Handle file not found or empty file

      // Split into lines and keep header + last COUNT_TO_SHOW rows
      const lines = data.split('\n');
      if (lines.length > 1) {
        const header = lines[0];
        const lastRows = lines.slice(-COUNT_TO_SHOW);
        data = [header, ...lastRows].join('\n');
      }
      // Parse the CSV data
      const parsedData = Papa.parse(data, {
        header: true,
        delimiter: ';',
        skipEmptyLines: true,
      });
      // Convert the parsed data to a more usable format
      const weightData = parsedData.data.map((row: any) => {
        const year = parseInt(row.year, 10);
        const month = parseInt(row.month, 10); // JS months are 0-indexed
        const day = parseInt(row.day, 10);
        const weight = parseFloat(row.weight);

        return {
          year,
          month,
          day,
          weight,
        };
      }
      );
      return {
        weightData
      }
    } catch (error) {
      console.error('Error loading weight data:', error);
      return { error: 'Failed to load weight data.' };
    }
  };

  export const actions: Actions = {
    insertWeight: async ({ request }) => {
      const formData = await request.formData();
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

        const newWeightData = `${String(year)};${String(month)};${String(day)};${weightNumber}\n`;
        await fs.appendFile(filePath, newWeightData);

        return redirect(303, '/weight'); // Redirect on success
      } catch (error) {
        return { error: 'Submission failed.' };
      }
    }
  } satisfies Actions;