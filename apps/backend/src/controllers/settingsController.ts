import { Context, Hono } from 'hono'
// import { verify } from 'hono/jwt'
import { getUserPreferences, setUserPreferences } from '~/model/settingsModel';
// import { addHours } from 'date-fns';


export const fetchPreferences = async (c: Context) => {
  const userId = c.get('userId');

  try {
    const preferences = await getUserPreferences(c.env.DATABASE_URL, userId);
    return c.json({ preferences });
  } catch (err) {
    console.error('Error fetching preferences:', err);
    return c.json({ error: 'Failed to fetch preferences' }, 500);
  }
};

export const savePreferences = async (c: Context) => {
  const userId = c.get('userId');
  const { sports, locations } = await c.req.json();

  if (!Array.isArray(sports) || !Array.isArray(locations)) {
    return c.json({ error: 'Invalid format' }, 400);
  }

  try {
    const saved = await setUserPreferences(c.env.DATABASE_URL, userId, sports, locations);
    return c.json({ success: true, preferences: saved });
  } catch (err) {
    console.error('Error saving preferences:', err);
    return c.json({ error: 'Failed to save preferences' }, 500);
  }
};
