# Observer Panel — Backend API Documentation

> এই document টি Backend Developer এর জন্য। এখানে Observer Panel Mobile App এর জন্য সমস্ত প্রয়োজনীয় API endpoint এর বিস্তারিত বিবরণ দেওয়া আছে।

---

## Base URL

```
https://api.yourdomain.com/v1
```

## Authentication

Login ছাড়া **সব request** এ নিচের Header পাঠাতে হবে:

```
Authorization: Bearer <token>
```

---

## API Endpoints

---

### 1. Login

**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "karim@edu.gov.bd",
  "password": "123456"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "observer": {
    "name": "Md. Abdul Karim",
    "designation": "Division Director",
    "zone": "Dhaka Division",
    "level": "division"
  }
}
```

> **`level`** এর সম্ভাব্য মান: `"division"` | `"district"` | `"upazila"`

> **গুরুত্বপূর্ণ:** Observer এর `level` অনুযায়ী backend **data scope** করবে।
> - `division` level → শুধু তার division এর সব institute দেখবে
> - `district` level → শুধু তার district এর institute দেখবে
> - `upazila` level → শুধু তার upazila এর institute দেখবে

---

### 2. Institute List (School এর তালিকা)

> **গুরুত্বপূর্ণ:** Institute এর সব online payment report — **Fees Management**, **Online Admission**, এবং **Open Payment** — এই তিনটি source থেকেই collection data Observer Portal এ দেখাতে হবে। অর্থাৎ `fee`, `totalPayable`, `totalCollected`, `dueAmount`, `collectionRate` ইত্যাদি field গুলো শুধু Fees Management এর data না, বরং তিনটি payment source মিলিয়ে aggregate করা থাকবে।

**GET** `/institutes`

**Query Parameters (সবগুলো optional):**

| Parameter | Type | Example | বিবরণ |
|---|---|---|---|
| `search` | string | `savar` | নাম বা code দিয়ে search |
| `status` | string | `active` | `active` \| `inactive` \| `due` |
| `layer_level` | string | `division` | Filter কোন layer দিয়ে |
| `layer_value` | string | `Dhaka` | সেই layer এর value |

> `status=due` মানে যেসব institute এর `dueAmount > 1,000,000 (১০ লাখ)`

**Response:**
```json
{
  "total": 12,
  "institutes": [
    {
      "id": 1,
      "name": "Savar Model College",
      "code": "INS-1001",
      "type": "College",
      "branch": "Savar Branch",
      "principal": "PO Dhaka West",
      "gm": "GM Dhaka",
      "upazila": "Savar",
      "district": "Dhaka",
      "division": "Dhaka",
      "mobile": "+880 1711-234567",
      "email": "savar.model@edu.gov.bd",
      "totalStudents": 1540,
      "fee": {
        "today": 85000,
        "week": 420000,
        "month": 1700000,
        "year": 14500000,
      },
      "totalPayable": 18500000,
      "totalCollected": 14500000,
      "dueAmount": 4000000,
      "collectionRate": 78,
      "paymentSources": {
        "feesManagement": { "payable": 15000000, "collected": 12000000 },
        "onlineAdmission": { "payable": 2000000, "collected": 1800000 },
        "openPayment": { "payable": 1500000, "collected": 700000 }
      },
      "lastTransaction": "2026-05-21",
      "lastTransactionTime": "11:42 AM",
      "status": "active"
    }
  ]
}
```

> **`paymentSources`** — উপরের `totalPayable`/`totalCollected` তিনটি source এর যোগফল। প্রতিটি source এর নিজস্ব `payable` ও `collected` থাকবে:
> - `feesManagement` → Fees Management module থেকে
> - `onlineAdmission` → Online Admission module থেকে
> - `openPayment` → Open Payment module থেকে
>
> অর্থাৎ `totalPayable = feesManagement.payable + onlineAdmission.payable + openPayment.payable` (একইভাবে `totalCollected`ও)।

---

### 3. একটি Institute এর Details

**GET** `/institutes/:id`

**Response:**
```json
{
  "id": 1,
  "name": "Savar Model College",
  "code": "INS-1001",
  "type": "College",
  "branch": "Savar Branch",
  "principal": "PO Dhaka West",
  "gm": "GM Dhaka",
  "upazila": "Savar",
  "district": "Dhaka",
  "division": "Dhaka",
  "mobile": "+880 1711-234567",
  "email": "savar.model@edu.gov.bd",
  "totalStudents": 1540,
  "fee": {
    "today": 85000,
    "week": 420000,
    "month": 1700000,
    "year": 14500000
  },
  "totalPayable": 18500000,
  "totalCollected": 14500000,
  "dueAmount": 4000000,
  "collectionRate": 78,
  "paymentSources": {
    "feesManagement": { "payable": 15000000, "collected": 12000000 },
    "onlineAdmission": { "payable": 2000000, "collected": 1800000 },
    "openPayment": { "payable": 1500000, "collected": 700000 }
  },
  "lastTransaction": "2026-05-21",
  "lastTransactionTime": "11:42 AM",
  "status": "active"
}
```

### 4. Date-wise Collection Summary

> এই API টি Institute Detail page এর **"Date to Date"** tab এ ব্যবহার হয়।
> নির্দিষ্ট তারিখ সীমার মধ্যে প্রতিদিনের মোট collection (aggregate) দেখায় — student-wise breakdown না।

**GET** `/observer/institutes/:id/transactions`

**Query Parameters:**

| Parameter | Type | Required | Example | বিবরণ |
|---|---|---|---|---|
| `from` | string | হ্যাঁ | `2026-01-01` | শুরুর তারিখ (YYYY-MM-DD) |
| `to` | string | হ্যাঁ | `2027-02-10` | শেষ তারিখ (YYYY-MM-DD) |

**Response:**
```json
{
  "from": "2026-01-01",
  "to": "2027-02-10",
  "totalAmount": 2100,
  "data": [
    { "date": "2026-01-01", "amount": 2000 },
    { "date": "2027-02-10", "amount": 100 }
  ]
}
```

> `data` — range এর মধ্যে যেসব তারিখে collection হয়েছে শুধু সেগুলোর entry থাকবে (৳0 collection এর তারিখ বাদ দেওয়া যাবে)।
> `date` format: `YYYY-MM-DD`, `amount` পূর্ণ সংখ্যা (BDT, কোনো দশমিক নেই)।
> `totalAmount` — `data` এর সব `amount` এর যোগফল।

---

## Data Field গুলোর বিবরণ

### Institute Object

| Field | Type | বিবরণ |
|---|---|---|
| `id` | integer | Unique Institute ID |
| `name` | string | Institute এর নাম |
| `code` | string | Institute কোড, যেমন `INS-1001` |
| `type` | string | ধরন: `College` \| `High School` \| `School & College` \| `Primary School` \| `Technical` |
| `branch` | string | Branch Office এর নাম (যেমন `Savar Branch`) |
| `principal` | string | Principal Office এর নাম (যেমন `PO Dhaka West`) |
| `gm` | string | GM Office এর নাম (যেমন `GM Dhaka`) |
| `upazila` | string | উপজেলার নাম (যেমন `Savar`) |
| `district` | string | জেলার নাম (যেমন `Dhaka`) |
| `division` | string | বিভাগের নাম (যেমন `Dhaka`) |
| `mobile` | string | Mobile নম্বর |
| `email` | string | Email address |
| `totalStudents` | integer | মোট শিক্ষার্থী সংখ্যা |
| `fee.today` | integer | আজকের মোট collection (BDT) |
| `fee.week` | integer | এই সপ্তাহের মোট collection (BDT) |
| `fee.month` | integer | এই মাসের মোট collection (BDT) |
| `fee.year` | integer | এই বছরের মোট collection (BDT) |
| `totalPayable` | integer | মোট পাওনা (BDT) |
| `totalCollected` | integer | মোট আদায় হয়েছে (BDT) |
| `dueAmount` | integer | বকেয়া = `totalPayable - totalCollected` (BDT) |
| `collectionRate` | integer | আদায়ের হার % — formula: `round((totalCollected / totalPayable) * 100)` |
| `paymentSources.feesManagement` | object | `{ payable, collected }` — Fees Management module থেকে |
| `paymentSources.onlineAdmission` | object | `{ payable, collected }` — Online Admission module থেকে |
| `paymentSources.openPayment` | object | `{ payable, collected }` — Open Payment module থেকে |
| `lastTransaction` | string | সর্বশেষ লেনদেনের তারিখ, format: `YYYY-MM-DD` |
| `lastTransactionTime` | string | সর্বশেষ লেনদেনের সময়, format: `hh:mm AM/PM` |
| `status` | string | `"active"` অথবা `"inactive"` |

### Transaction Object

| Field | Type | বিবরণ |
|---|---|---|
| `id` | integer | Unique Transaction ID |
| `student` | string | শিক্ষার্থীর নাম |
| `class` | string | শ্রেণী, যেমন `Class IX` |
| `amount` | integer | পরিশোধিত পরিমাণ (BDT) |
| `date` | string | তারিখ, format: `YYYY-MM-DD` |
| `time` | string | সময়, format: `hh:mm AM/PM` |
| `type` | string | ফি এর ধরন |
| `method` | string | পরিশোধের মাধ্যম |

---

## Administrative Hierarchy

App টিতে বর্তমানে ৩-স্তরের hierarchy আছে:

```
Division  (বিভাগ)
  └── District  (জেলা)
        └── Upazila  (উপজেলা)
```

**বর্তমানে যেসব Division আছে:**
- `Dhaka` → Districts: `Dhaka`, `Gazipur`
- `Rajshahi` → Districts: `Rajshahi`, `Bogura`
- `Chittagong` → Districts: `Chittagong`, `Cox's Bazar`

**Layer Filter Logic:**
- App থেকে `layer_level` এবং `layer_value` পাঠানো হলে সেই অনুযায়ী filter করতে হবে
  - `layer_level=division&layer_value=Dhaka` → শুধু Dhaka division এর institutes
  - `layer_level=district&layer_value=Gazipur` → শুধু Gazipur district এর institutes
  - `layer_level=upazila&layer_value=Savar` → শুধু Savar upazila এর institutes

---

## গুরুত্বপূর্ণ Notes

1. সব টাকার amount **পূর্ণ সংখ্যা** (BDT integer), কোনো দশমিক নেই
2. `collectionRate` backend থেকে calculate করে পাঠাবে: `round((totalCollected / totalPayable) * 100)`
3. `fee.today / fee.week / fee.month / fee.year` — backend থেকে aggregate করে পাঠাবে
4. **Observer এর `level` অনুযায়ী data scope করতে হবে** — observer এর level এর উপরে data দেখাবে না
5. সব date format হবে `YYYY-MM-DD`
6. Login ছাড়া বাকি সব request এ Header: `Authorization: Bearer <token>`
7. `status=due` filter এর জন্য threshold: `dueAmount > 1000000` (১০ লাখ টাকা)
8. `lastTransactionTime` format হবে `hh:mm AM/PM` (যেমন `11:42 AM`)
9. Institute এর payment/collection data **Fees Management**, **Online Admission**, এবং **Open Payment** — এই তিনটি online payment report থেকেই aggregate করে Observer Portal এ পাঠাতে হবে
<!-- eas build --platform android --profile production -->
<!-- eas update --branch production --environment production --message "fixing api env" -->