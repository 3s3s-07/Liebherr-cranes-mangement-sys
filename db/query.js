const { getDatabase } = require('@netlify/database');
let database;

// Keep the existing route result contract while using parameterized Postgres queries.
async function query(statement, values = []) {
    let index = 0;
    let text = statement.replace(/\?/g, () => `$${++index}`);
    if (index !== values.length) throw new Error('Query parameter count mismatch');
    const insert = /^\s*INSERT\s/i.test(text);
    if (insert) text = text.trim().replace(/;$/, '') + ' RETURNING id';
    database ||= getDatabase();
    const result = await database.pool.query(text, values);
    const rows = result.rows.map(row => Object.fromEntries(
        Object.entries(row).map(([key, value]) => [key,
            (key === 'id' || key.endsWith('_id')) && typeof value === 'string'
                && /^\d+$/.test(value) && Number.isSafeInteger(Number(value))
                ? Number(value) : value
        ])
    ));
    if (/^\s*(INSERT|UPDATE|DELETE)\s/i.test(text)) {
        return [{ affectedRows: result.rowCount, insertId: rows[0]?.id }];
    }
    return [rows];
}

module.exports = { query, execute: query };
