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
   
   Бізнес-питання: Як отримати пости лише від тих людей, на кого підписаний конкретний користувач (наприклад, ID = 1), відсортовані за новизною?
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

Пояснення:

Вибірка даних поста та імені автора.

Фільтрація WHERE IN: вибираємо пости тільки тих авторів, чиї ID знаходяться у списку підписок (following_id) користувача з ID 1.

Сортування DESC (свіжі пости зверху).


Приклад виводу: 
                
                | post_id | caption | author | likes_count | created_at | 
                |---------|------------------|-------------|-------------|
                | 105 | My new car! | elon_musk | 3420 | 2024-02-10 14:30:00 | 
                | 102 | Coding vibes... | tech_guy | 12 | 2024-02-10 12:00:00 |
10. Top activity users by posts 

Бізнес-питання: Хто є нашими топ-авторами на основі сумарної кількості лайків, які вони отримали на всіх своїх постах?
```
SELECT 
    u.username,
    COUNT(p.post_id) as total_posts,
    SUM(p.likes_count) as total_likes_received
FROM users u
JOIN posts p ON u.user_id = p.user_id
GROUP BY u.user_id, u.username
ORDER BY total_likes_received DESC
LIMIT 5;
```

Пояснення:

JOIN таблиць користувачів та постів.

Агрегація COUNT(p.post_id): скільки всього постів зробив юзер.

Агрегація SUM(p.likes_count): сума всіх лайків з усіх постів цього юзера.

Сортування за загальною популярністю.

Приклад виводу: 


                | username | total_posts | total_likes_received | 
                |-------------|-------------|------------| 
                | kim_k       | 120         | 50400     | 
                | travel_blog | 45          | 12300     | 
                | chef_john   | 200         | 8500      |
11. ### Географічний розподіл користувачів

**Бізнес-питання:**
З яких країн походять наші користувачі і яка країна є найбільш активною за кількістю реєстрацій?

**SQL-запит:**
```sql
SELECT 
    c.country_name, 
    COUNT(u.user_id) as total_users,
    ROUND(COUNT(u.user_id) * 100.0 / (SELECT COUNT(*) FROM users), 2) as percentage
FROM countries c
LEFT JOIN users u ON c.country_id = u.country_id
GROUP BY c.country_id, c.country_name
HAVING COUNT(u.user_id) > 0
ORDER BY total_users DESC;
```

Пояснення:

LEFT JOIN таблиць countries та users, щоб врахувати всі країни (навіть якщо там 0 користувачів, хоча HAVING це фільтрує).

Групування за ID та назвою країни.

Використання підзапиту (SELECT COUNT(*) FROM users) для обчислення відсоткової частки.

Сортування від найбільшої кількості користувачів до найменшої.

Приклад виводу: 
                
                | country_name | total_users | percentage | 
                |--------------|-------------|------------| 
                | Ukraine      | 150         | 45.50      | 
                | USA          | 80          | 24.20      |
                | Poland       | 45          | 13.60     |

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