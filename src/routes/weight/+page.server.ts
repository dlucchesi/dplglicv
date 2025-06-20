import type { Actions } from './$types';
import type { PageServerLoad } from './$types';
import pool from '$lib/server/db'; // Import the shared pool
import type { Weight } from '$lib/model/weight';
import {
    type DateValue,
    DateFormatter,
    getLocalTimeZone,
  } from "@internationalized/date"
import fs from 'fs/promises';
import path from 'path';
//  My environment variable for the data path
import { POSTGRES_DB, POSTGRES_USER, POSTGRES_HOST, POSTGRES_PORT, POSTGRES_PASSWORD } from '$env/static/private';

  const df = new DateFormatter("pt-BR", {
    dateStyle: "short",
  });


  export const load: PageServerLoad = async () => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM weight ORDER BY entry_date');
        const retData = result.rows;
    
        // convert the rows to Weight type
        const weightData: Weight[] = retData.sort((a, b) => new Date(a.entry_date).getTime() - new Date(b.entry_date).getTime())
        .map(row => ({
          id: row.id,
          entry: row.entry,
          entryDate: row.entry_date,
          obs: row.obs
        }) as Weight);
    
        return { weightData: weightData };
      } catch (error) {
        console.error('Error loading weightData data:', error);
        return { weightData: [] }; // Return an empty array on error
      }
  };

  export const actions: Actions = {
    default: async ({ request }) => {
      let weight: FormDataEntryValue | null = null;
      let date: FormDataEntryValue | null = null;
      let obs: FormDataEntryValue | null = null;

      const formData = await request.formData();

      weight = formData.get('entry');
      date = formData.get('entryDate');
      obs = formData.get('observation');
      
      let weightNumber: number = 0;

      if (weight && !isNaN(Number(weight))) {
        weightNumber = Number(weight);
      }
      
      console.log('>>>>> Chegou!!!!! ', weightNumber, date, obs);

      if (weightNumber && date){
         

        try {
          const client = await pool.connect();
          try {
            await client.query(
              'INSERT INTO weight (id, entry_date, entry, obs) VALUES (nextval(\'public."weightPk"\'), $1, $2, $3)',
              [date, weightNumber, obs || null]
            );
            // Redirect to the same page to refresh the data
            return { success: true };
          } catch (error) {
            console.error('Error inserting weight data:', error);
            return { success: false, error: 'Failed to insert glucose data' };
          } finally {
            client.release();
          }
        } catch (error) {
          console.error('Error connecting to the database:', error);
          return { success: false, error: 'Database connection error' };
        }
      } else {
        console.error('Invalid glucose data:', weightNumber, date, obs);
        return { success: false, error: 'Invalid glucose data' };
      }
    },
  } satisfies Actions;