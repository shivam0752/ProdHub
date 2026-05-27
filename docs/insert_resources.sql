-- =====================================================
-- SQL Script to populate resources table
-- Run this in your Supabase SQL Editor (bypasses RLS)
-- =====================================================

INSERT INTO public.resources (type, title, url, description, editorial_note, tags, approved)
SELECT 
  'link',
  'How to kickstart your PM career',
  'https://www.lennysnewsletter.com/p/how-to-kickstart-your-pm-career',
  'A deep-dive detailing the mechanical paths to transition into product management externally or shifting internally via structural side-projects.',
  'Recommended by Indian tech recruiters because it shows how to design side-project product teardowns that prove hard execution and technical logical reasoning before securing an official role.',
  ARRAY['career-transition', 'portfolio']::text[],
  true
WHERE NOT EXISTS (
  SELECT 1 FROM public.resources WHERE title = 'How to kickstart your PM career'
);

INSERT INTO public.resources (type, title, url, description, editorial_note, tags, approved)
SELECT 
  'link',
  'How to make a Product Manager Portfolio: Step by Step Guide',
  'https://www.theproductfolks.com/product-management-blog/how-to-make-a-product-manager-portfolio-step-by-step-guide',
  'A step-by-step breakdown on building a comprehensive PM portfolio, detailing how to cleanly present user research and wireframe choices.',
  'This guide is a core resource of the Indian Insurjo community, precisely matching the formatting style and depth expected when applying to APM roles at Swiggy, Zepto, or Flipkart.',
  ARRAY['portfolio', 'interview-prep']::text[],
  true
WHERE NOT EXISTS (
  SELECT 1 FROM public.resources WHERE title = 'How to make a Product Manager Portfolio: Step by Step Guide'
);

INSERT INTO public.resources (type, title, url, description, editorial_note, tags, approved)
SELECT 
  'link',
  'Building A Product Strategy, The Right Way',
  'https://www.theproductfolks.com/product-management-blog/building-a-product-strategy-the-right-way',
  'A tactical session summary with Gojek''s former Head of Product, Vikrama Dhiman, on the real-world mechanics of product strategy.',
  'Better than standard Western strategic texts because it frames roadmapping around the high-churn, price-sensitive realities of the Indian mobile internet market.',
  ARRAY['product-strategy', 'execution']::text[],
  true
WHERE NOT EXISTS (
  SELECT 1 FROM public.resources WHERE title = 'Building A Product Strategy, The Right Way'
);

INSERT INTO public.resources (type, title, url, description, editorial_note, tags, approved)
SELECT 
  'link',
  'Deep Dive into Product Analytics',
  'https://www.theproductfolks.com/product-management-blog/deep-dive-into-product-analytics',
  'A technical exploration of analytical patterns, user tracking telemetry, and core funnel architecture.',
  'Genuinely addresses how massive consumer apps in India track user actions across fragmented networks, heavy API constraints, and a broad variety of entry-level smartphones.',
  ARRAY['analytics', 'metrics']::text[],
  true
WHERE NOT EXISTS (
  SELECT 1 FROM public.resources WHERE title = 'Deep Dive into Product Analytics'
);

INSERT INTO public.resources (type, title, url, description, editorial_note, tags, approved)
SELECT 
  'link',
  'The Metrics that Matter for Growth',
  'https://growthx.cc/blog/the-metrics-that-matter-for-growth',
  'An engineering and product breakdown of why vanity numbers misguide teams and how to design actual core loops.',
  'Uses specific operational unit economics and behavioral loops of quick-commerce platforms like Blinkit and Zepto to explain cohort-based retention versus artificially subsidized transaction spikes.',
  ARRAY['growth-loops', 'metrics']::text[],
  true
WHERE NOT EXISTS (
  SELECT 1 FROM public.resources WHERE title = 'The Metrics that Matter for Growth'
);

INSERT INTO public.resources (type, title, url, description, editorial_note, tags, approved)
SELECT 
  'link',
  'Product Manager Career Path: From APM to CPO',
  'https://glasp.co/articles/product-manager-career-path',
  'An aggregated professional guide mapping out the core competencies and changing expectations at each stage of a PM''s trajectory.',
  'Explicitly helps entry-level Indian engineers understand the shift from technical execution to business outcomes, mapping beautifully to the regional career progressions found in companies like Razorpay.',
  ARRAY['career-path', 'fundamentals']::text[],
  true
WHERE NOT EXISTS (
  SELECT 1 FROM public.resources WHERE title = 'Product Manager Career Path: From APM to CPO'
);

INSERT INTO public.resources (type, title, url, description, editorial_note, tags, approved)
SELECT 
  'book',
  'Cracking the PM Interview',
  'https://www.amazon.in/Cracking-PM-Interview-Product-Technology/dp/098478281X',
  'An interview training manual focused on frameworks for responding to design, estimation, and core behavioral questions.',
  'Chapter 13 on ''Product Case Studies'' is exceptionally valuable for aspiring Indian PMs as it serves as the exact playbook local candidates use to structure analytical casing rounds during recruitment.',
  ARRAY['interview-prep', 'books']::text[],
  true
WHERE NOT EXISTS (
  SELECT 1 FROM public.resources WHERE title = 'Cracking the PM Interview'
);

INSERT INTO public.resources (type, title, url, description, editorial_note, tags, approved)
SELECT 
  'book',
  'Decode and Conquer',
  'https://www.amazon.in/Decode-Conquer-Answers-Management-Interviews/dp/0615930784',
  'A tactical response guide featuring example script dialogue answers to hypothetical product architecture and customer problems.',
  'Read Chapter 4 on the ''CIRCLES Method''; it breaks down how to systematically identify user personas and rank critical pain points without getting overwhelmed during real-time assignment presentations.',
  ARRAY['frameworks', 'books']::text[],
  true
WHERE NOT EXISTS (
  SELECT 1 FROM public.resources WHERE title = 'Decode and Conquer'
);

INSERT INTO public.resources (type, title, url, description, editorial_note, tags, approved)
SELECT 
  'book',
  'Inspired: How to Create Tech Products Customers Love',
  'https://www.amazon.in/Inspired-Create-Tech-Products-Customers/dp/1119387507',
  'A foundational handbook explaining modern discovery loops, delivery engineering patterns, and agile product team alignment.',
  'Focus on Chapter 16 on ''Product Requirement Documents,'' which teaches aspiring PMs how to shift from long, waterfall specification writing to thin, iterative problem framing.',
  ARRAY['fundamentals', 'books']::text[],
  true
WHERE NOT EXISTS (
  SELECT 1 FROM public.resources WHERE title = 'Inspired: How to Create Tech Products Customers Love'
);

INSERT INTO public.resources (type, title, url, description, editorial_note, tags, approved)
SELECT 
  'book',
  'Product Management Simplified',
  'https://www.amazon.in/Product-Management-Simplified-Deepak-Singh/dp/9354227447',
  'A text exploring standard core product principles contextualized explicitly within the Indian tech landscape.',
  'Chapter 3 on product-led growth is a must-read, directly parsing local consumer app behaviors from Flipkart and Myntra to explain how tier-2 and tier-3 Indian demographics interact with digital conversion funnels.',
  ARRAY['india-context', 'books']::text[],
  true
WHERE NOT EXISTS (
  SELECT 1 FROM public.resources WHERE title = 'Product Management Simplified'
);

INSERT INTO public.resources (type, title, url, description, editorial_note, tags, approved)
SELECT 
  'book',
  'Failing to Succeed: The Story of India''s First E-Commerce Company',
  'https://www.amazon.in/Failing-Succeed-Story-Indias-Commerce/dp/9386224103',
  'A first-person historical account by K. Vaitheeswaran detailing the launch, operational challenges, and ultimate shutdown of Indiaplaza.',
  'The chapter parsing ''The Cash-on-Delivery Conundrum'' is the single best historical resource on why solving for infrastructure deficiencies in India creates unique product margin traps that modern apps are still negotiating.',
  ARRAY['india-context', 'failures']::text[],
  true
WHERE NOT EXISTS (
  SELECT 1 FROM public.resources WHERE title = 'Failing to Succeed: The Story of India''s First E-Commerce Company'
);

INSERT INTO public.resources (type, title, url, description, editorial_note, tags, approved)
SELECT 
  'PRD',
  'Kevin Yien''s Minimalist 1-Page PRD Template',
  'https://coda.io/@kevin-yien/minimal-prd',
  'A lean, step-by-step document format that omits typical enterprise bureaucracy to focus strictly on user flow sequences, dependencies, and explicit non-goals.',
  'This is the ultimate minimal template for an aspiring PM because it leaves zero space for filler text, forcing you to express your feature''s logic in clean, developer-friendly bullets.',
  ARRAY['prd-template', 'lean']::text[],
  true
WHERE NOT EXISTS (
  SELECT 1 FROM public.resources WHERE title = 'Kevin Yien''s Minimalist 1-Page PRD Template'
);

INSERT INTO public.resources (type, title, url, description, editorial_note, tags, approved)
SELECT 
  'PRD',
  'Product Hunt Original Feature PRD Template',
  'https://www.notion.so/templates/product-hunt-prd',
  'A classic document structure outlining user problems, specific wireframe linkages, and product release sequencing rules.',
  'Extremely valuable for beginners because it shows exactly how a fast-shipping consumer web team maps an ambiguous social concept directly down into measurable engineering requirements.',
  ARRAY['prd-template', 'consumer']::text[],
  true
WHERE NOT EXISTS (
  SELECT 1 FROM public.resources WHERE title = 'Product Hunt Original Feature PRD Template'
);

INSERT INTO public.resources (type, title, url, description, editorial_note, tags, approved)
SELECT 
  'PRD',
  'Asana Project Brief Template',
  'https://asana.com/templates/project-brief',
  'A cross-functional blueprint centered around defining precise problem statements, stakeholder RACI parameters, and clear target success criteria.',
  'Ideal for aspiring Indian PMs struggling with stakeholder communication; it places the problem definition and non-goals immediately at the top to prevent scope creep by external commercial teams.',
  ARRAY['prd-template', 'stakeholders']::text[],
  true
WHERE NOT EXISTS (
  SELECT 1 FROM public.resources WHERE title = 'Asana Project Brief Template'
);

INSERT INTO public.resources (type, title, url, description, editorial_note, tags, approved)
SELECT 
  'PRD',
  'The Product Folks Standard Hackathon PRD Framework',
  'https://www.theproductfolks.com/templates/standard-prd-framework',
  'A documentation format built specifically for Indian product hackathons, framing technical user flows and edge-case exceptions clearly.',
  'This structure maps exactly to the judging rubric used in national Indian PM case competitions, making it a perfect blueprint for drafting mock assignments for your portfolio.',
  ARRAY['prd-template', 'india-context']::text[],
  true
WHERE NOT EXISTS (
  SELECT 1 FROM public.resources WHERE title = 'The Product Folks Standard Hackathon PRD Framework'
);

INSERT INTO public.resources (type, title, url, description, editorial_note, tags, approved)
SELECT 
  'PRD',
  'Figma Comprehensive PRD Canvas Template',
  'https://www.figma.com/templates/product-requirements-document-template/',
  'A visual documentation framework linking cross-functional design wireframes directly adjacent to corresponding functional text specs.',
  'Solves the common junior PM mistake of treating copy and engineering logic as separate entities by embedding visual assets directly alongside structural edge cases.',
  ARRAY['prd-template', 'visual-design']::text[],
  true
WHERE NOT EXISTS (
  SELECT 1 FROM public.resources WHERE title = 'Figma Comprehensive PRD Canvas Template'
);

INSERT INTO public.resources (type, title, url, description, editorial_note, tags, approved)
SELECT 
  'case_study',
  'The Crisis Foretold: Quick Commerce Expansion and Unit Economics',
  'https://swarajyamag.com/business/dunzo-case-study-a-crisis-foretold',
  'An honest analytical case study tracking Dunzo''s aggressive dark store deployment, cash burn, and subsequent operational scaling crisis.',
  'Better than optimistic success stories because it details the actual mathematical breakdown of inventory turnover rates and the high average order value targets needed to sustain quick delivery margins in India.',
  ARRAY['case-study', 'quick-commerce']::text[],
  true
WHERE NOT EXISTS (
  SELECT 1 FROM public.resources WHERE title = 'The Crisis Foretold: Quick Commerce Expansion and Unit Economics'
);

INSERT INTO public.resources (type, title, url, description, editorial_note, tags, approved)
SELECT 
  'case_study',
  'Swiggy: Problem-Solving Case and Root Cause Analysis',
  'https://medium.com/@prateekvats144/swiggy-problem-solving-case-root-cause-analysis-da6d8248ad16',
  'A thorough diagnostic teardown analyzing a critical hypothetical 10% drop in user conversion following a payment system migration.',
  'Features specific regional app ecosystem constraints like entry-level smartphone OTP drops, network timing delays, and local digital payment failure mechanics to teach root-cause thinking.',
  ARRAY['case-study', 'root-cause']::text[],
  true
WHERE NOT EXISTS (
  SELECT 1 FROM public.resources WHERE title = 'Swiggy: Problem-Solving Case and Root Cause Analysis'
);

INSERT INTO public.resources (type, title, url, description, editorial_note, tags, approved)
SELECT 
  'case_study',
  'Learning from a Failure: The Making of Swiggy',
  'https://medium.com/accel-india-insights/learning-from-a-failure-the-making-of-swiggy-e9bacf0aadc1',
  'An interview-backed case profile reviewing the initial logistical mistakes, structural pivots, and early infrastructure failures before Swiggy achieved product-market fit.',
  'Provides a frank, non-sanitized look at why their initial e-commerce logistics layout failed completely, teaching aspiring PMs about real-world market readiness and timing constraints.',
  ARRAY['case-study', 'pivot']::text[],
  true
WHERE NOT EXISTS (
  SELECT 1 FROM public.resources WHERE title = 'Learning from a Failure: The Making of Swiggy'
);

INSERT INTO public.resources (type, title, url, description, editorial_note, tags, approved)
SELECT 
  'case_study',
  'The Profitability Paradox: Scaling AOV While Maintaining Liquidity',
  'https://www.slideshare.net/slideshow/dunzo-case-studypdf/253765951',
  'A slide-based product case breakdown focused on strategic feature mechanisms to drive average order values up by 30-40%.',
  'Shows the exact, painful product tradeoffs of implementing hard gamified elements and adding delivery fees onto low-value orders to encourage bundling, complete with clear target metrics.',
  ARRAY['case-study', 'metrics']::text[],
  true
WHERE NOT EXISTS (
  SELECT 1 FROM public.resources WHERE title = 'The Profitability Paradox: Scaling AOV While Maintaining Liquidity'
);

INSERT INTO public.resources (type, title, url, description, editorial_note, tags, approved)
SELECT 
  'case_study',
  'Hike Messenger: The Structural Failure to Beat Network Effects',
  'https://yourstory.com/2021/01/hike-messenger-shutdown-lessons-indian-startup',
  'A detailed forensic breakdown of why India''s homegrown messaging app failed to defend its market footprint despite hyper-localized stickers and gaming features.',
  'Demonstrates how over-indexing on localized aesthetic delighters can mask a core failure to secure basic app stability and fundamental retention metrics against an incumbent with massive network effects.',
  ARRAY['case-study', 'failure-analysis']::text[],
  true
WHERE NOT EXISTS (
  SELECT 1 FROM public.resources WHERE title = 'Hike Messenger: The Structural Failure to Beat Network Effects'
);

