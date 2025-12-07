# Database Schema

## Overview
The database uses **PostgreSQL**. The schema is managed via **Prisma ORM**.
Below is the description of the tables and their relationships.

### ER Diagram
![image](/uploads/erd-diagram/Screenshot%202025-12-07%20at%2015.07.14.png)


    User {
        Int user_id PK
        String username
        String email
        String password
        String avatar
        Int country_id FK
    }

    Country {
        Int country_id PK
        String country_name
    }

    Post {
        Int post_id PK
        Int user_id FK
        String caption
        String content
        String imageUrl
        Int likes_count
        Int comments_count
        DateTime created_at
    }

    Comment {
        Int comment_id PK
        Int post_id FK
        Int user_id FK
        String comment_text
        DateTime created_at
    }

    Like {
        Int user_id PK, FK
        Int post_id PK, FK
    }

    Follow {
        Int follower_id PK, FK
        Int following_id PK, FK
    }

# Tables Description

## 1. users

**Stores user account information.**

**user_id (PK): Unique identifier.**

 **username: Unique display name.**

 **avatar: Path to the profile image (default: /uploads/avatars/default.png).**

**email: User email (optional).**

**password: Hashed password.**

**country_id (FK): Relation to countries table.**

# 2. posts


post_id (PK): Unique identifier.

user_id (FK): The author of the post.

imageUrl: Path to the uploaded image.

caption: Short title or description.

content: Main text body.

likes_count: Cached counter of likes.

created_at: Timestamp.


# 3. comments

Comments left on posts.

comment_id (PK): Unique identifier.

post_id (FK): The post being commented on.

user_id (FK): The author of the comment.

comment_text: The content.

# 4. likes

user_id (FK): Who liked.

post_id (FK): What was liked.

Constraint: Composite Primary Key (user_id, post_id) ensures a user can like a post only once.

# 5. countries

List of available countries.

country_id (PK): Unique identifier.

country_name: Name of the country (e.g., Ukraine, USA).

# 6. followers

Self-relation for User subscriptions.

follower_id: Who is following.

following_id: Who is being followed.