### 🛍️ Trinket – Product Search & Upload Platform  
Welcome to Trinket, my first portfolio project built to showcase core frontend and full-stack development skills. This project is a shop platform where users can explore and search products using a fuzzy search engine, and authorized users can upload products with complex variant logic.

While not a fully finished commercial product, this app demonstrates essential functionality and hands-on experience with modern web technologies, clean UI/UX design, and structured logic handling.

### 🚀 Features

### 🛒 Product Upload (Single & Multiple Variants)  
Authorized users can upload products in two modes:

Single Product Mode – upload name, price, description, and images.

Multiple Variant Mode – define main options (unique name/price/image) and secondary options (optional modifiers).

Includes advanced logic for:

Removing empty/single-item groups.

Merging single options into all variants automatically.

Additional services (with price/name and optional image/description) that affect total price.

Drag-and-drop support for sorting options and service lists.

📸 **Demo:**  
👉 See the GIF below  
![upload-demo](https://github.com/user-attachments/assets/838bf107-2202-47cc-a66f-88b037c6de7b)

### 🧾 Product Page View

Each product has its own detailed page displaying:

- Product name, description, images, and price
- Dynamic rendering of variant groups and additional services
- Interactive image slider (built with Swiper)
- Total price updates based on selected options
- Clean responsive layout

📸 **Demo:**  
👉 _See the GIF below_  
![product-page-demo](https://github.com/user-attachments/assets/a732f0c9-e47c-4a2c-8edb-0e3bb94bdeed)

### 🔎 Fuzzy Search (Levenshtein-based)  
Users can search for products with flexible spelling using a custom fuzzy search algorithm based on Levenshtein distance.

📸 **Demo:**  
👉 See the GIF below  
![search-demo](https://github.com/user-attachments/assets/dbce2a63-fc49-429e-95f6-0c2a6cfaf490)

### 👤 Profile Page & Contact Management  
Users can manage their profile through:

Basic info (synced with Clerk)

Editable bio

Social OAuth linking (Google, Facebook, Apple)

Separate Contacts tab: add phones, social/media links, or plain text like "Telegram @my_name".

Smart link parsing and phone validation

📸 **Demo:**  
👉 See the GIF below  
![profile-demo](https://github.com/user-attachments/assets/7a9d330f-e075-4e6d-b0f9-db8ee27e4d03)

### 🧠 Other Notable Features  
🖼️ Image Dropzone – drag or select images, view thumbnails, delete, and full-size preview

🧩 Drag & Drop UI – implemented with dnd-kit to sort variant groups and services

🕵️ Recently Viewed – displays up to 10 last-viewed products (saved for 7 days)

📱 Responsive Design – built with Tailwind CSS for all screen sizes

| Tech                             | Purpose                                                 |
| -------------------------------- | ------------------------------------------------------- |
| **React + Next.js + TypeScript** | Core framework                                          |
| **Tailwind CSS**                 | Styling                                                 |
| **PostgreSQL + Prisma**          | Database & ORM                                          |
| **Clerk**                        | Authentication & OAuth                                  |
| **Zod**                          | Schema validation                                       |
| **React Hook Form**              | Form state management                                   |
| **dnd-kit**                      | Drag & drop logic                                       |
| **react-dropzone**               | Image uploads                                           |
| **Swiper**                       | Image carousels                                         |
| **lucide-react**                 | Icon library                                            |
| **Redis (via Redis Cloud)**      | Simple user session caching                             |
| **clsx + tailwind-merge**        | Utility for conditional styling                         |

### 📌 Limitations  
This project does not include full purchase functionality or checkout flow (though a purchase model is present in the schema). This is intentional – the focus is on frontend interactions, form architecture, and real-time UI logic.

> _**Disclaimer**:  
> This project is a personal portfolio project created for educational and demonstrational purposes only.  
> All product names, images, and brands shown in demo GIFs are used as placeholders and are the property of their respective owners.  
> I do not claim any affiliation with or endorsement from these brands._
