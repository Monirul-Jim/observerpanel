# Observer Panel — API Endpoints

---

## 1. Login

**POST** `/auth/login`

```json
// পাঠাবো
{
  "email": "karim@edu.gov.bd",
  "password": "123456"
}

// পাবো
{
  "token": "eyJhbG...",
  "observer": {
    "name": "Md. Abdul Karim",
    "designation": "Upazila Education Officer",
    "zone": "Savar Upazila",
    "level": "upazila"
  }
}
```

> `level` হবে এর মধ্যে একটা: `branch` | `principal` | `gm` | `upazila` | `district` | `division`

---

## 2. Institute List (School এর তালিকা)

**GET** `/institutes`

```
// Filter করতে চাইলে এভাবে পাঠাবো (সবগুলো optional)
?search=savar
?status=active          → active | inactive | due (due মানে বকেয়া > ১০ লাখ)
?layer_level=upazila    → কোন layer দিয়ে filter
?layer_value=Savar      → সেই layer এর value
```

```json
// পাবো
{
  "total": 5,
  "institutes": [
    {
      "id": 1,
      "name": "Savar Model School & College",
      "code": "INS-0041",
      "type": "School & College",
      "branch": "Savar Branch",
      "principal": "Principal Office A",
      "gm": "GM Office North",
      "upazila": "Savar",
      "district": "Dhaka",
      "division": "Dhaka",
      "mobile": "+880 1711-234567",
      "email": "savar.model@edu.gov.bd",
      "totalStudents": 1240,
      "fee": {
        "today": 84500,
        "week": 412000,
        "month": 1680000,
        "year": 14320000
      },
      "totalPayable": 18600000,
      "totalCollected": 14320000,
      "dueAmount": 4280000,
      "collectionRate": 77,
      "lastTransaction": "2026-05-21",
      "lastTransactionTime": "11:42 AM",
      "status": "active"
    }
  ]
}
```

---

## 3. একটি Institute এর Details

**GET** `/institutes/:id`

```json
// পাবো (উপরের Institute object এর মতোই, একটা institute এর জন্য)
{
  "id": 1,
  "name": "Savar Model School & College",
  "code": "INS-0041",
  "type": "School & College",
  "branch": "Savar Branch",
  "principal": "Principal Office A",
  "gm": "GM Office North",
  "upazila": "Savar",
  "district": "Dhaka",
  "division": "Dhaka",
  "mobile": "+880 1711-234567",
  "email": "savar.model@edu.gov.bd",
  "totalStudents": 1240,
  "fee": {
    "today": 84500,
    "week": 412000,
    "month": 1680000,
    "year": 14320000
  },
  "totalPayable": 18600000,
  "totalCollected": 14320000,
  "dueAmount": 4280000,
  "collectionRate": 77,
  "lastTransaction": "2026-05-21",
  "lastTransactionTime": "11:42 AM",
  "status": "active"
}
```

---

## 4. Transaction List (কোন Institute এর লেনদেন)

**GET** `/institutes/:id/transactions`

```
// Date range filter (optional)
?from=2026-05-14
?to=2026-05-21
```

```json
// পাবো
{
  "totalAmount": 13400,
  "transactions": [
    {
      "id": 1,
      "student": "Rafi Ahmed",
      "class": "Class IX",
      "amount": 2400,
      "date": "2026-05-21",
      "time": "11:42 AM",
      "type": "Tuition Fee",
      "method": "Cash"
    },
    {
      "id": 2,
      "student": "Sumaiya Khanam",
      "class": "Class X",
      "amount": 1800,
      "date": "2026-05-21",
      "time": "11:15 AM",
      "type": "Exam Fee",
      "method": "bKash"
    }
  ]
}
```

> `type` হবে: `Tuition Fee` | `Exam Fee` | `Annual Fee` | `Admission Fee`  
> `method` হবে: `Cash` | `bKash` | `Rocket` | `Nagad`

---

## Field গুলো কী কী মানে

### Institute এর Fields

| Field                                                               | মানে                                     |
| ------------------------------------------------------------------- | ---------------------------------------- |
| `id`                                                                | Unique ID                                |
| `name`                                                              | School এর নাম                            |
| `code`                                                              | School কোড (যেমন INS-0041)               |
| `type`                                                              | School এর ধরন                            |
| `branch` / `principal` / `gm` / `upazila` / `district` / `division` | Administrative hierarchy                 |
| `mobile` / `email`                                                  | যোগাযোগ                                  |
| `totalStudents`                                                     | মোট শিক্ষার্থী                           |
| `fee.today`                                                         | আজকের collection                         |
| `fee.week`                                                          | এই সপ্তাহের collection                   |
| `fee.month`                                                         | এই মাসের collection                      |
| `fee.year`                                                          | এই বছরের collection                      |
| `totalPayable`                                                      | মোট পাওনা                                |
| `totalCollected`                                                    | মোট আদায় হয়েছে                         |
| `dueAmount`                                                         | বকেয়া (= totalPayable - totalCollected) |
| `collectionRate`                                                    | আদায়ের হার % (যেমন 77 মানে ৭৭%)         |
| `lastTransaction`                                                   | সর্বশেষ লেনদেনের তারিখ                   |
| `status`                                                            | `active` অথবা `inactive`                 |

---

## গুরুত্বপূর্ণ Notes

- সব টাকার amount **পূর্ণ সংখ্যা** (BDT, কোনো দশমিক নেই)
- `collectionRate` backend থেকে calculate করে পাঠাবে: `(totalCollected / totalPayable) * 100`
- `fee.today/week/month/year` — backend থেকে aggregate করে পাঠাবে
- **Observer এর `level` অনুযায়ী data scope করতে হবে** — যেমন `upazila` level এর observer শুধু তার upazila এর institute দেখবে
- সব date format হবে `YYYY-MM-DD`
- Login ছাড়া বাকি সব request-এ Header দিতে হবে: `Authorization: Bearer <token>`
