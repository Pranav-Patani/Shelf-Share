import { createClient } from '@supabase/supabase-js';
import { SUPABASE_TOKEN, SUPABASE_URL } from './config';

const supabaseUrl = SUPABASE_URL;
const supabaseAnonKey = SUPABASE_TOKEN;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

function generateShortId() {
  return crypto.randomUUID().replace(/-/g, '').slice(0, 7);
}

export async function createShortUrlId({ id, collectionName, books }) {
  try {
    const { data: existingUrl, error: queryError } = await supabase
      .from('url_mappings')
      .select('*')
      .eq('collection_id', id)
      .single();

    if (queryError && queryError.code !== 'PGRST116') {
      throw queryError;
    }

    if (existingUrl) {
      return existingUrl.short_id;
    }

    const shortId = generateShortId();

    const { error } = await supabase
      .from('url_mappings')
      .insert({
        short_id: shortId,
        collection_id: id,
        collection_name: collectionName,
        books: books,
      })
      .select()
      .single();

    if (error) throw error;

    return shortId;
  } catch (error) {
    console.error('Error creating short URL:', error);
    throw error;
  }
}

export async function getOriginalUrlParams(shortId) {
  try {
    const { data, error } = await supabase
      .from('url_mappings')
      .select('*')
      .eq('short_id', shortId)
      .single();

    if (error) throw error;
    if (!data) throw new Error('Short URL not found');

    return {
      collectionId: data.collection_id,
      collectionName: data.collection_name,
      books: data.books,
    };
  } catch (error) {
    console.error('Error retrieving URL data:', error);
    throw error;
  }
}

export const deleteSupabseRow = async id => {
  const { error } = await supabase
    .from('url_mappings')
    .delete()
    .eq('collection_id', id);

  if (error) {
    console.error('Error deleting row:', error.message);
    return;
  }
};
