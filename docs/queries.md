2. Find user by email
```
SELECT * FROM "users" WHERE "email" = 'user@test.com';
```
3. Update avatar for user
```
UPDATE "users"
SET "avatar" = '/uploads/avatars/new_pic.jpg'
WHERE "user_id" = 5;
```
4. Unlike post

```
DELETE FROM "likes"
WHERE "user_id" = 1 AND "post_id" = 42;
```
5. Get user's profile + user's country
```
SELECT 
    u.user_id, 
    u.username, 
    u.avatar, 
    c.country_name 
FROM "users" u
LEFT JOIN "countries" c ON u.country_id = c.country_id
WHERE u.user_id = 1;
```
6. Get all comments for posts with name of author
```
SELECT 
    c.comment_id, 
    c.comment_text, 
    c.created_at, 
    u.username, 
    u.avatar
FROM "comments" c
JOIN "users" u ON c.user_id = u.user_id
WHERE c.post_id = 10
ORDER BY c.created_at ASC;
```
7. Who is liked direct post
```
SQL
SELECT u.username, u.avatar 
FROM "likes" l
JOIN "users" u ON l.user_id = u.user_id
WHERE l.post_id = 10;
```

8. Feed
```

SELECT 
    p.post_id,
    p.caption,
    p.imageUrl,
    p.likes_count,
    u.username AS author_name,
    u.avatar AS author_avatar,
    CASE 
        WHEN l.user_id IS NOT NULL THEN true 
        ELSE false 
    END AS is_liked_by_me
FROM "posts" p
JOIN "users" u ON p.user_id = u.user_id
LEFT JOIN "likes" l ON p.post_id = l.post_id AND l.user_id = 1
ORDER BY p.created_at DESC
LIMIT 20;
```
9. Feed (only my following)
```
SELECT 
    p.*, 
    u.username 
FROM "posts" p
JOIN "users" u ON p.user_id = u.user_id
WHERE p.user_id IN (
    SELECT following_id 
    FROM "followers" 
    WHERE follower_id = 5
)
ORDER BY p.created_at DESC;
```
10. Top activity users by posts 
```
SELECT 
    u.username, 
    COUNT(p.post_id) as total_posts 
FROM "users" u
LEFT JOIN "posts" p ON u.user_id = p.user_id
GROUP BY u.user_id, u.username
ORDER BY total_posts DESC
LIMIT 10;
```
11. Analytic for countries (Where is the most users ?)
```
SQL
SELECT 
    c.country_name, 
    COUNT(u.user_id) as user_count
FROM "countries" c
LEFT JOIN "users" u ON c.country_id = u.country_id
GROUP BY c.country_name
ORDER BY user_count DESC;
```
12. Repair Query: Recount count likes

**If was some problems.**
```
UPDATE "posts" p
SET likes_count = (
    SELECT COUNT(*) 
    FROM "likes" l 
    WHERE l.post_id = p.post_id
);
```