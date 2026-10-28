import { Pool, type QueryResultRow } from '@neondatabase/serverless';
import {
  StoredFeedback,
  StoredContact,
  FeedbackFilterOptions,
  ContactFilterOptions,
  FeedbackSummaryKPIs,
  IFeedbackRepository,
  IContactRepository,
} from './types';

const MAX_LIST_ROWS = 500;

function getDatabaseUrl(): string | undefined {
  return (
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL_NON_POOLING ||
    process.env.POSTGRES_PRISMA_URL
  );
}

export function isPostgresConfigured(): boolean {
  return !!getDatabaseUrl();
}

/**
 * One pool per server instance, reused across requests.
 */
let sharedPool: Pool | null = null;

function getPool(): Pool {
  if (!sharedPool) {
    sharedPool = new Pool({ connectionString: getDatabaseUrl() });
  }
  return sharedPool;
}

/**
 * Lazy table initializer: runs once per instance; a failed attempt is retried on the next request.
 */
let tablesReady: Promise<void> | null = null;

function ensureTablesExist(): Promise<void> {
  if (!tablesReady) {
    tablesReady = (async () => {
      const pool = getPool();
      await pool.query(`
        CREATE TABLE IF NOT EXISTS fillvyn_feedbacks (
          id VARCHAR(64) PRIMARY KEY,
          rating INT NOT NULL,
          category VARCHAR(64) NOT NULL,
          persona VARCHAR(64) NOT NULL,
          feedback_text TEXT NOT NULL,
          nps_score INT,
          email VARCHAR(255),
          image_url TEXT,
          status VARCHAR(32) NOT NULL DEFAULT 'new',
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        ALTER TABLE fillvyn_feedbacks ADD COLUMN IF NOT EXISTS image_url TEXT;
        CREATE INDEX IF NOT EXISTS idx_feedbacks_created_at ON fillvyn_feedbacks(created_at DESC);
        CREATE INDEX IF NOT EXISTS idx_feedbacks_rating ON fillvyn_feedbacks(rating);
      `);
      await pool.query(`
        CREATE TABLE IF NOT EXISTS fillvyn_contacts (
          id VARCHAR(64) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          category VARCHAR(64) NOT NULL,
          subject VARCHAR(255) NOT NULL,
          message TEXT NOT NULL,
          status VARCHAR(32) NOT NULL DEFAULT 'new',
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON fillvyn_contacts(created_at DESC);
      `);
    })().catch((err) => {
      tablesReady = null;
      console.error('Error initializing Postgres tables:', err);
      throw err;
    });
  }
  return tablesReady;
}

// List queries skip the (potentially multi-megabyte) image column and only report whether one exists.
const FEEDBACK_LIST_COLUMNS =
  'id, rating, category, persona, feedback_text, nps_score, email, status, created_at, (image_url IS NOT NULL) AS has_image';

function mapFeedbackRow(row: QueryResultRow): StoredFeedback {
  return {
    id: row.id,
    rating: row.rating,
    category: row.category,
    persona: row.persona,
    feedbackText: row.feedback_text,
    npsScore: row.nps_score ?? undefined,
    email: row.email ?? undefined,
    imageUrl: row.image_url ?? undefined,
    hasImage: row.has_image ?? !!row.image_url,
    status: row.status,
    timestamp: new Date(row.created_at).toISOString(),
  };
}

function mapContactRow(row: QueryResultRow): StoredContact {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    category: row.category,
    subject: row.subject,
    message: row.message,
    status: row.status,
    timestamp: new Date(row.created_at).toISOString(),
  };
}

/**
 * SRP & LSP: PostgresFeedbackRepository implements IFeedbackRepository using Vercel Postgres / Neon.
 */
export class PostgresFeedbackRepository implements IFeedbackRepository {
  async save(
    feedback: Omit<StoredFeedback, 'id' | 'timestamp' | 'status'> & { id?: string }
  ): Promise<StoredFeedback> {
    await ensureTablesExist();
    const id = feedback.id || `FDB-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const timestamp = new Date().toISOString();
    const status = 'new';

    await getPool().query(
      `INSERT INTO fillvyn_feedbacks (id, rating, category, persona, feedback_text, nps_score, email, image_url, status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        id,
        feedback.rating,
        feedback.category,
        feedback.persona,
        feedback.feedbackText,
        feedback.npsScore ?? null,
        feedback.email ?? null,
        feedback.imageUrl ?? null,
        status,
        timestamp,
      ]
    );

    return {
      ...feedback,
      id,
      timestamp,
      status,
    };
  }

  async findAll(options?: FeedbackFilterOptions): Promise<StoredFeedback[]> {
    await ensureTablesExist();
    let query = `SELECT ${FEEDBACK_LIST_COLUMNS} FROM fillvyn_feedbacks WHERE 1=1`;
    const params: (string | number)[] = [];

    if (options?.rating !== undefined && options.rating > 0) {
      params.push(options.rating);
      query += ` AND rating = $${params.length}`;
    }

    if (options?.category && options.category !== 'all') {
      params.push(options.category);
      query += ` AND category = $${params.length}`;
    }

    if (options?.persona && options.persona !== 'all') {
      params.push(options.persona);
      query += ` AND persona = $${params.length}`;
    }

    if (options?.status && options.status !== 'all') {
      params.push(options.status);
      query += ` AND status = $${params.length}`;
    }

    if (options?.search && options.search.trim().length > 0) {
      params.push(`%${options.search.toLowerCase().trim()}%`);
      query += ` AND (LOWER(feedback_text) LIKE $${params.length} OR LOWER(id) LIKE $${params.length} OR LOWER(COALESCE(email, '')) LIKE $${params.length})`;
    }

    query += ` ORDER BY created_at DESC LIMIT ${MAX_LIST_ROWS}`;

    const result = await getPool().query(query, params);
    return result.rows.map(mapFeedbackRow);
  }

  async findById(id: string): Promise<StoredFeedback | null> {
    await ensureTablesExist();
    const result = await getPool().query('SELECT * FROM fillvyn_feedbacks WHERE id = $1', [id]);
    return result.rows.length === 0 ? null : mapFeedbackRow(result.rows[0]);
  }

  async updateStatus(id: string, status: StoredFeedback['status']): Promise<StoredFeedback | null> {
    await ensureTablesExist();
    const result = await getPool().query(
      `UPDATE fillvyn_feedbacks SET status = $1 WHERE id = $2 RETURNING ${FEEDBACK_LIST_COLUMNS}`,
      [status, id]
    );
    return result.rows.length === 0 ? null : mapFeedbackRow(result.rows[0]);
  }

  async delete(id: string): Promise<boolean> {
    await ensureTablesExist();
    const result = await getPool().query('DELETE FROM fillvyn_feedbacks WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  }

  async getSummaryKPIs(): Promise<FeedbackSummaryKPIs> {
    await ensureTablesExist();
    const pool = getPool();

    const [totals, ratings, categories, personas] = await Promise.all([
      pool.query(`
        SELECT
          COUNT(*)::int AS total,
          COALESCE(AVG(rating), 0)::float AS avg_rating,
          COUNT(nps_score)::int AS nps_count,
          COUNT(*) FILTER (WHERE nps_score >= 9)::int AS promoters,
          COUNT(*) FILTER (WHERE nps_score <= 6)::int AS detractors
        FROM fillvyn_feedbacks
      `),
      pool.query('SELECT rating, COUNT(*)::int AS count FROM fillvyn_feedbacks GROUP BY rating'),
      pool.query('SELECT category, COUNT(*)::int AS count FROM fillvyn_feedbacks GROUP BY category'),
      pool.query('SELECT persona, COUNT(*)::int AS count FROM fillvyn_feedbacks GROUP BY persona'),
    ]);

    const { total, avg_rating, nps_count, promoters, detractors } = totals.rows[0];

    const ratingDistribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    for (const row of ratings.rows) ratingDistribution[row.rating] = row.count;

    const categoryDistribution: Record<string, number> = {};
    for (const row of categories.rows) categoryDistribution[row.category] = row.count;

    const personaDistribution: Record<string, number> = {};
    for (const row of personas.rows) personaDistribution[row.persona] = row.count;

    return {
      total,
      averageRating: total > 0 ? Number(Number(avg_rating).toFixed(1)) : 0,
      npsScore: total === 0 ? 0 : nps_count > 0 ? Math.round(((promoters - detractors) / nps_count) * 100) : 100,
      ratingDistribution,
      categoryDistribution,
      personaDistribution,
    };
  }
}

/**
 * SRP & LSP: PostgresContactRepository implements IContactRepository using Vercel Postgres / Neon.
 */
export class PostgresContactRepository implements IContactRepository {
  async save(
    contact: Omit<StoredContact, 'id' | 'timestamp' | 'status'> & { id?: string }
  ): Promise<StoredContact> {
    await ensureTablesExist();
    const id = contact.id || `FLV-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const timestamp = new Date().toISOString();
    const status = 'new';

    await getPool().query(
      `INSERT INTO fillvyn_contacts (id, name, email, category, subject, message, status, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [id, contact.name, contact.email, contact.category, contact.subject, contact.message, status, timestamp]
    );

    return {
      ...contact,
      id,
      timestamp,
      status,
    };
  }

  async findAll(options?: ContactFilterOptions): Promise<StoredContact[]> {
    await ensureTablesExist();
    let query = 'SELECT * FROM fillvyn_contacts WHERE 1=1';
    const params: string[] = [];

    if (options?.category && options.category !== 'all') {
      params.push(options.category);
      query += ` AND category = $${params.length}`;
    }

    if (options?.status && options.status !== 'all') {
      params.push(options.status);
      query += ` AND status = $${params.length}`;
    }

    if (options?.search && options.search.trim().length > 0) {
      params.push(`%${options.search.toLowerCase().trim()}%`);
      query += ` AND (LOWER(name) LIKE $${params.length} OR LOWER(email) LIKE $${params.length} OR LOWER(subject) LIKE $${params.length} OR LOWER(message) LIKE $${params.length} OR LOWER(id) LIKE $${params.length})`;
    }

    query += ` ORDER BY created_at DESC LIMIT ${MAX_LIST_ROWS}`;

    const result = await getPool().query(query, params);
    return result.rows.map(mapContactRow);
  }

  async findById(id: string): Promise<StoredContact | null> {
    await ensureTablesExist();
    const result = await getPool().query('SELECT * FROM fillvyn_contacts WHERE id = $1', [id]);
    return result.rows.length === 0 ? null : mapContactRow(result.rows[0]);
  }

  async updateStatus(id: string, status: StoredContact['status']): Promise<StoredContact | null> {
    await ensureTablesExist();
    const result = await getPool().query(
      'UPDATE fillvyn_contacts SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    return result.rows.length === 0 ? null : mapContactRow(result.rows[0]);
  }

  async delete(id: string): Promise<boolean> {
    await ensureTablesExist();
    const result = await getPool().query('DELETE FROM fillvyn_contacts WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  }
}
