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

  const df = new DateFormatter("pt-BR", {
    dateStyle: "short",
  });

  export const load: PageServerLoad = async () => {
    let csv: any[] = [];
    try {
      // import data from file
      const filePath = path.join(DATA_PATH, 'weight.csv');
      const text = await fs.readFile(filePath, 'utf-8');
      csv = Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true
      }).data;

      // Convert date strings to Date objects
      csv = csv.map((row: any) => {
        let year : number = row.year
        let month : number = row.month
        let day : number = row.day;

        row.date = year + '-' +
          (month < 10 ? '0' + month : month) + '-' +
          (day < 10 ? '0' + day : day);
        return row;
      })
    } catch (error) {
      console.error('Error fetching CSV:', error);
    }
    return { csv };
  };

  export const actions: Actions = {
    insertWeight: async ({ request }) => {
      const formData = await request.formData();
      console.log('[SERVER] Form Data:', formData);
      const weight = formData.get('weight');
      const date = formData.get('date');

      let formattedDate = '';
      if (date) {
        const dateObj = new Date(date.toString());
        formattedDate = df.format(dateObj);
      }

      try {
        const response = await fetch('http://localhost:8000/insert_weight', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ "weight" : weight, "date" : formattedDate })
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        return redirect(303, '/weight'); // Redirect on success
      } catch (error) {
        console.error('Error:', error);
        return { error: 'Submission failed.' };
      }
    }
  } satisfies Actions;
