import { useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'
import { useAuthStore } from '../store/authStore'
import { logAnalyticsEvent } from '../lib/analytics'

export interface Resource {
  id: string
  type: 'PRD' | 'case_study' | 'link' | 'book'
  title: string
  url?: string
  description?: string
  editorial_note: string
  tags?: string[]
  approved: boolean
  created_at: string
}

export interface ResourceSuggestion {
  id: string
  submitted_by?: string
  title: string
  url?: string
  description?: string
  type: 'PRD' | 'case_study' | 'link' | 'book'
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}

// Seeded local resources fallback if Supabase is empty
const SEEDED_RESOURCES: Resource[] = [
  {
    "id": "res-how-to-kickstart-your-pm-career",
    "type": "link",
    "title": "How to kickstart your PM career",
    "url": "https://www.lennysnewsletter.com/p/how-to-kickstart-your-pm-career",
    "description": "A deep-dive detailing the mechanical paths to transition into product management externally or shifting internally via structural side-projects.",
    "editorial_note": "Recommended by Indian tech recruiters because it shows how to design side-project product teardowns that prove hard execution and technical logical reasoning before securing an official role.",
    "tags": [
      "career-transition",
      "portfolio"
    ],
    "approved": true,
    "created_at": "2026-05-27T04:15:49.907Z"
  },
  {
    "id": "res-how-to-make-a-product-manager-portfolio-step-by-step-guide",
    "type": "link",
    "title": "How to make a Product Manager Portfolio: Step by Step Guide",
    "url": "https://www.theproductfolks.com/product-management-blog/how-to-make-a-product-manager-portfolio-step-by-step-guide",
    "description": "A step-by-step breakdown on building a comprehensive PM portfolio, detailing how to cleanly present user research and wireframe choices.",
    "editorial_note": "This guide is a core resource of the Indian Insurjo community, precisely matching the formatting style and depth expected when applying to APM roles at Swiggy, Zepto, or Flipkart.",
    "tags": [
      "portfolio",
      "interview-prep"
    ],
    "approved": true,
    "created_at": "2026-05-27T04:15:49.909Z"
  },
  {
    "id": "res-building-a-product-strategy-the-right-way",
    "type": "link",
    "title": "Building A Product Strategy, The Right Way",
    "url": "https://www.theproductfolks.com/product-management-blog/building-a-product-strategy-the-right-way",
    "description": "A tactical session summary with Gojek's former Head of Product, Vikrama Dhiman, on the real-world mechanics of product strategy.",
    "editorial_note": "Better than standard Western strategic texts because it frames roadmapping around the high-churn, price-sensitive realities of the Indian mobile internet market.",
    "tags": [
      "product-strategy",
      "execution"
    ],
    "approved": true,
    "created_at": "2026-05-27T04:15:49.909Z"
  },
  {
    "id": "res-deep-dive-into-product-analytics",
    "type": "link",
    "title": "Deep Dive into Product Analytics",
    "url": "https://www.theproductfolks.com/product-management-blog/deep-dive-into-product-analytics",
    "description": "A technical exploration of analytical patterns, user tracking telemetry, and core funnel architecture.",
    "editorial_note": "Genuinely addresses how massive consumer apps in India track user actions across fragmented networks, heavy API constraints, and a broad variety of entry-level smartphones.",
    "tags": [
      "analytics",
      "metrics"
    ],
    "approved": true,
    "created_at": "2026-05-27T04:15:49.909Z"
  },
  {
    "id": "res-the-metrics-that-matter-for-growth",
    "type": "link",
    "title": "The Metrics that Matter for Growth",
    "url": "https://growthx.cc/blog/the-metrics-that-matter-for-growth",
    "description": "An engineering and product breakdown of why vanity numbers misguide teams and how to design actual core loops.",
    "editorial_note": "Uses specific operational unit economics and behavioral loops of quick-commerce platforms like Blinkit and Zepto to explain cohort-based retention versus artificially subsidized transaction spikes.",
    "tags": [
      "growth-loops",
      "metrics"
    ],
    "approved": true,
    "created_at": "2026-05-27T04:15:49.909Z"
  },
  {
    "id": "res-product-manager-career-path-from-apm-to-cpo",
    "type": "link",
    "title": "Product Manager Career Path: From APM to CPO",
    "url": "https://glasp.co/articles/product-manager-career-path",
    "description": "An aggregated professional guide mapping out the core competencies and changing expectations at each stage of a PM's trajectory.",
    "editorial_note": "Explicitly helps entry-level Indian engineers understand the shift from technical execution to business outcomes, mapping beautifully to the regional career progressions found in companies like Razorpay.",
    "tags": [
      "career-path",
      "fundamentals"
    ],
    "approved": true,
    "created_at": "2026-05-27T04:15:49.909Z"
  },
  {
    "id": "res-cracking-the-pm-interview",
    "type": "book",
    "title": "Cracking the PM Interview",
    "url": "https://www.amazon.in/Cracking-PM-Interview-Product-Technology/dp/098478281X",
    "description": "An interview training manual focused on frameworks for responding to design, estimation, and core behavioral questions.",
    "editorial_note": "Chapter 13 on 'Product Case Studies' is exceptionally valuable for aspiring Indian PMs as it serves as the exact playbook local candidates use to structure analytical casing rounds during recruitment.",
    "tags": [
      "interview-prep",
      "books"
    ],
    "approved": true,
    "created_at": "2026-05-27T04:15:49.910Z"
  },
  {
    "id": "res-decode-and-conquer",
    "type": "book",
    "title": "Decode and Conquer",
    "url": "https://www.amazon.in/Decode-Conquer-Answers-Management-Interviews/dp/0615930784",
    "description": "A tactical response guide featuring example script dialogue answers to hypothetical product architecture and customer problems.",
    "editorial_note": "Read Chapter 4 on the 'CIRCLES Method'; it breaks down how to systematically identify user personas and rank critical pain points without getting overwhelmed during real-time assignment presentations.",
    "tags": [
      "frameworks",
      "books"
    ],
    "approved": true,
    "created_at": "2026-05-27T04:15:49.910Z"
  },
  {
    "id": "res-inspired-how-to-create-tech-products-customers-love",
    "type": "book",
    "title": "Inspired: How to Create Tech Products Customers Love",
    "url": "https://www.amazon.in/Inspired-Create-Tech-Products-Customers/dp/1119387507",
    "description": "A foundational handbook explaining modern discovery loops, delivery engineering patterns, and agile product team alignment.",
    "editorial_note": "Focus on Chapter 16 on 'Product Requirement Documents,' which teaches aspiring PMs how to shift from long, waterfall specification writing to thin, iterative problem framing.",
    "tags": [
      "fundamentals",
      "books"
    ],
    "approved": true,
    "created_at": "2026-05-27T04:15:49.910Z"
  },
  {
    "id": "res-product-management-simplified",
    "type": "book",
    "title": "Product Management Simplified",
    "url": "https://www.amazon.in/Product-Management-Simplified-Deepak-Singh/dp/9354227447",
    "description": "A text exploring standard core product principles contextualized explicitly within the Indian tech landscape.",
    "editorial_note": "Chapter 3 on product-led growth is a must-read, directly parsing local consumer app behaviors from Flipkart and Myntra to explain how tier-2 and tier-3 Indian demographics interact with digital conversion funnels.",
    "tags": [
      "india-context",
      "books"
    ],
    "approved": true,
    "created_at": "2026-05-27T04:15:49.910Z"
  },
  {
    "id": "res-failing-to-succeed-the-story-of-indias-first-e-commerce-company",
    "type": "book",
    "title": "Failing to Succeed: The Story of India's First E-Commerce Company",
    "url": "https://www.amazon.in/Failing-Succeed-Story-Indias-Commerce/dp/9386224103",
    "description": "A first-person historical account by K. Vaitheeswaran detailing the launch, operational challenges, and ultimate shutdown of Indiaplaza.",
    "editorial_note": "The chapter parsing 'The Cash-on-Delivery Conundrum' is the single best historical resource on why solving for infrastructure deficiencies in India creates unique product margin traps that modern apps are still negotiating.",
    "tags": [
      "india-context",
      "failures"
    ],
    "approved": true,
    "created_at": "2026-05-27T04:15:49.910Z"
  },
  {
    "id": "res-kevin-yiens-minimalist-1-page-prd-template",
    "type": "PRD",
    "title": "Kevin Yien's Minimalist 1-Page PRD Template",
    "url": "https://coda.io/@kevin-yien/minimal-prd",
    "description": "A lean, step-by-step document format that omits typical enterprise bureaucracy to focus strictly on user flow sequences, dependencies, and explicit non-goals.",
    "editorial_note": "This is the ultimate minimal template for an aspiring PM because it leaves zero space for filler text, forcing you to express your feature's logic in clean, developer-friendly bullets.",
    "tags": [
      "prd-template",
      "lean"
    ],
    "approved": true,
    "created_at": "2026-05-27T04:15:49.910Z"
  },
  {
    "id": "res-product-hunt-original-feature-prd-template",
    "type": "PRD",
    "title": "Product Hunt Original Feature PRD Template",
    "url": "https://www.notion.so/templates/product-hunt-prd",
    "description": "A classic document structure outlining user problems, specific wireframe linkages, and product release sequencing rules.",
    "editorial_note": "Extremely valuable for beginners because it shows exactly how a fast-shipping consumer web team maps an ambiguous social concept directly down into measurable engineering requirements.",
    "tags": [
      "prd-template",
      "consumer"
    ],
    "approved": true,
    "created_at": "2026-05-27T04:15:49.910Z"
  },
  {
    "id": "res-asana-project-brief-template",
    "type": "PRD",
    "title": "Asana Project Brief Template",
    "url": "https://asana.com/templates/project-brief",
    "description": "A cross-functional blueprint centered around defining precise problem statements, stakeholder RACI parameters, and clear target success criteria.",
    "editorial_note": "Ideal for aspiring Indian PMs struggling with stakeholder communication; it places the problem definition and non-goals immediately at the top to prevent scope creep by external commercial teams.",
    "tags": [
      "prd-template",
      "stakeholders"
    ],
    "approved": true,
    "created_at": "2026-05-27T04:15:49.910Z"
  },
  {
    "id": "res-the-product-folks-standard-hackathon-prd-framework",
    "type": "PRD",
    "title": "The Product Folks Standard Hackathon PRD Framework",
    "url": "https://www.theproductfolks.com/templates/standard-prd-framework",
    "description": "A documentation format built specifically for Indian product hackathons, framing technical user flows and edge-case exceptions clearly.",
    "editorial_note": "This structure maps exactly to the judging rubric used in national Indian PM case competitions, making it a perfect blueprint for drafting mock assignments for your portfolio.",
    "tags": [
      "prd-template",
      "india-context"
    ],
    "approved": true,
    "created_at": "2026-05-27T04:15:49.910Z"
  },
  {
    "id": "res-figma-comprehensive-prd-canvas-template",
    "type": "PRD",
    "title": "Figma Comprehensive PRD Canvas Template",
    "url": "https://www.figma.com/templates/product-requirements-document-template/",
    "description": "A visual documentation framework linking cross-functional design wireframes directly adjacent to corresponding functional text specs.",
    "editorial_note": "Solves the common junior PM mistake of treating copy and engineering logic as separate entities by embedding visual assets directly alongside structural edge cases.",
    "tags": [
      "prd-template",
      "visual-design"
    ],
    "approved": true,
    "created_at": "2026-05-27T04:15:49.910Z"
  },
  {
    "id": "res-the-crisis-foretold-quick-commerce-expansion-and-unit-economics",
    "type": "case_study",
    "title": "The Crisis Foretold: Quick Commerce Expansion and Unit Economics",
    "url": "https://swarajyamag.com/business/dunzo-case-study-a-crisis-foretold",
    "description": "An honest analytical case study tracking Dunzo's aggressive dark store deployment, cash burn, and subsequent operational scaling crisis.",
    "editorial_note": "Better than optimistic success stories because it details the actual mathematical breakdown of inventory turnover rates and the high average order value targets needed to sustain quick delivery margins in India.",
    "tags": [
      "case-study",
      "quick-commerce"
    ],
    "approved": true,
    "created_at": "2026-05-27T04:15:49.910Z"
  },
  {
    "id": "res-swiggy-problem-solving-case-and-root-cause-analysis",
    "type": "case_study",
    "title": "Swiggy: Problem-Solving Case and Root Cause Analysis",
    "url": "https://medium.com/@prateekvats144/swiggy-problem-solving-case-root-cause-analysis-da6d8248ad16",
    "description": "A thorough diagnostic teardown analyzing a critical hypothetical 10% drop in user conversion following a payment system migration.",
    "editorial_note": "Features specific regional app ecosystem constraints like entry-level smartphone OTP drops, network timing delays, and local digital payment failure mechanics to teach root-cause thinking.",
    "tags": [
      "case-study",
      "root-cause"
    ],
    "approved": true,
    "created_at": "2026-05-27T04:15:49.910Z"
  },
  {
    "id": "res-learning-from-a-failure-the-making-of-swiggy",
    "type": "case_study",
    "title": "Learning from a Failure: The Making of Swiggy",
    "url": "https://medium.com/accel-india-insights/learning-from-a-failure-the-making-of-swiggy-e9bacf0aadc1",
    "description": "An interview-backed case profile reviewing the initial logistical mistakes, structural pivots, and early infrastructure failures before Swiggy achieved product-market fit.",
    "editorial_note": "Provides a frank, non-sanitized look at why their initial e-commerce logistics layout failed completely, teaching aspiring PMs about real-world market readiness and timing constraints.",
    "tags": [
      "case-study",
      "pivot"
    ],
    "approved": true,
    "created_at": "2026-05-27T04:15:49.910Z"
  },
  {
    "id": "res-the-profitability-paradox-scaling-aov-while-maintaining-liquidity",
    "type": "case_study",
    "title": "The Profitability Paradox: Scaling AOV While Maintaining Liquidity",
    "url": "https://www.slideshare.net/slideshow/dunzo-case-studypdf/253765951",
    "description": "A slide-based product case breakdown focused on strategic feature mechanisms to drive average order values up by 30-40%.",
    "editorial_note": "Shows the exact, painful product tradeoffs of implementing hard gamified elements and adding delivery fees onto low-value orders to encourage bundling, complete with clear target metrics.",
    "tags": [
      "case-study",
      "metrics"
    ],
    "approved": true,
    "created_at": "2026-05-27T04:15:49.910Z"
  },
  {
    "id": "res-hike-messenger-the-structural-failure-to-beat-network-effects",
    "type": "case_study",
    "title": "Hike Messenger: The Structural Failure to Beat Network Effects",
    "url": "https://yourstory.com/2021/01/hike-messenger-shutdown-lessons-indian-startup",
    "description": "A detailed forensic breakdown of why India's homegrown messaging app failed to defend its market footprint despite hyper-localized stickers and gaming features.",
    "editorial_note": "Demonstrates how over-indexing on localized aesthetic delighters can mask a core failure to secure basic app stability and fundamental retention metrics against an incumbent with massive network effects.",
    "tags": [
      "case-study",
      "failure-analysis"
    ],
    "approved": true,
    "created_at": "2026-05-27T04:15:49.910Z"
  }
];

export function useResources() {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuthStore()

  useEffect(() => {
    async function fetchResources() {
      try {
        setLoading(true)
        if (isSupabaseConfigured) {
          const { data, error } = await supabase
            .from('resources')
            .select('*')
            .eq('approved', true)
            .order('created_at', { ascending: false })

          if (error) throw error
          if (data && data.length > 0) {
            setResources(data as Resource[])
          } else {
            setResources(SEEDED_RESOURCES)
          }
        } else {
          // Use localStorage or Seed fallback
          const localApproved = localStorage.getItem('prodhub_mock_resources')
          if (localApproved) {
            setResources(JSON.parse(localApproved))
          } else {
            setResources(SEEDED_RESOURCES)
          }
        }
      } catch (err: any) {
        console.error('Error fetching resources:', err)
        setError(err.message || 'Failed to fetch resources')
        setResources(SEEDED_RESOURCES)
      } finally {
        setLoading(false)
      }
    }

    fetchResources()
  }, [])

  const submitSuggestion = async (suggestion: {
    title: string
    url: string
    description: string
    type: 'PRD' | 'case_study' | 'link' | 'book'
  }) => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('resource_suggestions')
        .insert([
          {
            ...suggestion,
            submitted_by: user?.id || null,
            status: 'pending'
          }
        ])
        .select()

      if (error) throw error
      
      // Fire analytics event
      await logAnalyticsEvent('resource_submitted', { title: suggestion.title, type: suggestion.type })
      return data
    } else {
      // Mock mode suggestion saving
      const mockSuggestions = localStorage.getItem('prodhub_mock_suggestions')
      const current = mockSuggestions ? JSON.parse(mockSuggestions) : []
      const newSuggestion: ResourceSuggestion = {
        id: `mock-sugg-${Date.now()}`,
        submitted_by: user?.id || 'mock-user-uuid-123456',
        ...suggestion,
        status: 'pending',
        created_at: new Date().toISOString()
      }
      current.push(newSuggestion)
      localStorage.setItem('prodhub_mock_suggestions', JSON.stringify(current))
      
      // Fire analytics event
      await logAnalyticsEvent('resource_submitted', { title: suggestion.title, type: suggestion.type })
      return [newSuggestion]
    }
  }

  return { resources, loading, error, submitSuggestion }
}
