import type { Actions } from './$types';
import type { PageServerLoad } from './$types';
import pool from '$lib/server/db'; // Import the shared pool
import type { Glucose } from '$lib/model/glucose';

export const load: PageServerLoad = async () => {
  try {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT * FROM glucose ORDER BY entry_date DESC');
      const retData = result.rows;

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
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error connecting to the database:', error);
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
        const client = await pool.connect();
        try {
          await client.query(
            'INSERT INTO glucose (id, entry_date, entry, obs) VALUES (nextval(\'public."glucosePk"\'), $1, $2, $3)',
            [date, glucNumber, obs || null]
          );
          // Redirect to the same page to refresh the data
          return { success: true };
        } catch (error) {
          console.error('Error inserting glucose data:', error);
          return { success: false, error: 'Failed to insert glucose data' };
        } finally {
          client.release();
        }
      } catch (error) {
        console.error('Error connecting to the database:', error);
        return { success: false, error: 'Database connection error' };
      }
    } else {
      console.error('Invalid glucose data:', glucNumber, date, obs);
      return { success: false, error: 'Invalid glucose data' };
    }
  },
} satisfies Actions;

