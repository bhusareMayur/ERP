# 📘 ERP Quiz System  

A complete prototype of an ERP quiz system with **tab switch detection**, **automatic submission**, and **teacher approval workflow**.  

🚀 Designed to simulate real-world ERP quiz handling with **fairness for students** and **efficiency for teachers**.  

---

## 🎥 Demo Video
<a href="https://tinyurl.com/epr-demo" target="_blank">
  <img src="https://img.shields.io/badge/Watch%20Demo-Click%20Here-blue?style=for-the-badge&logo=youtube" />
</a>



## ✨ Key Highlights  

- ⚡ **Real-time tab monitoring** → detects tab switches instantly.  
- 📢 **Warning system** → warns students on first switch.  
- 📝 **Instant auto-submit** → after 2+ switches, quiz is auto-submitted.  
- 🔄 **Resume workflow** → students can request to resume; teachers approve/reject with one click.  
- 📊 **Teacher analytics** → dashboard shows counts of **pending, approved, rejected** requests.  
- 🛡️ **Secure & scalable** → built with Node.js, MySQL, and follows MVC architecture.  

---

## 🛠️ Tech Stack  

**Frontend:**  
- HTML5, CSS3, JavaScript  
- Bootstrap 5 for UI  

**Backend:**  
- Node.js + Express.js  
- RESTful APIs  

**Database:**  
- MySQL (mysql2 driver)  

**Architecture:**  
- MVC (Models, Controllers, Routes)  
- Modular folder structure  

---

## 🔄 Project Flow  

1. **Student Quiz Flow**  
   - Student starts quiz → tab switch detected via `visibilitychange`.  
   - First switch → **Warning popup**.  
   - Second switch → **Auto-submit quiz instantly**.  
   - Student can send a **Resume Request**.  

2. **Teacher Dashboard Flow**  
   - Teacher logs in → sees dashboard.  
   - Dashboard shows **statistics** (Pending, Approved, Rejected).  
   - Teacher reviews individual requests → Approve / Reject.  
   - Approved quiz attempt returns to **resumed** state.  

3. **Logging & Tracking**  
   - Each tab switch logged with timestamp.  
   - Resume requests tracked with statuses.  
   - APIs handle real-time updates.  

---

## 🔐 Database Schema  

The system uses 5 main tables:  

- `students` → Student info  
- `quizzes` → Quiz metadata  
- `quiz_attempts` → Tracks attempts + status (`in_progress`, `submitted`, `resumed`)  
- `quiz_tab_switches` → Logs tab switches with timestamps  
- `resume_requests` → Handles student resume requests  

SQL schema is available in `database/schema.sql`.  

---

## 🚀 Installation & Setup  

### Prerequisites  
- Node.js (v14+)  
- MySQL Server  
- Git  

### Steps  

1️⃣ Clone repo  
```bash
git clone https://github.com/bhusareMayur/ERP.git
cd ERP
```
2️⃣ Install dependencies
```bash
npm install
```

3️⃣ Setup MySQL
```bash
mysql -u root -p < database/schema.sql
```

4️⃣ Configure DB (backend/models/database.js)
```bash
host: localhost  
user: root  
password: db password  
database: ERP  
```
5️⃣ Run server
```bash
npm start
```

📝 License

This project is a prototype created for educational purposes.