/**
 * Seed data cho hệ thống TOEIC Learning
 * Bao gồm: topics, word_sets, words, word_definitions, word_set_words
 *
 * Chạy với: npx ts-node seed.ts  hoặc  npx tsx seed.ts
 * Yêu cầu: @prisma/client đã được generate từ schema
 */

import { prisma } from "./../src/config/prisma";

// ─────────────────────────────────────────────
// HELPER
// ─────────────────────────────────────────────
const now = new Date();

// ─────────────────────────────────────────────
// RAW DATA
// ─────────────────────────────────────────────

interface RawWord {
  term: string;
  phonetic: string;
  audioUrl?: string;
  topic: string;
  level: number;
  wordForm?: string;
  definitions: {
    partOfSpeech: string;
    definitionEn: string;
    definitionVi: string;
    exampleEn?: string;
    exampleVi?: string;
    tips?: string;
    sortOrder: number;
  }[];
}

interface RawWordSet {
  name: string;
  description: string;
  level: number;
  thumbnail?: string;
  words: string[]; // term references
}

interface RawTopic {
  name: string;
  description: string;
  thumbnail?: string;
  order: number;
  wordSets: RawWordSet[];
}

const RAW_TOPICS: RawTopic[] = [
  // ═══════════════════════════════════════════
  // TOPIC 1: BUSINESS & OFFICE
  // ═══════════════════════════════════════════
  {
    name: "Business & Office",
    description:
      "Vocabulary for workplace communication, office routines, and business operations",
    thumbnail: "https://cdn.example.com/topics/business.jpg",
    order: 1,
    wordSets: [
      {
        name: "Office Essentials",
        description: "Common words used in day-to-day office environment",
        level: 1,
        words: [
          "agenda",
          "deadline",
          "memorandum",
          "invoice",
          "expenditure",
          "reimburse",
          "conference",
          "collaborate",
          "efficient",
          "productivity",
        ],
      },
      {
        name: "Business Correspondence",
        description: "Words used in professional emails, letters, and reports",
        level: 2,
        words: [
          "correspondence",
          "acknowledge",
          "enclose",
          "pursuant",
          "sincerely",
          "clarify",
          "elaborate",
          "tentative",
          "attached",
          "forthcoming",
        ],
      },
      {
        name: "Management & Leadership",
        description: "Vocabulary related to managing teams and projects",
        level: 3,
        words: [
          "delegate",
          "supervise",
          "appraise",
          "incentive",
          "accountability",
          "initiative",
          "benchmark",
          "hierarchy",
          "consensus",
          "restructure",
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════
  // TOPIC 2: FINANCE & BANKING
  // ═══════════════════════════════════════════
  {
    name: "Finance & Banking",
    description:
      "Essential vocabulary for financial transactions, banking services, and accounting",
    thumbnail: "https://cdn.example.com/topics/finance.jpg",
    order: 2,
    wordSets: [
      {
        name: "Banking Basics",
        description: "Words related to banking operations and accounts",
        level: 1,
        words: [
          "deposit",
          "withdrawal",
          "balance",
          "transaction",
          "interest",
          "loan",
          "mortgage",
          "collateral",
          "overdraft",
          "dividend",
        ],
      },
      {
        name: "Financial Reports",
        description: "Vocabulary for reading and writing financial statements",
        level: 2,
        words: [
          "revenue",
          "liability",
          "asset",
          "equity",
          "depreciation",
          "amortize",
          "audit",
          "reconcile",
          "fiscal",
          "forecast",
        ],
      },
      {
        name: "Investment & Market",
        description: "Stock market and investment terminology",
        level: 3,
        words: [
          "portfolio",
          "volatility",
          "liquidity",
          "diversify",
          "acquisition",
          "merger",
          "shareholder",
          "quarterly",
          "yield",
          "deficit",
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════
  // TOPIC 3: MARKETING & SALES
  // ═══════════════════════════════════════════
  {
    name: "Marketing & Sales",
    description: "Vocabulary for advertising, promotions, and sales strategies",
    thumbnail: "https://cdn.example.com/topics/marketing.jpg",
    order: 3,
    wordSets: [
      {
        name: "Marketing Fundamentals",
        description: "Core marketing concepts and strategies",
        level: 1,
        words: [
          "campaign",
          "branding",
          "demographic",
          "segment",
          "promotion",
          "endorse",
          "testimonial",
          "slogan",
          "target",
          "niche",
        ],
      },
      {
        name: "Sales & Negotiation",
        description: "Vocabulary for sales processes and business negotiation",
        level: 2,
        words: [
          "negotiate",
          "commission",
          "quota",
          "prospect",
          "pitch",
          "discount",
          "wholesale",
          "retail",
          "bargain",
          "contract",
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════
  // TOPIC 4: HUMAN RESOURCES
  // ═══════════════════════════════════════════
  {
    name: "Human Resources",
    description:
      "Vocabulary related to recruitment, employment, and workplace policies",
    thumbnail: "https://cdn.example.com/topics/hr.jpg",
    order: 4,
    wordSets: [
      {
        name: "Recruitment & Hiring",
        description: "Words used in job applications and hiring processes",
        level: 1,
        words: [
          "applicant",
          "resume",
          "interview",
          "reference",
          "qualification",
          "recruit",
          "shortlist",
          "onboard",
          "probation",
          "vacancy",
        ],
      },
      {
        name: "Employee Benefits & Policies",
        description: "Vocabulary related to employee rights and benefits",
        level: 2,
        words: [
          "compensation",
          "severance",
          "pension",
          "deductible",
          "maternity",
          "eligible",
          "grievance",
          "termination",
          "mandatory",
          "compliance",
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════
  // TOPIC 5: TRAVEL & TRANSPORTATION
  // ═══════════════════════════════════════════
  {
    name: "Travel & Transportation",
    description:
      "Vocabulary for business travel, flights, hotels, and logistics",
    thumbnail: "https://cdn.example.com/topics/travel.jpg",
    order: 5,
    wordSets: [
      {
        name: "Air Travel",
        description: "Common words for airports and flights",
        level: 1,
        words: [
          "itinerary",
          "boarding",
          "departure",
          "arrival",
          "customs",
          "baggage",
          "layover",
          "turbulence",
          "terminal",
          "passport",
        ],
      },
      {
        name: "Hotels & Accommodation",
        description: "Vocabulary related to hotel stays and bookings",
        level: 1,
        words: [
          "reservation",
          "checkout",
          "amenity",
          "concierge",
          "suite",
          "occupancy",
          "complimentary",
          "cancellation",
          "rate",
          "receipt",
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════
  // TOPIC 6: TECHNOLOGY & IT
  // ═══════════════════════════════════════════
  {
    name: "Technology & IT",
    description:
      "Vocabulary for software, hardware, and digital business tools",
    thumbnail: "https://cdn.example.com/topics/technology.jpg",
    order: 6,
    wordSets: [
      {
        name: "IT & Software",
        description: "Common tech terms in the TOEIC exam",
        level: 2,
        words: [
          "software",
          "interface",
          "database",
          "upgrade",
          "compatible",
          "bandwidth",
          "encrypt",
          "implement",
          "integrate",
          "subscription",
        ],
      },
    ],
  },
];

// ─────────────────────────────────────────────
// WORD DICTIONARY (term → full data)
// ─────────────────────────────────────────────

const WORD_DICT: Record<string, RawWord> = {
  // ── BUSINESS & OFFICE ──────────────────────

  agenda: {
    term: "agenda",
    phonetic: "/əˈdʒɛndə/",
    topic: "Business & Office",
    level: 1,
    wordForm: "noun",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn:
          "A list of items to be discussed or acted upon at a meeting",
        definitionVi:
          "Chương trình nghị sự; danh sách các vấn đề cần thảo luận",
        exampleEn: "Please review the agenda before the board meeting.",
        exampleVi:
          "Vui lòng xem lại chương trình nghị sự trước cuộc họp hội đồng.",
        tips: "Common TOEIC phrase: 'set the agenda' (định hướng cuộc họp)",
        sortOrder: 0,
      },
    ],
  },

  deadline: {
    term: "deadline",
    phonetic: "/ˈdɛdlaɪn/",
    topic: "Business & Office",
    level: 1,
    wordForm: "noun",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn:
          "The latest time or date by which something must be completed",
        definitionVi: "Thời hạn cuối cùng; hạn chót",
        exampleEn: "The project deadline is Friday at 5 PM.",
        exampleVi: "Hạn chót của dự án là thứ Sáu lúc 5 giờ chiều.",
        tips: "Phrasal: 'meet a deadline' = hoàn thành đúng hạn; 'miss a deadline' = trễ hạn",
        sortOrder: 0,
      },
    ],
  },

  memorandum: {
    term: "memorandum",
    phonetic: "/ˌmɛməˈrændəm/",
    topic: "Business & Office",
    level: 1,
    wordForm: "noun",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn: "A written message in a business, also called a memo",
        definitionVi: "Bản ghi nhớ nội bộ; thông báo nội bộ (viết tắt: memo)",
        exampleEn: "The CEO sent a memorandum about the new dress code.",
        exampleVi:
          "Giám đốc điều hành gửi bản ghi nhớ về quy định trang phục mới.",
        sortOrder: 0,
      },
    ],
  },

  invoice: {
    term: "invoice",
    phonetic: "/ˈɪnvɔɪs/",
    topic: "Business & Office",
    level: 1,
    wordForm: "noun/verb",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn:
          "A bill sent to a customer detailing products or services provided and the amount owed",
        definitionVi: "Hóa đơn; phiếu thanh toán",
        exampleEn: "Please send the invoice within 30 days of delivery.",
        exampleVi:
          "Vui lòng gửi hóa đơn trong vòng 30 ngày kể từ khi giao hàng.",
        sortOrder: 0,
      },
      {
        partOfSpeech: "verb",
        definitionEn: "To send a bill to someone",
        definitionVi: "Lập hóa đơn; xuất hóa đơn",
        exampleEn: "We will invoice you at the end of the month.",
        exampleVi: "Chúng tôi sẽ xuất hóa đơn cho bạn vào cuối tháng.",
        sortOrder: 1,
      },
    ],
  },

  expenditure: {
    term: "expenditure",
    phonetic: "/ɪkˈspɛndɪtʃər/",
    topic: "Business & Office",
    level: 1,
    wordForm: "noun",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn:
          "The total amount of money that a government, organization, or person spends",
        definitionVi: "Chi tiêu; khoản chi phí",
        exampleEn: "The company needs to reduce its annual expenditure.",
        exampleVi: "Công ty cần giảm chi tiêu hàng năm.",
        sortOrder: 0,
      },
    ],
  },

  reimburse: {
    term: "reimburse",
    phonetic: "/ˌriːɪmˈbɜːrs/",
    topic: "Business & Office",
    level: 1,
    wordForm: "verb",
    definitions: [
      {
        partOfSpeech: "verb",
        definitionEn: "To repay money spent on behalf of someone or a company",
        definitionVi: "Hoàn trả tiền; bồi hoàn",
        exampleEn:
          "Employees will be reimbursed for all business travel expenses.",
        exampleVi: "Nhân viên sẽ được hoàn trả toàn bộ chi phí đi công tác.",
        tips: "Noun form: reimbursement (sự hoàn trả)",
        sortOrder: 0,
      },
    ],
  },

  conference: {
    term: "conference",
    phonetic: "/ˈkɒnfərəns/",
    topic: "Business & Office",
    level: 1,
    wordForm: "noun",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn:
          "A formal meeting for discussion, usually attended by many people",
        definitionVi: "Hội nghị; hội thảo",
        exampleEn: "The annual sales conference will be held in Singapore.",
        exampleVi: "Hội nghị bán hàng hàng năm sẽ được tổ chức tại Singapore.",
        sortOrder: 0,
      },
    ],
  },

  collaborate: {
    term: "collaborate",
    phonetic: "/kəˈlæbəreɪt/",
    topic: "Business & Office",
    level: 1,
    wordForm: "verb",
    definitions: [
      {
        partOfSpeech: "verb",
        definitionEn: "To work jointly with others toward a common goal",
        definitionVi: "Cộng tác; hợp tác cùng nhau",
        exampleEn: "The two departments collaborated on the product launch.",
        exampleVi:
          "Hai phòng ban đã cộng tác với nhau trong buổi ra mắt sản phẩm.",
        tips: "Noun: collaboration; Adjective: collaborative",
        sortOrder: 0,
      },
    ],
  },

  efficient: {
    term: "efficient",
    phonetic: "/ɪˈfɪʃənt/",
    topic: "Business & Office",
    level: 1,
    wordForm: "adjective",
    definitions: [
      {
        partOfSpeech: "adjective",
        definitionEn:
          "Achieving maximum productivity with minimum wasted effort",
        definitionVi: "Hiệu quả; có năng suất cao",
        exampleEn: "She is an efficient manager who completes tasks on time.",
        exampleVi:
          "Cô ấy là một nhà quản lý hiệu quả, hoàn thành công việc đúng hạn.",
        tips: "Noun: efficiency; Adverb: efficiently. Gặp nhiều trong Part 5 & 6.",
        sortOrder: 0,
      },
    ],
  },

  productivity: {
    term: "productivity",
    phonetic: "/ˌprɒdʌkˈtɪvɪti/",
    topic: "Business & Office",
    level: 1,
    wordForm: "noun",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn:
          "The effectiveness of productive effort; output per unit of input",
        definitionVi: "Năng suất lao động",
        exampleEn:
          "Remote work has increased employee productivity significantly.",
        exampleVi: "Làm việc từ xa đã tăng đáng kể năng suất của nhân viên.",
        sortOrder: 0,
      },
    ],
  },

  correspondence: {
    term: "correspondence",
    phonetic: "/ˌkɒrɪˈspɒndəns/",
    topic: "Business & Office",
    level: 2,
    wordForm: "noun",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn:
          "Letters or emails exchanged between individuals or organizations",
        definitionVi: "Thư từ; sự liên lạc qua thư/email",
        exampleEn: "All correspondence must be archived in the system.",
        exampleVi: "Tất cả thư từ phải được lưu trữ trong hệ thống.",
        sortOrder: 0,
      },
    ],
  },

  acknowledge: {
    term: "acknowledge",
    phonetic: "/əkˈnɒlɪdʒ/",
    topic: "Business & Office",
    level: 2,
    wordForm: "verb",
    definitions: [
      {
        partOfSpeech: "verb",
        definitionEn:
          "To confirm receipt of or to recognize something formally",
        definitionVi: "Xác nhận (đã nhận); thừa nhận",
        exampleEn: "Please acknowledge receipt of this email by end of day.",
        exampleVi: "Vui lòng xác nhận đã nhận được email này trước cuối ngày.",
        tips: "Noun: acknowledgment. Hay xuất hiện trong email mẫu TOEIC Part 7.",
        sortOrder: 0,
      },
    ],
  },

  enclose: {
    term: "enclose",
    phonetic: "/ɪnˈkloʊz/",
    topic: "Business & Office",
    level: 2,
    wordForm: "verb",
    definitions: [
      {
        partOfSpeech: "verb",
        definitionEn: "To include something in an envelope or package",
        definitionVi: "Kèm theo; đính kèm (trong thư)",
        exampleEn: "Please find enclosed a copy of the signed contract.",
        exampleVi: "Kính gửi kèm theo bản hợp đồng đã ký.",
        tips: "Enclosure = tài liệu đính kèm trong thư truyền thống",
        sortOrder: 0,
      },
    ],
  },

  pursuant: {
    term: "pursuant",
    phonetic: "/pərˈsuːənt/",
    topic: "Business & Office",
    level: 2,
    wordForm: "adjective",
    definitions: [
      {
        partOfSpeech: "adjective",
        definitionEn: "In accordance with or following",
        definitionVi: "Theo; căn cứ theo; phù hợp với",
        exampleEn: "Pursuant to our agreement, payment is due within 14 days.",
        exampleVi:
          "Căn cứ theo thỏa thuận của chúng ta, thanh toán phải thực hiện trong 14 ngày.",
        tips: "Chỉ dùng trong văn phong trang trọng. Luôn đi kèm 'to': pursuant to.",
        sortOrder: 0,
      },
    ],
  },

  sincerely: {
    term: "sincerely",
    phonetic: "/sɪnˈsɪərli/",
    topic: "Business & Office",
    level: 2,
    wordForm: "adverb",
    definitions: [
      {
        partOfSpeech: "adverb",
        definitionEn: "In a sincere manner; genuinely and honestly",
        definitionVi: "Thành thật; chân thành",
        exampleEn: "Yours sincerely, James",
        exampleVi: "Trân trọng kính chào, James",
        tips: "Cụm kết thư: 'Yours sincerely' (khi biết tên) vs 'Yours faithfully' (khi không biết tên).",
        sortOrder: 0,
      },
    ],
  },

  clarify: {
    term: "clarify",
    phonetic: "/ˈklærɪfaɪ/",
    topic: "Business & Office",
    level: 2,
    wordForm: "verb",
    definitions: [
      {
        partOfSpeech: "verb",
        definitionEn:
          "To make something easier to understand by explaining it more clearly",
        definitionVi: "Làm rõ; giải thích rõ ràng hơn",
        exampleEn: "Could you clarify the terms of the agreement?",
        exampleVi: "Bạn có thể làm rõ các điều khoản của thỏa thuận không?",
        sortOrder: 0,
      },
    ],
  },

  elaborate: {
    term: "elaborate",
    phonetic: "/ɪˈlæbərɪt/ (adj), /ɪˈlæbəreɪt/ (v)",
    topic: "Business & Office",
    level: 2,
    wordForm: "verb/adjective",
    definitions: [
      {
        partOfSpeech: "verb",
        definitionEn: "To explain or describe something in more detail",
        definitionVi: "Giải thích chi tiết hơn; trình bày đầy đủ hơn",
        exampleEn: "Could you elaborate on your proposal?",
        exampleVi:
          "Bạn có thể giải thích chi tiết hơn về đề xuất của mình không?",
        sortOrder: 0,
      },
      {
        partOfSpeech: "adjective",
        definitionEn: "Detailed and complicated in design and planning",
        definitionVi: "Phức tạp; công phu; tỉ mỉ",
        exampleEn: "The marketing team prepared an elaborate presentation.",
        exampleVi: "Nhóm marketing đã chuẩn bị một bài thuyết trình công phu.",
        sortOrder: 1,
      },
    ],
  },

  tentative: {
    term: "tentative",
    phonetic: "/ˈtɛntətɪv/",
    topic: "Business & Office",
    level: 2,
    wordForm: "adjective",
    definitions: [
      {
        partOfSpeech: "adjective",
        definitionEn: "Not final; done as a trial or attempt; uncertain",
        definitionVi: "Tạm thời; chưa chính thức; dự kiến",
        exampleEn: "We have a tentative schedule for the product launch.",
        exampleVi: "Chúng tôi có lịch dự kiến cho việc ra mắt sản phẩm.",
        tips: "Gặp nhiều ở Part 3 & 4 khi nói về kế hoạch chưa chắc chắn.",
        sortOrder: 0,
      },
    ],
  },

  attached: {
    term: "attached",
    phonetic: "/əˈtætʃt/",
    topic: "Business & Office",
    level: 2,
    wordForm: "adjective",
    definitions: [
      {
        partOfSpeech: "adjective",
        definitionEn: "Joined or connected; included with a message",
        definitionVi: "Đính kèm; gắn liền",
        exampleEn: "Please see the attached file for more details.",
        exampleVi: "Vui lòng xem file đính kèm để biết thêm chi tiết.",
        sortOrder: 0,
      },
    ],
  },

  forthcoming: {
    term: "forthcoming",
    phonetic: "/ˌfɔːrθˈkʌmɪŋ/",
    topic: "Business & Office",
    level: 2,
    wordForm: "adjective",
    definitions: [
      {
        partOfSpeech: "adjective",
        definitionEn: "About to happen or appear soon",
        definitionVi: "Sắp tới; sắp diễn ra",
        exampleEn:
          "Details about the forthcoming merger will be announced next week.",
        exampleVi: "Thông tin về vụ sáp nhập sắp tới sẽ được công bố tuần tới.",
        sortOrder: 0,
      },
    ],
  },

  delegate: {
    term: "delegate",
    phonetic: "/ˈdɛlɪɡeɪt/ (v), /ˈdɛlɪɡɪt/ (n)",
    topic: "Business & Office",
    level: 3,
    wordForm: "verb/noun",
    definitions: [
      {
        partOfSpeech: "verb",
        definitionEn: "To entrust a task or responsibility to another person",
        definitionVi: "Ủy quyền; giao phó (nhiệm vụ)",
        exampleEn: "A good manager knows how to delegate tasks effectively.",
        exampleVi: "Một nhà quản lý giỏi biết cách ủy quyền nhiệm vụ hiệu quả.",
        sortOrder: 0,
      },
      {
        partOfSpeech: "noun",
        definitionEn: "A person sent to represent others",
        definitionVi: "Đại biểu; người đại diện",
        exampleEn: "The conference welcomed delegates from 30 countries.",
        exampleVi: "Hội nghị chào đón các đại biểu đến từ 30 quốc gia.",
        sortOrder: 1,
      },
    ],
  },

  supervise: {
    term: "supervise",
    phonetic: "/ˈsuːpərvaɪz/",
    topic: "Business & Office",
    level: 3,
    wordForm: "verb",
    definitions: [
      {
        partOfSpeech: "verb",
        definitionEn:
          "To observe and direct the execution of a task or the work of a person",
        definitionVi: "Giám sát; quản lý; trông coi",
        exampleEn: "She was asked to supervise the new interns.",
        exampleVi: "Cô ấy được yêu cầu giám sát các thực tập sinh mới.",
        tips: "Noun: supervisor (người giám sát); supervision (sự giám sát)",
        sortOrder: 0,
      },
    ],
  },

  appraise: {
    term: "appraise",
    phonetic: "/əˈpreɪz/",
    topic: "Business & Office",
    level: 3,
    wordForm: "verb",
    definitions: [
      {
        partOfSpeech: "verb",
        definitionEn:
          "To assess the value, quality, or performance of something or someone",
        definitionVi: "Đánh giá; thẩm định",
        exampleEn: "Managers appraise employees' performance annually.",
        exampleVi: "Các nhà quản lý đánh giá hiệu suất của nhân viên hàng năm.",
        tips: "Noun: appraisal (bài đánh giá). Đừng nhầm với 'apprise' (thông báo).",
        sortOrder: 0,
      },
    ],
  },

  incentive: {
    term: "incentive",
    phonetic: "/ɪnˈsɛntɪv/",
    topic: "Business & Office",
    level: 3,
    wordForm: "noun",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn:
          "A thing that motivates or encourages someone to do something",
        definitionVi: "Động lực; phần thưởng khuyến khích",
        exampleEn:
          "The company offers financial incentives for high performance.",
        exampleVi:
          "Công ty cung cấp các khuyến khích tài chính cho hiệu suất cao.",
        sortOrder: 0,
      },
    ],
  },

  accountability: {
    term: "accountability",
    phonetic: "/əˌkaʊntəˈbɪlɪti/",
    topic: "Business & Office",
    level: 3,
    wordForm: "noun",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn:
          "The fact of being responsible for your decisions or actions",
        definitionVi: "Trách nhiệm giải trình; trách nhiệm cá nhân",
        exampleEn:
          "There needs to be greater accountability in corporate governance.",
        exampleVi:
          "Cần có trách nhiệm giải trình cao hơn trong quản trị doanh nghiệp.",
        sortOrder: 0,
      },
    ],
  },

  initiative: {
    term: "initiative",
    phonetic: "/ɪˈnɪʃɪətɪv/",
    topic: "Business & Office",
    level: 3,
    wordForm: "noun",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn:
          "The ability to assess and initiate things independently; a plan or strategy",
        definitionVi: "Sáng kiến; tinh thần chủ động; kế hoạch hành động",
        exampleEn: "The cost-saving initiative helped reduce overhead by 15%.",
        exampleVi:
          "Sáng kiến tiết kiệm chi phí đã giúp giảm chi phí hoạt động 15%.",
        sortOrder: 0,
      },
    ],
  },

  benchmark: {
    term: "benchmark",
    phonetic: "/ˈbɛntʃmɑːrk/",
    topic: "Business & Office",
    level: 3,
    wordForm: "noun/verb",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn: "A standard or reference point used for comparison",
        definitionVi: "Chuẩn mốc; tiêu chuẩn so sánh",
        exampleEn:
          "Industry benchmarks show our productivity is above average.",
        exampleVi:
          "Các tiêu chuẩn ngành cho thấy năng suất của chúng tôi cao hơn mức trung bình.",
        sortOrder: 0,
      },
    ],
  },

  hierarchy: {
    term: "hierarchy",
    phonetic: "/ˈhaɪərɑːrki/",
    topic: "Business & Office",
    level: 3,
    wordForm: "noun",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn:
          "A system in which members of an organization are ranked according to authority",
        definitionVi: "Hệ thống cấp bậc; trật tự thứ bậc",
        exampleEn: "Decisions must go through the corporate hierarchy.",
        exampleVi: "Các quyết định phải trải qua hệ thống cấp bậc của công ty.",
        sortOrder: 0,
      },
    ],
  },

  consensus: {
    term: "consensus",
    phonetic: "/kənˈsɛnsəs/",
    topic: "Business & Office",
    level: 3,
    wordForm: "noun",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn: "A general agreement among a group of people",
        definitionVi: "Sự đồng thuận; quan điểm chung",
        exampleEn: "The board reached a consensus to expand operations abroad.",
        exampleVi:
          "Hội đồng đã đạt được sự đồng thuận để mở rộng hoạt động ra nước ngoài.",
        sortOrder: 0,
      },
    ],
  },

  restructure: {
    term: "restructure",
    phonetic: "/ˌriːˈstrʌktʃər/",
    topic: "Business & Office",
    level: 3,
    wordForm: "verb",
    definitions: [
      {
        partOfSpeech: "verb",
        definitionEn: "To organize or arrange something in a new way",
        definitionVi: "Tái cơ cấu; sắp xếp lại cấu trúc",
        exampleEn: "The company plans to restructure its sales division.",
        exampleVi: "Công ty có kế hoạch tái cơ cấu bộ phận bán hàng.",
        sortOrder: 0,
      },
    ],
  },

  // ── FINANCE & BANKING ──────────────────────

  deposit: {
    term: "deposit",
    phonetic: "/dɪˈpɒzɪt/",
    topic: "Finance & Banking",
    level: 1,
    wordForm: "noun/verb",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn: "A sum of money placed into a bank account",
        definitionVi: "Tiền gửi; khoản ký gửi",
        exampleEn: "She made a deposit of $500 into her savings account.",
        exampleVi: "Cô ấy đã gửi 500 đô vào tài khoản tiết kiệm.",
        sortOrder: 0,
      },
      {
        partOfSpeech: "verb",
        definitionEn: "To put money into a bank account",
        definitionVi: "Gửi tiền (vào ngân hàng)",
        exampleEn: "Please deposit the check within three business days.",
        exampleVi: "Vui lòng nộp séc trong vòng ba ngày làm việc.",
        sortOrder: 1,
      },
    ],
  },

  withdrawal: {
    term: "withdrawal",
    phonetic: "/wɪðˈdrɔːəl/",
    topic: "Finance & Banking",
    level: 1,
    wordForm: "noun",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn: "The action of taking money out of a bank account",
        definitionVi: "Việc rút tiền (khỏi ngân hàng)",
        exampleEn: "There is a fee for each ATM withdrawal.",
        exampleVi: "Có phí cho mỗi lần rút tiền tại ATM.",
        sortOrder: 0,
      },
    ],
  },

  balance: {
    term: "balance",
    phonetic: "/ˈbæləns/",
    topic: "Finance & Banking",
    level: 1,
    wordForm: "noun/verb",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn:
          "The amount of money in a bank account at a particular time",
        definitionVi: "Số dư (tài khoản); cân bằng",
        exampleEn: "Your current account balance is $1,250.",
        exampleVi: "Số dư tài khoản hiện tại của bạn là 1.250 đô.",
        sortOrder: 0,
      },
    ],
  },

  transaction: {
    term: "transaction",
    phonetic: "/trænˈzækʃən/",
    topic: "Finance & Banking",
    level: 1,
    wordForm: "noun",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn: "An instance of buying or selling; a financial exchange",
        definitionVi: "Giao dịch; hoạt động mua bán",
        exampleEn: "All transactions are recorded in the system automatically.",
        exampleVi: "Tất cả giao dịch được ghi lại trong hệ thống tự động.",
        sortOrder: 0,
      },
    ],
  },

  interest: {
    term: "interest",
    phonetic: "/ˈɪntrɪst/",
    topic: "Finance & Banking",
    level: 1,
    wordForm: "noun",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn:
          "Money paid regularly at a rate for the use of money lent",
        definitionVi: "Lãi suất; tiền lãi",
        exampleEn: "The loan has an annual interest rate of 5%.",
        exampleVi: "Khoản vay có lãi suất hàng năm là 5%.",
        sortOrder: 0,
      },
    ],
  },

  loan: {
    term: "loan",
    phonetic: "/loʊn/",
    topic: "Finance & Banking",
    level: 1,
    wordForm: "noun/verb",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn:
          "A sum of money lent that must be repaid, usually with interest",
        definitionVi: "Khoản vay; tiền cho vay",
        exampleEn: "She applied for a small business loan.",
        exampleVi: "Cô ấy đã đăng ký vay vốn doanh nghiệp nhỏ.",
        sortOrder: 0,
      },
    ],
  },

  mortgage: {
    term: "mortgage",
    phonetic: "/ˈmɔːrɡɪdʒ/",
    topic: "Finance & Banking",
    level: 1,
    wordForm: "noun/verb",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn:
          "A legal agreement by which money is lent in exchange for property as security",
        definitionVi: "Thế chấp; khoản vay mua nhà",
        exampleEn: "They took out a 30-year mortgage to buy the house.",
        exampleVi: "Họ đã vay thế chấp 30 năm để mua ngôi nhà.",
        sortOrder: 0,
      },
    ],
  },

  collateral: {
    term: "collateral",
    phonetic: "/kəˈlætərəl/",
    topic: "Finance & Banking",
    level: 1,
    wordForm: "noun/adjective",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn: "Property pledged as security for repayment of a loan",
        definitionVi: "Tài sản thế chấp; vật đảm bảo khoản vay",
        exampleEn: "The bank required collateral before approving the loan.",
        exampleVi:
          "Ngân hàng yêu cầu tài sản thế chấp trước khi chấp thuận khoản vay.",
        sortOrder: 0,
      },
    ],
  },

  overdraft: {
    term: "overdraft",
    phonetic: "/ˈoʊvərdrɑːft/",
    topic: "Finance & Banking",
    level: 1,
    wordForm: "noun",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn:
          "A deficit in a bank account caused by drawing more money than the account holds",
        definitionVi: "Thấu chi; rút quá số dư tài khoản",
        exampleEn:
          "He incurred an overdraft fee after spending beyond his account limit.",
        exampleVi:
          "Anh ấy bị tính phí thấu chi sau khi chi tiêu vượt hạn mức tài khoản.",
        sortOrder: 0,
      },
    ],
  },

  dividend: {
    term: "dividend",
    phonetic: "/ˈdɪvɪdɛnd/",
    topic: "Finance & Banking",
    level: 1,
    wordForm: "noun",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn:
          "A sum of money paid regularly to shareholders from a company's profits",
        definitionVi: "Cổ tức; lợi tức cổ phần",
        exampleEn: "Shareholders will receive a quarterly dividend payment.",
        exampleVi: "Các cổ đông sẽ nhận được khoản thanh toán cổ tức hàng quý.",
        sortOrder: 0,
      },
    ],
  },

  revenue: {
    term: "revenue",
    phonetic: "/ˈrɛvɪnjuː/",
    topic: "Finance & Banking",
    level: 2,
    wordForm: "noun",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn:
          "Income generated from business activities before expenses",
        definitionVi: "Doanh thu; nguồn thu",
        exampleEn: "The company's annual revenue exceeded $10 million.",
        exampleVi: "Doanh thu hàng năm của công ty vượt 10 triệu đô.",
        sortOrder: 0,
      },
    ],
  },

  liability: {
    term: "liability",
    phonetic: "/ˌlaɪəˈbɪlɪti/",
    topic: "Finance & Banking",
    level: 2,
    wordForm: "noun",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn: "A company's legal financial debts or obligations",
        definitionVi: "Nợ phải trả; trách nhiệm pháp lý tài chính",
        exampleEn: "The company's liabilities exceeded its assets.",
        exampleVi: "Nợ phải trả của công ty vượt quá tài sản.",
        sortOrder: 0,
      },
    ],
  },

  asset: {
    term: "asset",
    phonetic: "/ˈæsɛt/",
    topic: "Finance & Banking",
    level: 2,
    wordForm: "noun",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn:
          "A resource with economic value owned by an individual or company",
        definitionVi: "Tài sản (có giá trị kinh tế)",
        exampleEn: "Real estate is one of the company's most valuable assets.",
        exampleVi:
          "Bất động sản là một trong những tài sản quý giá nhất của công ty.",
        sortOrder: 0,
      },
    ],
  },

  equity: {
    term: "equity",
    phonetic: "/ˈɛkwɪti/",
    topic: "Finance & Banking",
    level: 2,
    wordForm: "noun",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn:
          "The value of the shares issued by a company; ownership interest",
        definitionVi: "Vốn chủ sở hữu; cổ phần",
        exampleEn: "The startup offered equity to early investors.",
        exampleVi:
          "Công ty khởi nghiệp đã cung cấp cổ phần cho các nhà đầu tư đầu tiên.",
        sortOrder: 0,
      },
    ],
  },

  depreciation: {
    term: "depreciation",
    phonetic: "/dɪˌpriːʃɪˈeɪʃən/",
    topic: "Finance & Banking",
    level: 2,
    wordForm: "noun",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn:
          "A reduction in the value of an asset over time due to wear and tear",
        definitionVi: "Khấu hao tài sản; sự giảm giá trị",
        exampleEn: "The equipment's depreciation is recorded annually.",
        exampleVi: "Khấu hao thiết bị được ghi nhận hàng năm.",
        sortOrder: 0,
      },
    ],
  },

  amortize: {
    term: "amortize",
    phonetic: "/ˈæmərtaɪz/",
    topic: "Finance & Banking",
    level: 2,
    wordForm: "verb",
    definitions: [
      {
        partOfSpeech: "verb",
        definitionEn:
          "To gradually write off the initial cost of an asset over a period",
        definitionVi: "Phân bổ dần (chi phí); khấu trừ dần",
        exampleEn: "The startup costs were amortized over five years.",
        exampleVi: "Chi phí khởi động được phân bổ dần trong năm năm.",
        sortOrder: 0,
      },
    ],
  },

  audit: {
    term: "audit",
    phonetic: "/ˈɔːdɪt/",
    topic: "Finance & Banking",
    level: 2,
    wordForm: "noun/verb",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn: "An official inspection of an organization's accounts",
        definitionVi: "Cuộc kiểm toán; kiểm tra tài chính",
        exampleEn: "The company undergoes an external audit every year.",
        exampleVi: "Công ty trải qua kiểm toán bên ngoài mỗi năm.",
        sortOrder: 0,
      },
    ],
  },

  reconcile: {
    term: "reconcile",
    phonetic: "/ˈrɛkənsaɪl/",
    topic: "Finance & Banking",
    level: 2,
    wordForm: "verb",
    definitions: [
      {
        partOfSpeech: "verb",
        definitionEn: "To make financial accounts consistent with each other",
        definitionVi: "Đối chiếu (tài khoản); làm cho khớp nhau",
        exampleEn: "Accountants reconcile the bank statements monthly.",
        exampleVi: "Kế toán đối chiếu sao kê ngân hàng hàng tháng.",
        sortOrder: 0,
      },
    ],
  },

  fiscal: {
    term: "fiscal",
    phonetic: "/ˈfɪskəl/",
    topic: "Finance & Banking",
    level: 2,
    wordForm: "adjective",
    definitions: [
      {
        partOfSpeech: "adjective",
        definitionEn:
          "Relating to government revenue, especially taxes; or financial matters",
        definitionVi: "Thuộc về tài chính; thuộc về ngân sách nhà nước",
        exampleEn: "The fiscal year ends on December 31st.",
        exampleVi: "Năm tài chính kết thúc vào ngày 31 tháng 12.",
        tips: "Fiscal year = năm tài chính (có thể không trùng với năm dương lịch)",
        sortOrder: 0,
      },
    ],
  },

  forecast: {
    term: "forecast",
    phonetic: "/ˈfɔːrkæst/",
    topic: "Finance & Banking",
    level: 2,
    wordForm: "noun/verb",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn:
          "A prediction of future financial performance based on current trends",
        definitionVi: "Dự báo; dự đoán (tài chính, thị trường)",
        exampleEn: "The sales forecast for Q4 looks optimistic.",
        exampleVi: "Dự báo doanh số cho quý 4 trông khá lạc quan.",
        sortOrder: 0,
      },
    ],
  },

  portfolio: {
    term: "portfolio",
    phonetic: "/pɔːrtˈfoʊlioʊ/",
    topic: "Finance & Banking",
    level: 3,
    wordForm: "noun",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn:
          "A range of investments held by an individual or institution",
        definitionVi: "Danh mục đầu tư",
        exampleEn: "He diversified his portfolio to minimize risk.",
        exampleVi: "Anh ấy đa dạng hóa danh mục đầu tư để giảm thiểu rủi ro.",
        sortOrder: 0,
      },
    ],
  },

  volatility: {
    term: "volatility",
    phonetic: "/ˌvɒləˈtɪlɪti/",
    topic: "Finance & Banking",
    level: 3,
    wordForm: "noun",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn:
          "Tendency to change rapidly and unpredictably, especially in price",
        definitionVi: "Tính biến động; sự không ổn định (giá cả)",
        exampleEn: "Market volatility has made investors cautious.",
        exampleVi:
          "Sự biến động của thị trường khiến các nhà đầu tư thận trọng.",
        sortOrder: 0,
      },
    ],
  },

  liquidity: {
    term: "liquidity",
    phonetic: "/lɪˈkwɪdɪti/",
    topic: "Finance & Banking",
    level: 3,
    wordForm: "noun",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn:
          "The availability of liquid assets; how quickly assets can be converted to cash",
        definitionVi: "Tính thanh khoản; khả năng chuyển đổi thành tiền mặt",
        exampleEn: "High liquidity is essential during a financial crisis.",
        exampleVi:
          "Tính thanh khoản cao là điều cần thiết trong khủng hoảng tài chính.",
        sortOrder: 0,
      },
    ],
  },

  diversify: {
    term: "diversify",
    phonetic: "/daɪˈvɜːrsɪfaɪ/",
    topic: "Finance & Banking",
    level: 3,
    wordForm: "verb",
    definitions: [
      {
        partOfSpeech: "verb",
        definitionEn:
          "To spread investments across different assets to reduce risk",
        definitionVi: "Đa dạng hóa (đầu tư); mở rộng sang lĩnh vực khác",
        exampleEn: "Investors should diversify their portfolios.",
        exampleVi: "Các nhà đầu tư nên đa dạng hóa danh mục của mình.",
        sortOrder: 0,
      },
    ],
  },

  acquisition: {
    term: "acquisition",
    phonetic: "/ˌækwɪˈzɪʃən/",
    topic: "Finance & Banking",
    level: 3,
    wordForm: "noun",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn: "The purchase of one company by another",
        definitionVi: "Sự mua lại (công ty); thâu tóm",
        exampleEn:
          "The tech giant announced the acquisition of a startup for $2 billion.",
        exampleVi:
          "Tập đoàn công nghệ thông báo mua lại một startup với giá 2 tỷ đô.",
        sortOrder: 0,
      },
    ],
  },

  merger: {
    term: "merger",
    phonetic: "/ˈmɜːrdʒər/",
    topic: "Finance & Banking",
    level: 3,
    wordForm: "noun",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn: "The combining of two companies into one",
        definitionVi: "Sự sáp nhập (công ty)",
        exampleEn:
          "The merger created one of the largest banks in the country.",
        exampleVi:
          "Vụ sáp nhập đã tạo ra một trong những ngân hàng lớn nhất trong nước.",
        sortOrder: 0,
      },
    ],
  },

  shareholder: {
    term: "shareholder",
    phonetic: "/ˈʃɛrhəʊldər/",
    topic: "Finance & Banking",
    level: 3,
    wordForm: "noun",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn: "A person or institution that owns shares in a company",
        definitionVi: "Cổ đông; người nắm giữ cổ phần",
        exampleEn: "Shareholders voted to approve the new board of directors.",
        exampleVi: "Các cổ đông bỏ phiếu chấp thuận hội đồng quản trị mới.",
        sortOrder: 0,
      },
    ],
  },

  quarterly: {
    term: "quarterly",
    phonetic: "/ˈkwɔːrtərli/",
    topic: "Finance & Banking",
    level: 3,
    wordForm: "adjective/adverb",
    definitions: [
      {
        partOfSpeech: "adjective",
        definitionEn:
          "Done or occurring four times a year, once every three months",
        definitionVi: "Hàng quý; theo quý",
        exampleEn: "The company publishes quarterly earnings reports.",
        exampleVi: "Công ty công bố báo cáo thu nhập hàng quý.",
        sortOrder: 0,
      },
    ],
  },

  yield: {
    term: "yield",
    phonetic: "/jiːld/",
    topic: "Finance & Banking",
    level: 3,
    wordForm: "noun/verb",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn:
          "The earnings generated on an investment, expressed as a percentage",
        definitionVi: "Lợi suất; tỉ suất sinh lợi",
        exampleEn: "The bond has a yield of 4% per annum.",
        exampleVi: "Trái phiếu có lợi suất 4% mỗi năm.",
        sortOrder: 0,
      },
    ],
  },

  deficit: {
    term: "deficit",
    phonetic: "/ˈdɛfɪsɪt/",
    topic: "Finance & Banking",
    level: 3,
    wordForm: "noun",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn:
          "The amount by which expenditure exceeds income or revenue",
        definitionVi: "Thâm hụt; khoản thiếu hụt",
        exampleEn: "The government ran a budget deficit of 3% of GDP.",
        exampleVi: "Chính phủ thâm hụt ngân sách 3% GDP.",
        sortOrder: 0,
      },
    ],
  },

  // ── MARKETING & SALES ──────────────────────

  campaign: {
    term: "campaign",
    phonetic: "/kæmˈpeɪn/",
    topic: "Marketing & Sales",
    level: 1,
    wordForm: "noun/verb",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn:
          "A series of coordinated activities designed to achieve a specific goal",
        definitionVi: "Chiến dịch (marketing, quảng cáo)",
        exampleEn:
          "The advertising campaign ran across TV, social media, and print.",
        exampleVi: "Chiến dịch quảng cáo chạy trên TV, mạng xã hội và báo in.",
        sortOrder: 0,
      },
    ],
  },

  branding: {
    term: "branding",
    phonetic: "/ˈbrændɪŋ/",
    topic: "Marketing & Sales",
    level: 1,
    wordForm: "noun",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn:
          "The process of creating a unique name and image for a product in consumers' minds",
        definitionVi: "Xây dựng thương hiệu; nhận diện thương hiệu",
        exampleEn:
          "Strong branding helps customers recognize and trust the product.",
        exampleVi:
          "Thương hiệu mạnh giúp khách hàng nhận biết và tin tưởng sản phẩm.",
        sortOrder: 0,
      },
    ],
  },

  demographic: {
    term: "demographic",
    phonetic: "/ˌdɛməˈɡræfɪk/",
    topic: "Marketing & Sales",
    level: 1,
    wordForm: "noun/adjective",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn:
          "A particular group within a population sharing similar characteristics",
        definitionVi: "Nhóm nhân khẩu học; phân khúc dân số",
        exampleEn: "The product targets the 18-35 demographic.",
        exampleVi: "Sản phẩm nhắm vào nhóm khách hàng từ 18-35 tuổi.",
        sortOrder: 0,
      },
    ],
  },

  segment: {
    term: "segment",
    phonetic: "/ˈsɛɡmənt/",
    topic: "Marketing & Sales",
    level: 1,
    wordForm: "noun/verb",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn:
          "A part or section of a market defined by specific characteristics",
        definitionVi: "Phân khúc (thị trường); đoạn thị trường",
        exampleEn: "The luxury segment is growing faster than the mass market.",
        exampleVi:
          "Phân khúc cao cấp đang tăng trưởng nhanh hơn thị trường đại trà.",
        sortOrder: 0,
      },
    ],
  },

  promotion: {
    term: "promotion",
    phonetic: "/prəˈmoʊʃən/",
    topic: "Marketing & Sales",
    level: 1,
    wordForm: "noun",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn:
          "Activity that supports or encourages a product or service",
        definitionVi: "Khuyến mãi; xúc tiến bán hàng; sự thăng chức",
        exampleEn:
          "The store is running a buy-one-get-one promotion this weekend.",
        exampleVi:
          "Cửa hàng đang chạy chương trình khuyến mãi mua 1 tặng 1 cuối tuần này.",
        sortOrder: 0,
      },
    ],
  },

  endorse: {
    term: "endorse",
    phonetic: "/ɪnˈdɔːrs/",
    topic: "Marketing & Sales",
    level: 1,
    wordForm: "verb",
    definitions: [
      {
        partOfSpeech: "verb",
        definitionEn: "To publicly support or recommend a product or person",
        definitionVi: "Xác nhận; chứng thực; quảng bá (sản phẩm)",
        exampleEn: "The company hired a celebrity to endorse the new product.",
        exampleVi: "Công ty thuê người nổi tiếng để quảng bá sản phẩm mới.",
        tips: "Noun: endorsement (sự chứng thực; hợp đồng quảng bá thương hiệu)",
        sortOrder: 0,
      },
    ],
  },

  testimonial: {
    term: "testimonial",
    phonetic: "/ˌtɛstɪˈmoʊniəl/",
    topic: "Marketing & Sales",
    level: 1,
    wordForm: "noun",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn:
          "A customer's written or spoken statement praising a product or service",
        definitionVi: "Lời chứng thực; nhận xét từ khách hàng",
        exampleEn:
          "The website features testimonials from satisfied customers.",
        exampleVi: "Trang web có các lời chứng thực từ khách hàng hài lòng.",
        sortOrder: 0,
      },
    ],
  },

  slogan: {
    term: "slogan",
    phonetic: "/ˈsloʊɡən/",
    topic: "Marketing & Sales",
    level: 1,
    wordForm: "noun",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn: "A short memorable phrase used in advertising",
        definitionVi: "Khẩu hiệu; slogan quảng cáo",
        exampleEn: "The brand's slogan is 'Just Do It'.",
        exampleVi: "Khẩu hiệu của thương hiệu là 'Just Do It'.",
        sortOrder: 0,
      },
    ],
  },

  target: {
    term: "target",
    phonetic: "/ˈtɑːrɡɪt/",
    topic: "Marketing & Sales",
    level: 1,
    wordForm: "noun/verb",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn:
          "A person, group, or object aimed at; a goal or objective",
        definitionVi: "Mục tiêu; đối tượng mục tiêu",
        exampleEn: "The target market for this product is young professionals.",
        exampleVi:
          "Thị trường mục tiêu của sản phẩm này là các chuyên gia trẻ.",
        sortOrder: 0,
      },
    ],
  },

  niche: {
    term: "niche",
    phonetic: "/niːʃ/",
    topic: "Marketing & Sales",
    level: 1,
    wordForm: "noun/adjective",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn:
          "A specialized segment of the market for a particular kind of product or service",
        definitionVi: "Thị trường ngách; phân khúc đặc thù",
        exampleEn: "They found a profitable niche in eco-friendly packaging.",
        exampleVi:
          "Họ tìm thấy một thị trường ngách có lợi trong bao bì thân thiện môi trường.",
        sortOrder: 0,
      },
    ],
  },

  negotiate: {
    term: "negotiate",
    phonetic: "/nɪˈɡoʊʃɪeɪt/",
    topic: "Marketing & Sales",
    level: 2,
    wordForm: "verb",
    definitions: [
      {
        partOfSpeech: "verb",
        definitionEn: "To try to reach an agreement through discussion",
        definitionVi: "Đàm phán; thương lượng",
        exampleEn: "We need to negotiate better terms with the supplier.",
        exampleVi:
          "Chúng tôi cần đàm phán điều khoản tốt hơn với nhà cung cấp.",
        sortOrder: 0,
      },
    ],
  },

  commission: {
    term: "commission",
    phonetic: "/kəˈmɪʃən/",
    topic: "Marketing & Sales",
    level: 2,
    wordForm: "noun",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn:
          "A fee paid to a sales representative as a percentage of sales made",
        definitionVi: "Hoa hồng; tiền hoa hồng bán hàng",
        exampleEn: "Sales reps earn a 10% commission on every deal they close.",
        exampleVi:
          "Nhân viên bán hàng kiếm 10% hoa hồng trên mỗi giao dịch chốt được.",
        sortOrder: 0,
      },
    ],
  },

  quota: {
    term: "quota",
    phonetic: "/ˈkwoʊtə/",
    topic: "Marketing & Sales",
    level: 2,
    wordForm: "noun",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn: "A fixed minimum amount of sales that must be achieved",
        definitionVi: "Hạn ngạch; chỉ tiêu doanh số",
        exampleEn: "Each salesperson is given a monthly sales quota.",
        exampleVi:
          "Mỗi nhân viên bán hàng được giao chỉ tiêu doanh số hàng tháng.",
        sortOrder: 0,
      },
    ],
  },

  prospect: {
    term: "prospect",
    phonetic: "/ˈprɒspɛkt/",
    topic: "Marketing & Sales",
    level: 2,
    wordForm: "noun/verb",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn: "A potential customer; the possibility of future success",
        definitionVi: "Khách hàng tiềm năng; triển vọng",
        exampleEn: "The sales team is reaching out to new prospects.",
        exampleVi: "Nhóm bán hàng đang tiếp cận các khách hàng tiềm năng mới.",
        sortOrder: 0,
      },
    ],
  },

  pitch: {
    term: "pitch",
    phonetic: "/pɪtʃ/",
    topic: "Marketing & Sales",
    level: 2,
    wordForm: "noun/verb",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn:
          "A presentation or speech aimed at persuading someone to buy or invest",
        definitionVi: "Bài thuyết trình bán hàng; lời chào hàng",
        exampleEn: "He delivered an impressive pitch to the investors.",
        exampleVi:
          "Anh ấy đã thực hiện một bài thuyết trình ấn tượng cho các nhà đầu tư.",
        sortOrder: 0,
      },
    ],
  },

  discount: {
    term: "discount",
    phonetic: "/ˈdɪskaʊnt/",
    topic: "Marketing & Sales",
    level: 2,
    wordForm: "noun/verb",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn: "A deduction from the usual cost of something",
        definitionVi: "Chiết khấu; giảm giá",
        exampleEn: "Loyal customers receive a 15% discount on all purchases.",
        exampleVi:
          "Khách hàng trung thành nhận được chiết khấu 15% cho tất cả mua hàng.",
        sortOrder: 0,
      },
    ],
  },

  wholesale: {
    term: "wholesale",
    phonetic: "/ˈhoʊlseɪl/",
    topic: "Marketing & Sales",
    level: 2,
    wordForm: "noun/adjective/adverb",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn: "The selling of goods in large quantities to retailers",
        definitionVi: "Bán buôn; bán sỉ",
        exampleEn: "The company sells products wholesale to distributors.",
        exampleVi: "Công ty bán sản phẩm sỉ cho các nhà phân phối.",
        sortOrder: 0,
      },
    ],
  },

  retail: {
    term: "retail",
    phonetic: "/ˈriːteɪl/",
    topic: "Marketing & Sales",
    level: 2,
    wordForm: "noun/verb",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn: "The sale of goods directly to the public",
        definitionVi: "Bán lẻ",
        exampleEn: "The retail price includes a 30% markup.",
        exampleVi: "Giá bán lẻ đã bao gồm 30% lợi nhuận.",
        sortOrder: 0,
      },
    ],
  },

  bargain: {
    term: "bargain",
    phonetic: "/ˈbɑːrɡɪn/",
    topic: "Marketing & Sales",
    level: 2,
    wordForm: "noun/verb",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn:
          "A good deal; something bought at a lower price than expected",
        definitionVi: "Hàng giá hời; sự thỏa thuận có lợi",
        exampleEn: "She found a real bargain at the year-end sale.",
        exampleVi: "Cô ấy tìm được hàng giá hời ở đợt giảm giá cuối năm.",
        sortOrder: 0,
      },
    ],
  },

  contract: {
    term: "contract",
    phonetic: "/ˈkɒntrækt/",
    topic: "Marketing & Sales",
    level: 2,
    wordForm: "noun/verb",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn: "A written or spoken legal agreement between parties",
        definitionVi: "Hợp đồng; bản ký kết pháp lý",
        exampleEn: "Both parties signed the contract before work began.",
        exampleVi: "Cả hai bên đã ký hợp đồng trước khi bắt đầu công việc.",
        sortOrder: 0,
      },
    ],
  },

  // ── HUMAN RESOURCES ───────────────────────

  applicant: {
    term: "applicant",
    phonetic: "/ˈæplɪkənt/",
    topic: "Human Resources",
    level: 1,
    wordForm: "noun",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn: "A person who formally applies for a job or position",
        definitionVi: "Người nộp đơn; ứng viên",
        exampleEn: "Over 200 applicants applied for the marketing position.",
        exampleVi: "Hơn 200 ứng viên đã nộp đơn cho vị trí marketing.",
        sortOrder: 0,
      },
    ],
  },

  resume: {
    term: "resume",
    phonetic: "/ˈrɛzjuːmeɪ/",
    topic: "Human Resources",
    level: 1,
    wordForm: "noun",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn:
          "A document listing a person's qualifications and work experience",
        definitionVi: "Hồ sơ xin việc; CV",
        exampleEn: "Please submit your resume and a cover letter by Friday.",
        exampleVi: "Vui lòng nộp CV và thư xin việc trước thứ Sáu.",
        tips: "Tương đương: CV (curriculum vitae) – dùng phổ biến ở Anh",
        sortOrder: 0,
      },
    ],
  },

  interview: {
    term: "interview",
    phonetic: "/ˈɪntərvjuː/",
    topic: "Human Resources",
    level: 1,
    wordForm: "noun/verb",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn:
          "A formal meeting in which someone is questioned for a job",
        definitionVi: "Cuộc phỏng vấn",
        exampleEn: "She was nervous before her job interview.",
        exampleVi: "Cô ấy cảm thấy hồi hộp trước cuộc phỏng vấn xin việc.",
        sortOrder: 0,
      },
    ],
  },

  reference: {
    term: "reference",
    phonetic: "/ˈrɛfrəns/",
    topic: "Human Resources",
    level: 1,
    wordForm: "noun",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn:
          "A letter from a previous employer supporting a job candidate",
        definitionVi: "Thư giới thiệu; người bảo lãnh nghề nghiệp",
        exampleEn: "Please provide two professional references.",
        exampleVi: "Vui lòng cung cấp hai người giới thiệu chuyên nghiệp.",
        sortOrder: 0,
      },
    ],
  },

  qualification: {
    term: "qualification",
    phonetic: "/ˌkwɒlɪfɪˈkeɪʃən/",
    topic: "Human Resources",
    level: 1,
    wordForm: "noun",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn:
          "A skill or quality that makes someone suitable for a job",
        definitionVi: "Bằng cấp; năng lực; tiêu chuẩn ứng tuyển",
        exampleEn: "A bachelor's degree is the minimum qualification required.",
        exampleVi: "Bằng cử nhân là tiêu chuẩn tối thiểu được yêu cầu.",
        sortOrder: 0,
      },
    ],
  },

  recruit: {
    term: "recruit",
    phonetic: "/rɪˈkruːt/",
    topic: "Human Resources",
    level: 1,
    wordForm: "verb/noun",
    definitions: [
      {
        partOfSpeech: "verb",
        definitionEn: "To find and hire new employees",
        definitionVi: "Tuyển dụng; chiêu mộ nhân viên",
        exampleEn: "The company plans to recruit 50 new engineers this year.",
        exampleVi: "Công ty có kế hoạch tuyển dụng 50 kỹ sư mới trong năm nay.",
        sortOrder: 0,
      },
    ],
  },

  shortlist: {
    term: "shortlist",
    phonetic: "/ˈʃɔːrtlɪst/",
    topic: "Human Resources",
    level: 1,
    wordForm: "noun/verb",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn:
          "A list of preferred candidates selected from a larger group",
        definitionVi: "Danh sách rút gọn; danh sách ứng viên được chọn lọc",
        exampleEn: "Three candidates were shortlisted for the final round.",
        exampleVi: "Ba ứng viên được đưa vào danh sách rút gọn cho vòng cuối.",
        sortOrder: 0,
      },
    ],
  },

  onboard: {
    term: "onboard",
    phonetic: "/ˈɒnbɔːrd/",
    topic: "Human Resources",
    level: 1,
    wordForm: "verb",
    definitions: [
      {
        partOfSpeech: "verb",
        definitionEn: "To integrate a new employee into an organization",
        definitionVi: "Đào tạo hội nhập; tiếp nhận nhân viên mới",
        exampleEn: "HR will onboard all new hires during orientation week.",
        exampleVi:
          "Bộ phận nhân sự sẽ tiến hành hội nhập tất cả nhân viên mới trong tuần định hướng.",
        sortOrder: 0,
      },
    ],
  },

  probation: {
    term: "probation",
    phonetic: "/prəˈbeɪʃən/",
    topic: "Human Resources",
    level: 1,
    wordForm: "noun",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn: "A trial period for newly hired employees",
        definitionVi: "Thời gian thử việc",
        exampleEn: "All new employees undergo a 90-day probation period.",
        exampleVi:
          "Tất cả nhân viên mới đều phải trải qua thời gian thử việc 90 ngày.",
        sortOrder: 0,
      },
    ],
  },

  vacancy: {
    term: "vacancy",
    phonetic: "/ˈveɪkənsi/",
    topic: "Human Resources",
    level: 1,
    wordForm: "noun",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn: "An available job position that needs to be filled",
        definitionVi: "Vị trí còn trống; chỗ làm việc cần tuyển",
        exampleEn: "There are three vacancies in the accounting department.",
        exampleVi: "Có ba vị trí còn trống trong phòng kế toán.",
        sortOrder: 0,
      },
    ],
  },

  compensation: {
    term: "compensation",
    phonetic: "/ˌkɒmpɛnˈseɪʃən/",
    topic: "Human Resources",
    level: 2,
    wordForm: "noun",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn:
          "Money received in exchange for work; also payment for damages",
        definitionVi: "Thù lao; tiền lương tổng thể; tiền bồi thường",
        exampleEn:
          "The compensation package includes salary, bonus, and health insurance.",
        exampleVi: "Gói thù lao bao gồm lương, thưởng và bảo hiểm sức khỏe.",
        sortOrder: 0,
      },
    ],
  },

  severance: {
    term: "severance",
    phonetic: "/ˈsɛvərəns/",
    topic: "Human Resources",
    level: 2,
    wordForm: "noun",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn: "Money paid to an employee when they are dismissed",
        definitionVi: "Trợ cấp thôi việc; tiền bồi thường khi bị sa thải",
        exampleEn:
          "She received three months of severance pay after the layoff.",
        exampleVi:
          "Cô ấy nhận được 3 tháng trợ cấp thôi việc sau khi bị sa thải.",
        sortOrder: 0,
      },
    ],
  },

  pension: {
    term: "pension",
    phonetic: "/ˈpɛnʃən/",
    topic: "Human Resources",
    level: 2,
    wordForm: "noun",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn: "A regular payment made to retired employees",
        definitionVi: "Lương hưu; chế độ hưu trí",
        exampleEn: "Employees contribute 5% of their salary to a pension fund.",
        exampleVi: "Nhân viên đóng góp 5% lương vào quỹ hưu trí.",
        sortOrder: 0,
      },
    ],
  },

  deductible: {
    term: "deductible",
    phonetic: "/dɪˈdʌktɪbəl/",
    topic: "Human Resources",
    level: 2,
    wordForm: "noun/adjective",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn:
          "The amount you must pay out of pocket before insurance covers the rest",
        definitionVi: "Khoản khấu trừ; phần tự chi trước khi bảo hiểm chi trả",
        exampleEn: "The health plan has a $500 annual deductible.",
        exampleVi: "Kế hoạch sức khỏe có khoản khấu trừ 500 đô mỗi năm.",
        sortOrder: 0,
      },
    ],
  },

  maternity: {
    term: "maternity",
    phonetic: "/məˈtɜːrnɪti/",
    topic: "Human Resources",
    level: 2,
    wordForm: "noun/adjective",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn:
          "The state of being a mother; relating to pregnancy and childbirth",
        definitionVi: "Thiên chức làm mẹ; nghỉ thai sản",
        exampleEn: "She took 12 weeks of maternity leave after giving birth.",
        exampleVi: "Cô ấy đã nghỉ thai sản 12 tuần sau khi sinh.",
        sortOrder: 0,
      },
    ],
  },

  eligible: {
    term: "eligible",
    phonetic: "/ˈɛlɪdʒɪbəl/",
    topic: "Human Resources",
    level: 2,
    wordForm: "adjective",
    definitions: [
      {
        partOfSpeech: "adjective",
        definitionEn: "Qualified or entitled to receive a benefit or take part",
        definitionVi: "Đủ điều kiện; đủ tư cách",
        exampleEn:
          "Employees who have worked for 2+ years are eligible for the bonus.",
        exampleVi:
          "Nhân viên có thâm niên từ 2 năm trở lên đủ điều kiện nhận thưởng.",
        sortOrder: 0,
      },
    ],
  },

  grievance: {
    term: "grievance",
    phonetic: "/ˈɡriːvəns/",
    topic: "Human Resources",
    level: 2,
    wordForm: "noun",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn:
          "A formal complaint made by an employee about workplace issues",
        definitionVi: "Đơn khiếu nại; khiếu kiện trong môi trường làm việc",
        exampleEn:
          "She filed a grievance against her supervisor for unfair treatment.",
        exampleVi:
          "Cô ấy đã nộp đơn khiếu nại chống lại người giám sát vì đối xử bất công.",
        sortOrder: 0,
      },
    ],
  },

  termination: {
    term: "termination",
    phonetic: "/ˌtɜːrmɪˈneɪʃən/",
    topic: "Human Resources",
    level: 2,
    wordForm: "noun",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn: "The formal ending of someone's employment",
        definitionVi: "Sự chấm dứt hợp đồng lao động; sa thải",
        exampleEn:
          "Termination of employment requires 30 days' written notice.",
        exampleVi:
          "Chấm dứt hợp đồng lao động yêu cầu thông báo bằng văn bản 30 ngày.",
        sortOrder: 0,
      },
    ],
  },

  mandatory: {
    term: "mandatory",
    phonetic: "/ˈmændətɔːri/",
    topic: "Human Resources",
    level: 2,
    wordForm: "adjective",
    definitions: [
      {
        partOfSpeech: "adjective",
        definitionEn: "Required by law or authority; compulsory",
        definitionVi: "Bắt buộc; theo quy định",
        exampleEn: "Attendance at the safety training is mandatory.",
        exampleVi: "Tham dự buổi đào tạo an toàn là bắt buộc.",
        sortOrder: 0,
      },
    ],
  },

  compliance: {
    term: "compliance",
    phonetic: "/kəmˈplaɪəns/",
    topic: "Human Resources",
    level: 2,
    wordForm: "noun",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn:
          "The act of conforming to rules, regulations, or requests",
        definitionVi: "Sự tuân thủ (quy định, pháp luật)",
        exampleEn: "The HR department ensures compliance with labor laws.",
        exampleVi: "Phòng nhân sự đảm bảo tuân thủ luật lao động.",
        sortOrder: 0,
      },
    ],
  },

  // ── TRAVEL & TRANSPORTATION ────────────────

  itinerary: {
    term: "itinerary",
    phonetic: "/aɪˈtɪnərəri/",
    topic: "Travel & Transportation",
    level: 1,
    wordForm: "noun",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn: "A planned route or journey schedule",
        definitionVi: "Lịch trình; hành trình chi tiết",
        exampleEn:
          "The travel agent provided a detailed itinerary for the business trip.",
        exampleVi:
          "Đại lý du lịch cung cấp lịch trình chi tiết cho chuyến công tác.",
        sortOrder: 0,
      },
    ],
  },

  boarding: {
    term: "boarding",
    phonetic: "/ˈbɔːrdɪŋ/",
    topic: "Travel & Transportation",
    level: 1,
    wordForm: "noun",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn:
          "The process of getting onto an aircraft or other transport",
        definitionVi: "Việc lên tàu/máy bay; thủ tục lên máy bay",
        exampleEn: "Boarding for flight SQ321 begins at 9:30 AM.",
        exampleVi:
          "Thủ tục lên máy bay cho chuyến SQ321 bắt đầu lúc 9:30 sáng.",
        sortOrder: 0,
      },
    ],
  },

  departure: {
    term: "departure",
    phonetic: "/dɪˈpɑːrtʃər/",
    topic: "Travel & Transportation",
    level: 1,
    wordForm: "noun",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn:
          "The act of leaving a place, especially to start a journey",
        definitionVi: "Sự khởi hành; giờ cất cánh",
        exampleEn: "The departure time has been moved to 11 AM.",
        exampleVi: "Giờ khởi hành đã được dời sang 11 giờ sáng.",
        sortOrder: 0,
      },
    ],
  },

  arrival: {
    term: "arrival",
    phonetic: "/əˈraɪvəl/",
    topic: "Travel & Transportation",
    level: 1,
    wordForm: "noun",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn: "The act of reaching a destination",
        definitionVi: "Sự đến nơi; thời gian hạ cánh",
        exampleEn: "Please check the arrivals board for flight updates.",
        exampleVi:
          "Vui lòng kiểm tra bảng thông báo chuyến đến để cập nhật thông tin.",
        sortOrder: 0,
      },
    ],
  },

  customs: {
    term: "customs",
    phonetic: "/ˈkʌstəmz/",
    topic: "Travel & Transportation",
    level: 1,
    wordForm: "noun",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn:
          "The government department that checks goods entering a country",
        definitionVi: "Hải quan; cơ quan kiểm tra hàng nhập cảnh",
        exampleEn: "You must declare all goods at customs.",
        exampleVi: "Bạn phải khai báo tất cả hàng hóa tại hải quan.",
        sortOrder: 0,
      },
    ],
  },

  baggage: {
    term: "baggage",
    phonetic: "/ˈbæɡɪdʒ/",
    topic: "Travel & Transportation",
    level: 1,
    wordForm: "noun",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn: "Luggage; bags and suitcases taken on a trip",
        definitionVi: "Hành lý",
        exampleEn: "Each passenger is allowed one piece of carry-on baggage.",
        exampleVi: "Mỗi hành khách được phép mang một kiện hành lý xách tay.",
        sortOrder: 0,
      },
    ],
  },

  layover: {
    term: "layover",
    phonetic: "/ˈleɪoʊvər/",
    topic: "Travel & Transportation",
    level: 1,
    wordForm: "noun",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn: "A stopover between connecting flights",
        definitionVi: "Thời gian chờ nối chuyến bay; quá cảnh",
        exampleEn: "There is a 3-hour layover in Hong Kong.",
        exampleVi: "Có 3 tiếng chờ nối chuyến tại Hồng Kông.",
        sortOrder: 0,
      },
    ],
  },

  turbulence: {
    term: "turbulence",
    phonetic: "/ˈtɜːrbjʊləns/",
    topic: "Travel & Transportation",
    level: 1,
    wordForm: "noun",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn:
          "Irregular and abrupt motion of the atmosphere causing a bumpy flight",
        definitionVi: "Nhiễu loạn không khí; xóc máy bay",
        exampleEn: "The captain warned passengers about turbulence ahead.",
        exampleVi: "Cơ trưởng cảnh báo hành khách về nhiễu loạn phía trước.",
        sortOrder: 0,
      },
    ],
  },

  terminal: {
    term: "terminal",
    phonetic: "/ˈtɜːrmɪnəl/",
    topic: "Travel & Transportation",
    level: 1,
    wordForm: "noun/adjective",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn:
          "A station or building where passengers arrive and depart",
        definitionVi: "Nhà ga; sảnh sân bay",
        exampleEn: "International departures are from Terminal 2.",
        exampleVi: "Các chuyến bay quốc tế khởi hành từ Nhà ga 2.",
        sortOrder: 0,
      },
    ],
  },

  passport: {
    term: "passport",
    phonetic: "/ˈpæspɔːrt/",
    topic: "Travel & Transportation",
    level: 1,
    wordForm: "noun",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn:
          "An official document for international travel identifying the holder",
        definitionVi: "Hộ chiếu",
        exampleEn: "Make sure your passport is valid for at least six months.",
        exampleVi: "Đảm bảo hộ chiếu của bạn còn hiệu lực ít nhất sáu tháng.",
        sortOrder: 0,
      },
    ],
  },

  reservation: {
    term: "reservation",
    phonetic: "/ˌrɛzərˈveɪʃən/",
    topic: "Travel & Transportation",
    level: 1,
    wordForm: "noun",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn:
          "An arrangement to have a room, seat, or table kept for you",
        definitionVi: "Đặt chỗ; đặt phòng; đặt bàn",
        exampleEn: "I have a reservation under the name Park.",
        exampleVi: "Tôi có đặt chỗ dưới tên Park.",
        sortOrder: 0,
      },
    ],
  },

  checkout: {
    term: "checkout",
    phonetic: "/ˈtʃɛkaʊt/",
    topic: "Travel & Transportation",
    level: 1,
    wordForm: "noun",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn:
          "The procedure for leaving a hotel when your stay is over",
        definitionVi: "Thủ tục trả phòng khách sạn",
        exampleEn: "Checkout time is 11 AM.",
        exampleVi: "Giờ trả phòng là 11 giờ sáng.",
        sortOrder: 0,
      },
    ],
  },

  amenity: {
    term: "amenity",
    phonetic: "/əˈmiːnɪti/",
    topic: "Travel & Transportation",
    level: 1,
    wordForm: "noun",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn: "A feature that adds comfort or convenience to a place",
        definitionVi: "Tiện nghi; tiện ích (của khách sạn)",
        exampleEn:
          "The hotel offers amenities such as a gym, pool, and free Wi-Fi.",
        exampleVi:
          "Khách sạn cung cấp các tiện nghi như phòng gym, hồ bơi và Wi-Fi miễn phí.",
        sortOrder: 0,
      },
    ],
  },

  concierge: {
    term: "concierge",
    phonetic: "/ˌkɒnsiˈɛərʒ/",
    topic: "Travel & Transportation",
    level: 1,
    wordForm: "noun",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn:
          "A hotel staff member who assists guests with arrangements",
        definitionVi: "Nhân viên tư vấn dịch vụ khách sạn; lễ tân dịch vụ",
        exampleEn: "The concierge recommended a nearby seafood restaurant.",
        exampleVi:
          "Nhân viên tư vấn dịch vụ đề xuất một nhà hàng hải sản gần đó.",
        sortOrder: 0,
      },
    ],
  },

  suite: {
    term: "suite",
    phonetic: "/swiːt/",
    topic: "Travel & Transportation",
    level: 1,
    wordForm: "noun",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn: "A set of connected rooms in a hotel forming a unit",
        definitionVi:
          "Phòng suite; phòng khách sạn cao cấp có phòng khách kèm theo",
        exampleEn:
          "The executive suite includes a living room and private bathroom.",
        exampleVi:
          "Phòng suite hành chính bao gồm phòng khách và phòng tắm riêng.",
        sortOrder: 0,
      },
    ],
  },

  occupancy: {
    term: "occupancy",
    phonetic: "/ˈɒkjʊpənsi/",
    topic: "Travel & Transportation",
    level: 1,
    wordForm: "noun",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn:
          "The state of occupying a space or room; percentage of rooms in use",
        definitionVi: "Tỷ lệ lấp đầy (phòng khách sạn); tình trạng có người ở",
        exampleEn: "The hotel has a 90% occupancy rate during peak season.",
        exampleVi: "Khách sạn có tỷ lệ lấp đầy 90% trong mùa cao điểm.",
        sortOrder: 0,
      },
    ],
  },

  complimentary: {
    term: "complimentary",
    phonetic: "/ˌkɒmplɪˈmɛntəri/",
    topic: "Travel & Transportation",
    level: 1,
    wordForm: "adjective",
    definitions: [
      {
        partOfSpeech: "adjective",
        definitionEn: "Given free of charge as a courtesy",
        definitionVi: "Miễn phí; tặng kèm",
        exampleEn: "Guests receive a complimentary breakfast every morning.",
        exampleVi: "Khách được phục vụ bữa sáng miễn phí mỗi buổi sáng.",
        sortOrder: 0,
      },
    ],
  },

  cancellation: {
    term: "cancellation",
    phonetic: "/ˌkænsəˈleɪʃən/",
    topic: "Travel & Transportation",
    level: 1,
    wordForm: "noun",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn: "The action of canceling a reservation or booking",
        definitionVi: "Sự hủy đặt phòng/đặt chỗ; hủy đơn",
        exampleEn:
          "Free cancellation is available up to 48 hours before check-in.",
        exampleVi: "Hủy miễn phí trong vòng 48 giờ trước khi nhận phòng.",
        sortOrder: 0,
      },
    ],
  },

  rate: {
    term: "rate",
    phonetic: "/reɪt/",
    topic: "Travel & Transportation",
    level: 1,
    wordForm: "noun/verb",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn: "A fixed price for accommodation or services",
        definitionVi: "Giá (phòng, dịch vụ); mức giá",
        exampleEn: "The nightly rate starts at $120 per room.",
        exampleVi: "Giá phòng mỗi đêm bắt đầu từ 120 đô la.",
        sortOrder: 0,
      },
    ],
  },

  receipt: {
    term: "receipt",
    phonetic: "/rɪˈsiːt/",
    topic: "Travel & Transportation",
    level: 1,
    wordForm: "noun",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn:
          "A written acknowledgment that money or goods have been received",
        definitionVi: "Biên lai; hóa đơn thanh toán",
        exampleEn: "Please keep your receipt for reimbursement purposes.",
        exampleVi: "Vui lòng giữ biên lai để hoàn trả chi phí.",
        sortOrder: 0,
      },
    ],
  },

  // ── TECHNOLOGY ─────────────────────────────

  software: {
    term: "software",
    phonetic: "/ˈsɒftweər/",
    topic: "Technology & IT",
    level: 2,
    wordForm: "noun",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn: "Programs and operating information used by a computer",
        definitionVi: "Phần mềm",
        exampleEn: "The new accounting software is easy to use.",
        exampleVi: "Phần mềm kế toán mới rất dễ sử dụng.",
        sortOrder: 0,
      },
    ],
  },

  interface: {
    term: "interface",
    phonetic: "/ˈɪntərfeɪs/",
    topic: "Technology & IT",
    level: 2,
    wordForm: "noun",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn:
          "A point where two systems or organizations meet and interact",
        definitionVi: "Giao diện (người dùng); điểm kết nối",
        exampleEn:
          "The new user interface is more intuitive than the previous version.",
        exampleVi: "Giao diện người dùng mới trực quan hơn phiên bản trước.",
        sortOrder: 0,
      },
    ],
  },

  database: {
    term: "database",
    phonetic: "/ˈdeɪtəbeɪs/",
    topic: "Technology & IT",
    level: 2,
    wordForm: "noun",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn:
          "A structured set of data stored and accessed electronically",
        definitionVi: "Cơ sở dữ liệu",
        exampleEn: "Customer information is stored in a secure database.",
        exampleVi:
          "Thông tin khách hàng được lưu trữ trong cơ sở dữ liệu bảo mật.",
        sortOrder: 0,
      },
    ],
  },

  upgrade: {
    term: "upgrade",
    phonetic: "/ˈʌpɡreɪd/",
    topic: "Technology & IT",
    level: 2,
    wordForm: "noun/verb",
    definitions: [
      {
        partOfSpeech: "verb",
        definitionEn:
          "To raise (software, hardware, or a system) to a higher standard",
        definitionVi: "Nâng cấp (hệ thống, phần mềm)",
        exampleEn: "We need to upgrade the server to handle more traffic.",
        exampleVi:
          "Chúng tôi cần nâng cấp máy chủ để xử lý nhiều lưu lượng hơn.",
        sortOrder: 0,
      },
    ],
  },

  compatible: {
    term: "compatible",
    phonetic: "/kəmˈpætɪbəl/",
    topic: "Technology & IT",
    level: 2,
    wordForm: "adjective",
    definitions: [
      {
        partOfSpeech: "adjective",
        definitionEn: "Able to exist or work together without problems",
        definitionVi: "Tương thích; có thể kết hợp sử dụng",
        exampleEn:
          "Make sure the device is compatible with your operating system.",
        exampleVi:
          "Hãy chắc chắn thiết bị tương thích với hệ điều hành của bạn.",
        sortOrder: 0,
      },
    ],
  },

  bandwidth: {
    term: "bandwidth",
    phonetic: "/ˈbændwɪdθ/",
    topic: "Technology & IT",
    level: 2,
    wordForm: "noun",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn: "The maximum rate of data transfer across a network",
        definitionVi: "Băng thông mạng; dải thông",
        exampleEn: "Streaming video requires high bandwidth.",
        exampleVi: "Xem video trực tuyến đòi hỏi băng thông cao.",
        sortOrder: 0,
      },
    ],
  },

  encrypt: {
    term: "encrypt",
    phonetic: "/ɪnˈkrɪpt/",
    topic: "Technology & IT",
    level: 2,
    wordForm: "verb",
    definitions: [
      {
        partOfSpeech: "verb",
        definitionEn:
          "To convert information into a coded format to prevent unauthorized access",
        definitionVi: "Mã hóa (dữ liệu); bảo mật thông tin",
        exampleEn: "All customer data is encrypted before transmission.",
        exampleVi: "Tất cả dữ liệu khách hàng được mã hóa trước khi truyền đi.",
        sortOrder: 0,
      },
    ],
  },

  implement: {
    term: "implement",
    phonetic: "/ˈɪmplɪmɛnt/",
    topic: "Technology & IT",
    level: 2,
    wordForm: "verb",
    definitions: [
      {
        partOfSpeech: "verb",
        definitionEn: "To put a plan or system into action",
        definitionVi: "Triển khai; thực thi (kế hoạch, hệ thống)",
        exampleEn: "The IT team will implement the new system next month.",
        exampleVi: "Nhóm IT sẽ triển khai hệ thống mới vào tháng tới.",
        sortOrder: 0,
      },
    ],
  },

  integrate: {
    term: "integrate",
    phonetic: "/ˈɪntɪɡreɪt/",
    topic: "Technology & IT",
    level: 2,
    wordForm: "verb",
    definitions: [
      {
        partOfSpeech: "verb",
        definitionEn:
          "To combine systems or components into a functional whole",
        definitionVi: "Tích hợp; kết hợp các hệ thống",
        exampleEn: "The app integrates with popular calendar services.",
        exampleVi: "Ứng dụng tích hợp với các dịch vụ lịch phổ biến.",
        sortOrder: 0,
      },
    ],
  },

  subscription: {
    term: "subscription",
    phonetic: "/səbˈskrɪpʃən/",
    topic: "Technology & IT",
    level: 2,
    wordForm: "noun",
    definitions: [
      {
        partOfSpeech: "noun",
        definitionEn:
          "An arrangement to receive a service regularly for a recurring fee",
        definitionVi: "Đăng ký trả phí định kỳ; gói thuê bao",
        exampleEn: "The software is available on an annual subscription basis.",
        exampleVi: "Phần mềm có sẵn theo gói đăng ký hàng năm.",
        sortOrder: 0,
      },
    ],
  },
};

// ─────────────────────────────────────────────
// SEED FUNCTION
// ─────────────────────────────────────────────

async function main() {
  console.log("🌱 Starting TOEIC seed data...\n");

  // Collect all unique terms needed
  const allTermsNeeded = new Set<string>();
  for (const topic of RAW_TOPICS) {
    for (const ws of topic.wordSets) {
      for (const term of ws.words) {
        allTermsNeeded.add(term);
      }
    }
  }

  // ── Step 1: Upsert Words & Definitions ──────
  console.log(`📖 Upserting ${allTermsNeeded.size} words...`);

  const wordIdMap: Record<string, string> = {};

  for (const term of allTermsNeeded) {
    const raw = WORD_DICT[term];
    if (!raw) {
      console.warn(`  ⚠️  No definition found for term: "${term}"`);
      continue;
    }

    const word = await prisma.words.upsert({
      where: { Term: raw.term },
      update: {
        Phonetic: raw.phonetic,
        AudioUrl: raw.audioUrl ?? null,
        Topic: raw.topic,
        Level: raw.level,
        WordForm: raw.wordForm ?? null,
        UpdatedAt: now,
      },
      create: {
        Id: crypto.randomUUID(),
        Term: raw.term,
        Phonetic: raw.phonetic,
        AudioUrl: raw.audioUrl ?? null,
        Topic: raw.topic,
        Level: raw.level,
        WordForm: raw.wordForm ?? null,
        CreatedAt: now,
      },
    });

    wordIdMap[term] = word.Id;

    // Delete old definitions and re-create
    await prisma.word_definitions.deleteMany({ where: { WordId: word.Id } });

    for (const def of raw.definitions) {
      await prisma.word_definitions.create({
        data: {
          Id: crypto.randomUUID(),
          WordId: word.Id,
          PartOfSpeech: def.partOfSpeech,
          DefinitionEn: def.definitionEn,
          DefinitionVi: def.definitionVi,
          ExampleEn: def.exampleEn ?? null,
          ExampleVi: def.exampleVi ?? null,
          Tips: def.tips ?? null,
          SortOrder: def.sortOrder,
          CreatedAt: now,
        },
      });
    }

    console.log(`  ✅ ${term}`);
  }

  // ── Step 2: Upsert Topics & Word Sets ───────
  console.log("\n📚 Upserting topics and word sets...");

  for (const rawTopic of RAW_TOPICS) {
    // Upsert topic
    let topic = await prisma.topics.findFirst({
      where: { name: rawTopic.name },
    });

    const topicTotalWords = new Set(rawTopic.wordSets.flatMap((ws) => ws.words))
      .size;

    if (!topic) {
      topic = await prisma.topics.create({
        data: {
          id: crypto.randomUUID(),
          name: rawTopic.name,
          description: rawTopic.description,
          thumbnail: rawTopic.thumbnail ?? null,
          Order: rawTopic.order,
          total_words: topicTotalWords,
          created_at: now,
          updated_at: now,
        },
      });
      console.log(`  📌 Created topic: ${rawTopic.name}`);
    } else {
      await prisma.topics.update({
        where: { id: topic.id },
        data: {
          description: rawTopic.description,
          thumbnail: rawTopic.thumbnail ?? null,
          Order: rawTopic.order,
          total_words: topicTotalWords,
          updated_at: now,
        },
      });
      console.log(`  🔄 Updated topic: ${rawTopic.name}`);
    }

    // Upsert word sets
    for (const rawWS of rawTopic.wordSets) {
      let wordSet = await prisma.word_sets.findFirst({
        where: { topicid: topic.id, name: rawWS.name },
      });

      if (!wordSet) {
        wordSet = await prisma.word_sets.create({
          data: {
            id: crypto.randomUUID(),
            topicid: topic.id,
            name: rawWS.name,
            description: rawWS.description,
            level: rawWS.level,
            total_words: rawWS.words.length,
            thumbnail: rawWS.thumbnail ?? null,
            isActive: true,
            created_at: now,
            updated_at: now,
          },
        });
        console.log(`     ➕ Created word set: ${rawWS.name}`);
      } else {
        await prisma.word_sets.update({
          where: { id: wordSet.id },
          data: {
            description: rawWS.description,
            level: rawWS.level,
            total_words: rawWS.words.length,
            updated_at: now,
          },
        });
        console.log(`     🔁 Updated word set: ${rawWS.name}`);
      }

      // Clear existing word_set_words and re-insert
      await prisma.word_set_words.deleteMany({
        where: { word_set_id: wordSet.id },
      });

      for (let i = 0; i < rawWS.words.length; i++) {
        const term = rawWS.words[i];
        const wordId = wordIdMap[term];
        if (!wordId) {
          console.warn(`     ⚠️  Skipping "${term}" — word ID not found`);
          continue;
        }

        await prisma.word_set_words.create({
          data: {
            id: crypto.randomUUID(),
            word_set_id: wordSet.id,
            word_id: wordId,
            order_index: i,
            created_at: now,
          },
        });
      }

      console.log(
        `        🔗 Linked ${rawWS.words.length} words to "${rawWS.name}"`,
      );
    }
  }

  console.log("\n✨ Seed completed successfully!");
  console.log(
    `   Topics: ${RAW_TOPICS.length} | Word sets: ${RAW_TOPICS.reduce((a, t) => a + t.wordSets.length, 0)} | Words: ${allTermsNeeded.size}`,
  );
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
