# 🔐 Admin User Setup Guide

## ⚠️ CRITICAL: This file contains instructions for creating admin users. DO NOT commit sensitive data!

## Method 1: Using the Admin Creation Script (Recommended)

### Step 1: Install bcryptjs if not installed
```bash
npm install bcryptjs
```

### Step 2: Run the script
```bash
node scripts/create-admin.js
```

### Step 3: Follow the prompts
- Enter admin full name
- Enter admin email
- Enter admin password (will be hashed)
- Enter phone number (optional)

### Step 4: Copy the generated JSON
The script will output a JSON document like this:
```json
{
  "fullName": "Admin Name",
  "email": "admin@example.com",
  "password": "$2a$12$hashhere...",
  "phone": "+90...",
  "role": "admin",
  "emailVerified": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Step 5: Insert into MongoDB
1. Open MongoDB Atlas (https://cloud.mongodb.com)
2. Navigate to your cluster → Browse Collections
3. Select your database → `users` collection
4. Click "Insert Document"
5. Switch to JSON view
6. Paste the generated JSON
7. Click "Insert"

### Step 6: Verify
1. Go to your app: `/auth/signin`
2. Login with admin email and password
3. Navigate to: `/admin/dashboard`
4. You should see the admin dashboard

---

## Method 2: Manual MongoDB Insert

If you prefer to manually hash the password:

### Step 1: Generate password hash
```javascript
// Run in Node.js console
const bcrypt = require('bcryptjs');
const password = 'your-secure-password-here';
bcrypt.hash(password, 12).then(hash => console.log(hash));
```

### Step 2: Insert document manually
```json
{
  "fullName": "Your Name",
  "email": "admin@yourdomain.com",
  "password": "paste-hashed-password-here",
  "phone": "+90123456789",
  "role": "admin",
  "emailVerified": true,
  "createdAt": { "$date": "2024-01-01T00:00:00.000Z" },
  "updatedAt": { "$date": "2024-01-01T00:00:00.000Z" }
}
```

---

## 🔒 Security Best Practices

### DO:
✅ Use the script to generate hashed passwords
✅ Use strong, unique passwords (16+ characters)
✅ Keep admin credentials in a password manager
✅ Use 2FA on your MongoDB account
✅ Limit admin accounts to 1-2 trusted people
✅ Monitor admin dashboard access logs

### DON'T:
❌ NEVER commit the `create-admin.js` script to Git
❌ NEVER store plain text passwords anywhere
❌ NEVER share admin credentials via email/chat
❌ NEVER use simple passwords like "admin123"
❌ NEVER commit `.env.local` files
❌ NEVER expose admin endpoints publicly without auth

---

## 🛡️ Additional Security Measures

### 1. Enable MongoDB IP Whitelist
Only allow connections from:
- Your local development IP
- Production server IP
- VPN IP if applicable

### 2. Rotate Admin Password Regularly
- Change password every 3-6 months
- Update MongoDB document with new hashed password

### 3. Monitor Admin Actions
Check MongoDB logs for:
- Admin login attempts
- Dashboard access patterns
- Unusual activity

### 4. Backup Strategy
- Regular database backups (weekly)
- Store backups securely (encrypted)
- Test restore process monthly

---

## 🔧 Troubleshooting

### Can't login as admin?
1. Verify email exists in `users` collection
2. Check `role` field is exactly `"admin"`
3. Verify `emailVerified` is `true`
4. Test password hash with bcrypt.compare()

### Dashboard shows 403 Forbidden?
1. Check NextAuth session has `role: 'admin'`
2. Clear browser cookies and re-login
3. Check middleware is not blocking the route

### Password hash not working?
1. Ensure bcrypt rounds = 12 (not 10 or other)
2. No extra whitespace in password field
3. Password was hashed before insertion

---

## 📞 Emergency Access

If you lose admin access:

1. **Reset via MongoDB**:
   - Generate new password hash
   - Update user document directly in MongoDB
   - Use `updateOne()` to change password field

2. **Create new admin**:
   - Run `create-admin.js` script again
   - Insert new admin document
   - Delete old admin if needed

---

## 🗑️ Deleting this file

After setting up your admin:
1. Create admin account successfully
2. Verify you can login
3. Test admin dashboard access
4. **IMPORTANT**: Add this file to `.gitignore` if not already there
5. Never commit sensitive information

---

**Last Updated**: 2024
**Security Level**: CRITICAL - KEEP PRIVATE
