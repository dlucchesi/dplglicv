import type { Actions } from './$types';
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { Pool } from 'pg';
import { POSTGRES_DB, POSTGRES_USER, POSTGRES_HOST, POSTGRES_PORT, POSTGRES_PASSWORD } from '$env/static/private';
import type { Glucose } from '$lib/model/glucose';




export const load: PageServerLoad = async () => {
  try {
    // Connect to postgres database in 127.0.0.1 database db_dplglic table glucose
    const pool = new Pool({
      host: POSTGRES_HOST,
      database: POSTGRES_DB,
      user: POSTGRES_USER,
      password: POSTGRES_PASSWORD,
      port: Number(POSTGRES_PORT) || 5432, // Default port is 5432
    });

    const result = await pool.query('SELECT * FROM glucose ORDER BY entry_date DESC');
    const retData = result.rows;

    await pool.end();
    // convert the rows to Glucose type
    const glucoseData: Glucose[] = retData.map(row => ({
      id: row.id,
      entry: row.entry,
      entryDate: row.entry_date,
      obs: row.obs
    }) as Glucose);

    return { glucoseData: glucoseData };
  } catch (error) {
    console.error('Error loading glucose data:', error);
    return { glucoseData: [] }; // Return an empty array on error
  }
};

export const actions = {
  default: async ({ request }) => {
    let glucose: FormDataEntryValue | null = null;
    let date: FormDataEntryValue | null = null;
    let obs: FormDataEntryValue | null = null;

    const formData = await request.formData();

    glucose = formData.get('entry');
    date = formData.get('entryDate');
    obs = formData.get('observation');
    
    let glucNumber: number = 0;

    if (glucose && !isNaN(Number(glucose))) {
      glucNumber = Number(glucose);
    }
    
    if (glucNumber && date){
      try {
        const pool = new Pool({
          host: POSTGRES_HOST,
          database: POSTGRES_DB,
          user: POSTGRES_USER,
          password: POSTGRES_PASSWORD,
          port: Number(POSTGRES_PORT) || 5432, // Default port is 5432
        });
        await pool.query(
          'INSERT INTO glucose (id, entry_date, entry, obs) VALUES (nextval(\'public."glucosePk"\'), $1, $2, $3)',
          [date, glucNumber, obs || null]
        );
        await pool.end();
        // Redirect to the same page to refresh the data
        return { success: true };
      } catch (error) {
        console.error('Error inserting glucose data:', error);
        return { success: false, error: 'Failed to insert glucose data' };
      }
    } else {
      console.error('Invalid glucose data:', glucNumber, date, obs);
      return { success: false, error: 'Invalid glucose data' };
    }
  },
} satisfies Actions;

