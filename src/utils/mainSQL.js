const base = `SELECT
  p.id, p.title, p.content, p.created_at, p.updated_at, p.view, p.solved,
  u.nickname, COUNT(DISTINCT c.id) AS comment_count, COUNT(DISTINCT l.id) AS like_count,
  GROUP_CONCAT(DISTINCT t.name) AS tags
  FROM posts p
  JOIN users u ON p.user_id = u.id
  LEFT JOIN comments c ON p.id = c.post_id
  LEFT JOIN likes l ON p.id = l.post_id
  LEFT JOIN post_tags pt ON p.id = pt.post_id
  LEFT JOIN tags t ON pt.tag_id = t.id`;

const groupBy = ` GROUP BY p.id, p.title, p.content, p.created_at, p.updated_at, p.view, p.solved, u.nickname`;

export default { base, groupBy };
