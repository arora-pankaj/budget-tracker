import type {PageServerLoad} from './$types';
import type {Transaction} from '$lib/db/db';
import db from '$lib/db/db';

export const load: PageServerLoad = (async () => {
  try {
    return toData(await db.getAllTransactions());
  } catch (err) {
    console.error(`Something went wrong trying to find the documents: ${err}\n`);
    return toData([]);
  }
});

const toData = (transactions: Transaction[]) => ({transactions});
