# GuitarCorner — E-Commerce Platform

> A full-stack B2C e-commerce web application for musical instruments, built with **React · Spring Boot · Hibernate**.

---

##  Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [User Roles](#user-roles)
- [Features](#features)
  - [Guest (Unauthenticated)](#guest-unauthenticated)
  - [Registered User](#registered-user)
  - [Administrator](#administrator)
- [Authentication & Security](#authentication--security)
- [Shopping Cart](#shopping-cart)
- [Checkout Flow](#checkout-flow)
- [Product Catalog](#product-catalog)
- [Recommendation System](#recommendation-system)
- [Admin Dashboard](#admin-dashboard)
- [Getting Started](#getting-started)
- [API Overview](#api-overview)

---

## Overview

**GuitarCorner** is a modern, responsive e-commerce platform specializing in guitars and musical instrument equipment. The application is built as a **Single Page Application (SPA)** using React, which eliminates full page reloads and delivers a fluid, native-app-like experience.

The project follows a strict separation of concerns — the frontend is completely decoupled from the backend, communicating exclusively through a **REST API**. This design makes it straightforward to extend the platform with additional clients (e.g., a mobile application) in the future.

---

## Tech Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Frontend    | React (SPA)                         |
| Backend     | Spring Boot                         |
| ORM         | Hibernate                           |
| Auth        | JWT (JSON Web Tokens)               |
| Security    | BCrypt password hashing             |
| Storage     | External image hosting (URL-based)  |
| Architecture| REST                                |

---

## Architecture

```
┌─────────────────────┐         REST API          ┌──────────────────────────┐
│                     │ ◄────────────────────────► │                          │
│   React (SPA)       │      JSON / JWT Auth       │   Spring Boot + Hibernate│
│   Single Page App   │                            │   Business Logic + DB    │
│                     │                            │                          │
└─────────────────────┘                            └──────────────────────────┘
```

- The **frontend** handles all UI rendering, routing, and local state management.
- The **backend** exposes secured REST endpoints, processes business logic, and manages database operations through Hibernate.
- **Role-based access control** is enforced both on the API level (Spring Security) and conditionally in the React UI.

---

## User Roles

GuitarCorner defines two main user roles, each with distinct permissions and capabilities.

###  Customer (Two States)

To minimize cart abandonment and maximize user retention, the Customer role is split into two technical states:

| State            | Description |
|------------------|-------------|
| **Guest**        | No account required. Cart stored in browser `localStorage`. Can complete a purchase with email only — no user entity is created in the database. |
| **Registered User** | Has a full account. Assigned `ROLE_USER` in the database. Receives a **JWT token** upon login that unlocks private features. |

###  Administrator

- Assigned `ROLE_ADMIN` in the `user_roles` table.
- JWT token contains an admin-specific claim granting access to all protected administrative API endpoints.
- On the frontend, the presence of this role triggers the rendering of the **Admin Dashboard**, which is completely hidden from regular users.

---

## Features

### Guest (Unauthenticated)

- Browse the full product catalog without an account.
- Filter and sort products (see [Product Catalog](#product-catalog)).
- Add items to a shopping cart stored in **browser `localStorage`**.
- Complete a purchase by providing only an **email address** — the order is saved in the `Orders` table without creating a full user account.
- Register for a new account or log into an existing one at any point.

---

### Registered User

All guest capabilities, plus:

####  Account Management
- Register with personal information — password is securely **hashed with BCrypt** before being stored.
- Log in to receive a **JWT token** for authenticated sessions.
- Update personal profile: delivery addresses, phone numbers, and saved payment details.
- View complete **order history** with details of all past purchases.

####  Shopping Cart
- Persistent cart synchronized across **all devices and browsers** via the user's account (not tied to a single browser session).
- Add, remove, and update item quantities.

####  Wishlist
- Save products to a **wishlist** stored in the database for future consideration.

####  Streamlined Checkout
- Delivery and payment information is **automatically pre-filled** at checkout if the user has previously saved these details, reducing manual input and speeding up the purchasing process.

####  Personalized Recommendations
- Access to the guided **product recommendation system** (see [Recommendation System](#recommendation-system)).

---

### Administrator

All registered user capabilities, plus full access to the **Admin Dashboard**:

####  User Management
- Browse all registered user accounts.
- View individual user profiles and their complete order histories.
- **Modify user roles** — promote a regular user to a staff member or assign different permissions.

####  Product & Inventory Management
- Add new products with full details: name, brand, price, description, stock availability.
- Upload **product images** — images are stored externally and their URLs are saved in the database to prevent database bloat and improve performance.
- Edit existing product entries: update descriptions, prices, stock levels, and promotional discounts.
- Respond dynamically to market changes, seasonal promotions, and inventory updates.

####  Analytics
- View store performance statistics, including:
  - Most frequently purchased products.
  - Most commonly selected delivery methods.
  - Geographic distribution of orders by country or region.

---

## Authentication & Security

| Concern              | Implementation |
|----------------------|----------------|
| Password storage     | BCrypt hashing |
| Session management   | JWT (JSON Web Tokens) |
| Role enforcement (API) | Spring Security — role claims in JWT |
| Role enforcement (UI)  | React conditional rendering based on JWT role claim |
| Guest data           | `localStorage` for cart; email only for orders |
| Admin endpoints      | Protected by `ROLE_ADMIN` claim in JWT |

- Upon **registration**, a `ROLE_USER` is assigned in the database, and the user's password is BCrypt-hashed before persistence.
- Upon **login**, the Spring Boot backend issues a signed JWT containing the user's role(s). This token must be included in all requests to private endpoints.
- **Admin routes and components** in React are only rendered when the JWT contains the `ROLE_ADMIN` claim.

---

## Shopping Cart

| User State   | Cart Storage              | Persistence |
|--------------|---------------------------|-------------|
| Guest        | Browser `localStorage`    | Browser/device only — lost if storage is cleared |
| Registered   | Database (server-side)    | Persistent across all devices and browsers |

When a guest user **logs in or registers**, their local cart is merged with their account's server-side cart to avoid losing selected items.

---

## Checkout Flow

```
Browse Catalog
      │
      ▼
 Add to Cart
      │
      ├──── Guest? ──────────────────────────────────────────────────┐
      │                                                               │
      ▼                                                               ▼
 Log In / Register                                         Provide Email Address
      │                                                               │
      ▼                                                               ▼
 Delivery & Payment Details                            Delivery & Payment Details
 (auto-filled if saved)                                (entered manually)
      │                                                               │
      └───────────────────────┬───────────────────────────────────────┘
                              ▼
                     Confirm & Place Order
                              │
                              ▼
                    Order saved in database
```

---

## Product Catalog

### Filtering

Users can narrow down the product listing using the following filters:

- **Brand** — filter by instrument manufacturer.
- **Product type** — e.g., electric guitar, acoustic guitar, bass, accessories.
- **Availability** — in stock / out of stock.
- **Price range** — minimum and maximum price slider.

### Sorting

Products can be sorted by:

- **Price** — ascending (lowest first) or descending (highest first).
- **User rating** — highest rated products first.

---

## Recommendation System

GuitarCorner includes a **personalized product suggestion engine** to help users — especially beginners — find the right instrument.

Users answer a short guided questionnaire covering:

| Question                    | Example Options |
|-----------------------------|-----------------|
| Experience level            | Beginner / Intermediate / Professional |
| Preferred color             | Sunburst, Black, Natural, Red, etc. |
| Body / shape preference     | Single-cut, Double-cut, Semi-hollow, etc. |
| Dominant hand               | Right-handed / Left-handed |

Based on the submitted preferences, the system filters and ranks matching instruments from the active catalog, helping users make **informed purchasing decisions** without needing to manually browse the entire inventory.

> Administrators can improve recommendation accuracy by ensuring product entries contain complete and up-to-date attribute data.

---

## Admin Dashboard

The Admin Dashboard is a dedicated interface rendered exclusively for users with the `ADMIN` claim. It is completely invisible to regular customers.

### Sections

| Section             | Capabilities |
|---------------------|--------------|
| **User Management** | View accounts, order histories, modify roles |
| **Product Management** | Add / edit / delete products, manage stock, apply discounts |
| **Image Management** | Upload product images — stored externally, URLs saved in DB |
| **Analytics**       | Purchase stats, delivery method stats, geographic order data |

---

## Getting Started

### Prerequisites

- Node.js & npm
- Java 17+
- Maven
- A relational database (e.g., PostgreSQL or MySQL)



## API Overview

All private endpoints require a valid JWT in the `Authorization` header:

```
Authorization: Bearer <token>
```

### Auth Endpoints

| Method | Endpoint             | Access  | Description              |
|--------|----------------------|---------|--------------------------|
| POST   | `/api/auth/register` | Public  | Register a new user      |
| POST   | `/api/auth/login`    | Public  | Login and receive JWT    |

### Product Endpoints

| Method | Endpoint               | Access       | Description                   |
|--------|------------------------|--------------|-------------------------------|
| GET    | `/api/products`        | Public       | Get all products (filterable) |
| GET    | `/api/products/{id}`   | Public       | Get single product            |
| POST   | `/api/products`        | ROLE_ADMIN   | Add new product               |
| PUT    | `/api/products/{id}`   | ROLE_ADMIN   | Update product                |
| DELETE | `/api/products/{id}`   | ROLE_ADMIN   | Delete product                |

### User Endpoints

| Method | Endpoint               | Access       | Description                     |
|--------|------------------------|--------------|---------------------------------|
| GET    | `/api/users/me`        | ROLE_USER    | Get current user profile        |
| PUT    | `/api/users/me`        | ROLE_USER    | Update profile / saved details  |
| GET    | `/api/users/me/orders` | ROLE_USER    | Get order history               |
| GET    | `/api/users`           | ROLE_ADMIN   | Get all users                   |
| PUT    | `/api/users/{id}/role` | ROLE_ADMIN   | Update user role                |

### Cart & Orders

| Method | Endpoint               | Access       | Description                   |
|--------|------------------------|--------------|-------------------------------|
| GET    | `/api/cart`            | ROLE_USER    | Get user's cart               |
| POST   | `/api/cart`            | ROLE_USER    | Add item to cart              |
| DELETE | `/api/cart/{itemId}`   | ROLE_USER    | Remove item from cart         |
| POST   | `/api/orders`          | Public       | Place an order (guest/user)   |

### Wishlist

| Method | Endpoint                  | Access    | Description              |
|--------|---------------------------|-----------|--------------------------|
| GET    | `/api/wishlist`           | ROLE_USER | Get user's wishlist      |
| POST   | `/api/wishlist/{productId}` | ROLE_USER | Add product to wishlist  |
| DELETE | `/api/wishlist/{productId}` | ROLE_USER | Remove from wishlist     |

---

## Project Info

| Field   | Value              |
|---------|--------------------|
| Project | #19 — GuitarCorner |
| Type    | Full-Stack Web App |
| Pattern | B2C E-Commerce SPA |
| API     | RESTful            |
