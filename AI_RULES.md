# AI DEVELOPMENT RULES & GUIDELINES

## 1. CORE PHILOSOPHY
* **Context:** Building a MERN Stack POS System for a "Warkop" (Coffee Shop) in Indonesia.
* **Language:** Use **Bahasa Indonesia** for all UI text, comments, and explanations. Code variables remain in English.

## 2. FILE SYSTEM & STRUCTURE
* **CHECK FIRST:** Before creating any file, SCAN the directory. If a file with a similar name exists (case-insensitive), USE THAT FILE.
* **NO DUPLICATES:** Do not create `inventoryController.js` if `InventoryController.js` exists.
* **STYLE:** Follow existing patterns (Tailwind for UI, Express for API).

## 3. BACKEND (NODE/EXPRESS)
* **THE TRINITY RULE:** If you add a Controller function, you MUST also add the Route, and ensure the Route is registered in `server.js`.
* **ERROR HANDLING:** Always wrap async controller logic in `try-catch`. Return proper HTTP codes (200, 400, 404, 500).
* **DATABASE:** Use Mongoose. Always use `.lean()` for read-only queries for performance.

## 4. FRONTEND (REACT/VITE)
* **DEFENSIVE CODING:**
    * Use Optional Chaining: `user?.role` instead of `user.role`.
    * Use Default Values: `(list || []).map(...)` instead of `list.map(...)`.
* **MOBILE FIRST:** The Customer facing app must be optimized for mobile screens. Use safe-area padding (`pb-28`) for pages with bottom navigation.
* **STATE MANAGEMENT:** Handle `loading` and `error` states explicitly in UI.

## 5. LOCALIZATION
* **CURRENCY:** Format all prices to IDR (e.g., `Rp 15.000`).
* **TIME:** Use WIB (Waktu Indonesia Barat) or local server time for logs/display.

## 6. SECURITY
* **ROLE CHECKS:** Ensure sensitive actions (Delete, Edit Price) verify `req.user.role` on the Backend, not just hidden on Frontend.
* **DATA PRIVACY:** Never send password hashes or sensitive internal flags to the Frontend.