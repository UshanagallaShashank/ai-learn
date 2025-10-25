import type { DayContent, LearningPlan } from '../types';

export class LearningPlanGenerator {
  static generateDayStructure(aiLearningPlan: LearningPlan): DayContent[] {
    const days: DayContent[] = [];

    for (let day = 1; day <= 90; day++) {
      const dayKey = `day${day}`;
      const videos = aiLearningPlan[dayKey] || [];

      // Determine if it's a weekend (Saturday = day 6, Sunday = day 7)
      // Starting from Monday (day 1), calculate day of week
      const dayOfWeek = ((day - 1) % 7) + 1; // 1=Monday, 7=Sunday
      const isWeekend = dayOfWeek === 6 || dayOfWeek === 7; // Saturday or Sunday

      const dayContent: DayContent = {
        day,
        videos,
        isWeekend,
        timeAllocation: isWeekend ? 3 : 1, // 3 hours on weekends, 1 hour on weekdays
      };

      days.push(dayContent);
    }

    return days;
  }

  static getDayOfWeekName(day: number): string {
    const dayOfWeek = ((day - 1) % 7) + 1;
    const dayNames = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return dayNames[dayOfWeek];
  }

  static getWeekNumber(day: number): number {
    return Math.ceil(day / 7);
  }

  static getCurrentWeekDays(currentDay: number): number[] {
    const weekStart = Math.floor((currentDay - 1) / 7) * 7 + 1;
    return Array.from({ length: 7 }, (_, i) => weekStart + i).filter(d => d <= 90);
  }
}

// 90 Day AI Learning Plan - Comprehensive Curriculum
export const sampleAiLearningPlan: LearningPlan = {
  day1: [
    {
      title: "What is Artificial Intelligence? - Introduction to AI",
      link: "https://www.youtube.com/watch?v=ad79nYk2keg"
    }
  ],
  day2: [
    {
      title: "Narrow AI vs General AI vs Super AI",
      link: "https://www.youtube.com/watch?v=yms-4w_1I7Q"
    }
  ],
  day3: [
    {
      title: "How AI Learns: Machine Learning Overview",
      link: "https://www.youtube.com/watch?v=ukzFI9rgwfU"
    }
  ],
  day4: [
    {
      title: "Natural Language Processing Basics",
      link: "https://www.youtube.com/watch?v=6I-Alfkr5K4"
    }
  ],
  day5: [
    {
      title: "Computer Vision Fundamentals",
      link: "https://www.youtube.com/watch?v=B_8kKi4vwFE"
    }
  ],
  day6: [
    {
      title: "Complete AI Overview & History ai",
      link: "https://www.youtube.com/watch?v=eSj80Zr6TEE"
    },
    {
      title: "AI in Business - Case Studies",
      link: "https://www.youtube.com/watch?v=UFSDMBhCk1s"
    },
    {
      title: "AI Ethics & Responsible AI",
      link: "https://www.youtube.com/watch?v=7cInNcogQxg"
    }
  ],
  day7: [
    {
      title: "Generative AI",
      link: "https://www.youtube.com/watch?v=mBnqrlLnCCY"
    },
    {
      title: "AI in Healthcare Applications",
      link: "https://www.youtube.com/watch?v=-aHBwTQQyNU"
    },
    {
      title: "AI for Social Good Projects",
      link: "https://www.youtube.com/watch?v=_YhRF-ZDwPg"
    }
  ],
  day8: [

    {
      title: "Machine Learning Basics",
      link: "https://www.youtube.com/watch?v=cfSDvPlFFVQ"
    },
    {
      title: "Applications of Machine Learning",
      link: "https://www.youtube.com/watch?v=HKcO3-6TYr0"
    },
    {
      title: "ML vs DL vs AI",
      link: "https://www.youtube.com/watch?v=9dFhZFUkzuQ"
    }
  ],
  day9: [
    {
      title: "Machine Learning Tutorial Part 1",
      link: "https://www.youtube.com/watch?v=DWsJc1xnOZo"
    }
  ],
  day10: [
    {
      title: "Machine Learning Tutorial Part 2",
      link: "https://www.youtube.com/watch?v=_Wkx_447zBM"
    }
  ],
  day11: [
    {
      title: "Mathematics for Machine Learning",
      link: "https://www.youtube.com/watch?v=iyxqcS1u5go"
    }
  ],
  day12: [
    {
      title: "Supervised vs Unsupervised vs Reinforcement Learning",
      link: "https://www.youtube.com/watch?v=1FZ0A1QCMWc"
    },
    {
      title: "Machine Learning Algorithms Overview",
      link: "https://www.youtube.com/watch?v=I7NrVwm3apg"
    },
    {
      title: "PCA in Machine Learning",
      link: "https://www.youtube.com/watch?v=2NEu9dbM4A8"
    },
    {
      title: "Linear Regression Analysis",
      link: "https://www.youtube.com/watch?v=NUXdtN1W1FE"
    }
  ],
  day13: [
    {
      title: "K-Means Clustering Algorithm",
      link: "https://www.youtube.com/watch?v=Xvwt7y2jf5E"
    }
  ],
  day14: [
    {
      title: "Decision Tree Algorithm",
      link: "https://www.youtube.com/watch?v=RmajweUFKvM"
    },
    {
      title: "Random Forest Algorithm",
      link: "https://www.youtube.com/watch?v=eM4uJ6XGnSM"
    },
    {
      title: "KNN Algorithm",
      link: "https://www.youtube.com/watch?v=4HKqjENq9OU"
    },
    {
      title: "Support Vector Machine (SVM)",
      link: "https://www.youtube.com/watch?v=TtKF996oEl8"
    },
    {
      title: "Naive Bayes Classifier",
      link: "https://www.youtube.com/watch?v=l3dZ6ZNFjo0"
    },
    {
      title: "Text Classification Using Naive Bayes",
      link: "https://www.youtube.com/watch?v=60pqgfT5tZM"
    },
    {
      title: "Netflix ML Use Case",
      link: "https://www.youtube.com/watch?v=SBFFarEfmEs"
    },
    {
      title: "How to Become a Machine Learning Engineer",
      link: "https://www.youtube.com/watch?v=-5hEYRt8JE0"
    },
  ],
  day15: [{
    title: "How Neural Networks Learn - The Training Process Explained",
    link: "https://www.youtube.com/watch?v=aircAruvnKk"
  }],
  
  day16: [{
    title: "Gradient Descent Explained Simply - How AI Improves Itself",
    link: "https://www.youtube.com/watch?v=sDv4f4s2SB8"
  }],
  
  day17: [{
    title: "Backpropagation - The Algorithm That Powers Deep Learning",
    link: "https://www.youtube.com/watch?v=tIeHLnjs5U8"
  }],
  
  day18: [{
    title: "Overfitting and Underfitting - Why AI Models Fail",
    link: "https://www.youtube.com/watch?v=6g0t3Phly2M"
  }],
  
  day19: [{
    title: "Loss Functions and Optimization - Making Models Better",
    link: "https://www.youtube.com/watch?v=YJNjZGbIbjE"
  }],
  
  day20: [
    {
      title: "How to Train AI Models - Complete Pipeline",
      link: "https://www.youtube.com/watch?v=VsjhpUuOKn0"
    },
    {
      title: "Activation Functions - Why Models Need Them",
      link: "https://www.youtube.com/watch?v=Xvg00QnyaIY"
    },
    {
      title: "Transfer Learning - Using Pre-trained Models (Key for BAs)",
      link: "https://www.youtube.com/watch?v=5T-iXNNiwIs"
    }
  ],
  
  day21: [
    {
      title: "Fine-tuning vs Training from Scratch - When to Use Each",
      link: "https://www.youtube.com/watch?v=eC6Hd1hFvos"
    },
    {
      title: "Model Evaluation Metrics - How to Know If Your Model Works",
      link: "https://www.youtube.com/watch?v=fMlR5W-bgXs"
    },
    {
      title: "Data Splitting - Training, Validation, Test Sets",
      link: "https://www.youtube.com/watch?v=DcNHnMSjwVU"
    }
  ],

  // ========== WEEK 4 (Days 22-28): TRANSFORMERS - THE AI REVOLUTION ==========
  // Goal: Understand Transformers that power ChatGPT, their chatbots
  
  day22: [{
    title: "Attention Mechanism - The Breakthrough That Changed AI",
    link: "https://www.youtube.com/watch?v=eMlx5fFNoYc"
  }],
  
  day23: [{
    title: "Transformers Architecture - How ChatGPT's Brain Works",
    link: "https://www.youtube.com/watch?v=4Bdc55j80l8"
  }],
  
  day24: [{
    title: "Self-Attention Explained - Why Transformers Understand Context",
    link: "https://www.youtube.com/watch?v=yGTUuEx3GkA"
  }],
  
  day25: [{
    title: "Encoder-Decoder vs Decoder-Only Models - BERT vs GPT",
    link: "https://www.youtube.com/watch?v=xI0HHN5XKDo"
  }],
  
  day26: [{
    title: "How LLMs Generate Text - The Prediction Process",
    link: "https://www.youtube.com/watch?v=zjkBMFhNj_g"
  }],
  
  day27: [
    {
      title: "Intro to Large Language Models - Andrej Karpathy (Deep Technical)",
      link: "https://www.youtube.com/watch?v=zjkBMFhNj_g"
    },
    {
      title: "GPT Architecture Explained - From Input to Output",
      link: "https://www.youtube.com/watch?v=kCc8FmEb1nY"
    },
    {
      title: "How ChatGPT Works - Training Pipeline for LLMs",
      link: "https://www.youtube.com/watch?v=VPRSBzXzavo"
    }
  ],
  
  day28: [
    {
      title: "RLHF - How ChatGPT Learned to Be Helpful (Alignment)",
      link: "https://www.youtube.com/watch?v=2MBJOuVq380"
    },
    {
      title: "Tokenization - Why LLMs Have Character Limits",
      link: "https://www.youtube.com/watch?v=zduSFxRajkE"
    },
    {
      title: "Context Windows - How LLMs Remember",
      link: "https://www.youtube.com/watch?v=YJNjZGbIbjE"
    }
  ],

  // ========== WEEK 5 (Days 29-35): BUILDING WITH LLMs ==========
  // Goal: What BAs can build - understand practical implementations
  
  day29: [{
    title: "How to Use LLM APIs - Building Applications (Not from Scratch)",
    link: "https://www.youtube.com/watch?v=aqdWSjWC3xY"
  }],
  
  day30: [{
    title: "Prompt Engineering Complete Guide - Your Superpower as BA",
    link: "https://www.youtube.com/watch?v=_ZvnD73m40o"
  }],
  
  day31: [{
    title: "Few-Shot Prompting - Writing Examples to Guide AI",
    link: "https://www.youtube.com/watch?v=uAFRN1aYgHk"
  }],
  
  day32: [{
    title: "Chain-of-Thought Prompting - Making AI Reason Step-by-Step",
    link: "https://www.youtube.com/watch?v=H4v-DwW5AQo"
  }],
  
  day33: [{
    title: "Fine-tuning LLMs - When and How to Customize Models",
    link: "https://www.youtube.com/watch?v=eC6Hd1hFvos"
  }],
  
  day34: [
    {
      title: "LoRA - Efficient Fine-tuning for BAs (No Need for Deep Knowledge)",
      link: "https://www.youtube.com/watch?v=PXWYUTMt-AU"
    },
    {
      title: "LLM Parameters - Temperature, Top-P (What You Control)",
      link: "https://www.youtube.com/watch?v=YJNjZGbIbjE"
    },
    {
      title: "API-First Development - Building Without Training Models",
      link: "https://www.youtube.com/watch?v=aqdWSjWC3xY"
    }
  ],
  
  day35: [
    {
      title: "Tree-of-Thought Prompting - Advanced Reasoning Patterns",
      link: "https://www.youtube.com/watch?v=ut5kp56wW_4"
    },
    {
      title: "ReAct Framework - How to Make AI Take Actions",
      link: "https://www.youtube.com/watch?v=wVpJjlPP7AY"
    },
    {
      title: "Prompt Injection & Security - Important for BAs",
      link: "https://www.youtube.com/watch?v=Sv5OLj2nVAQ"
    }
  ],

  // ========== WEEK 6 (Days 36-42): EMBEDDINGS & VECTORS ==========
  // Goal: Understand semantic understanding - foundation for RAG
  
  day36: [{
    title: "Vector Embeddings Explained - How AI Understands Meaning",
    link: "https://www.youtube.com/watch?v=5MaWmXwxFNQ"
  }],
  
  day37: [{
    title: "Word Embeddings - Word2Vec, GloVe Explained",
    link: "https://www.youtube.com/watch?v=viZrOnJclY0"
  }],
  
  day38: [{
    title: "Semantic Search - Why It's Better Than Keyword Search",
    link: "https://www.youtube.com/watch?v=lHf_JhVX89I"
  }],
  
  day39: [{
    title: "Cosine Similarity - How Computers Measure Meaning",
    link: "https://www.youtube.com/watch?v=e9U0QAFbfLI"
  }],
  
  day40: [{
    title: "Sentence Embeddings - Understanding Entire Sentences",
    link: "https://www.youtube.com/watch?v=xI0HHN5XKDo"
  }],
  
  day41: [
    {
      title: "Vector Databases Explained - Storing Meaning at Scale",
      link: "https://www.youtube.com/watch?v=klTvEwg3oJ4"
    },
    {
      title: "Hybrid Search - Combining Vector + Keyword Search",
      link: "https://www.youtube.com/watch?v=6pJBMgOl6LQ"
    },
    {
      title: "BERT Embeddings - Pre-trained Semantic Understanding",
      link: "https://www.youtube.com/watch?v=xI0HHN5XKDo"
    }
  ],
  
  day42: [
    {
      title: "Building Semantic Search Systems - What BAs Can Build",
      link: "https://www.youtube.com/watch?v=klTvEwg3oJ4"
    },
    {
      title: "Embeddings for Business - Document Search, Recommendations",
      link: "https://www.youtube.com/watch?v=5MaWmXwxFNQ"
    },
    {
      title: "Advanced Vector Search Techniques",
      link: "https://www.youtube.com/watch?v=JChPi0CRnDY"
    }
  ],

  // ========== WEEK 7 (Days 43-49): RAG - THE GAME CHANGER ==========
  // Goal: Deep understanding of RAG - BAs build this the most
  
  day43: [{
    title: "What is RAG? - How to Give AI Access to Your Data",
    link: "https://www.youtube.com/watch?v=T-D1OfcDW1M"
  }],
  
  day44: [{
    title: "RAG Architecture - The Complete Pipeline Explained",
    link: "https://www.youtube.com/watch?v=63B-3rqRFbQ"
  }],
  
  day45: [{
    title: "RAG: The 2025 Best-Practice Stack - Production Patterns",
    link: "https://www.youtube.com/watch?v=TaXhaA76bfA"
  }],
  
  day46: [{
    title: "Chunking Strategies - How to Split Documents for RAG",
    link: "https://www.youtube.com/watch?v=8OJC21T2SL4"
  }],
  
  day47: [{
    title: "Retrieval Techniques - Finding Relevant Documents",
    link: "https://www.youtube.com/watch?v=wd7TZ4w1mSw"
  }],
  
  day48: [
    {
      title: "RAG vs Fine-tuning - Understand the Trade-offs",
      link: "https://www.youtube.com/watch?v=00Q0G84kq3M"
    },
    {
      title: "Advanced RAG - Reranking, Filtering, Augmentation",
      link: "https://www.youtube.com/watch?v=JChPi0CRnDY"
    },
    {
      title: "Complete RAG Crash Course With Langchain",
      link: "https://www.youtube.com/watch?v=o126p1QN_RI"
    }
  ],
  
  day49: [
    {
      title: "Evaluating RAG Systems - Metrics That Matter",
      link: "https://www.youtube.com/watch?v=S6uJqFpLJXw"
    },
    {
      title: "Knowledge Graphs with RAG - Advanced Patterns",
      link: "https://www.youtube.com/watch?v=mmz5WqYTqsA"
    },
    {
      title: "What BAs Can Build - RAG Applications",
      link: "https://www.youtube.com/watch?v=8QRvKCCp2B0"
    }
  ],

  // ========== WEEK 8 (Days 50-56): AGENTS & MCP ==========
  // Goal: Understanding agents - beyond Q&A to actions
  
  day50: [{
    title: "What are AI Agents? - Beyond Simple Chatbots",
    link: "https://www.youtube.com/watch?v=F8NKVhkZZWI"
  }],
  
  day51: [{
    title: "Agent Architecture - How Agents Think and Act",
    link: "https://www.youtube.com/watch?v=bTMPwUgLZf0"
  }],
  
  day52: [{
    title: "ReAct Framework - Reasoning + Acting",
    link: "https://www.youtube.com/watch?v=wVpJjlPP7AY"
  }],
  
  day53: [{
    title: "Function Calling in LLMs - How Agents Use Tools",
    link: "https://www.youtube.com/watch?v=0-zlUy7VUjQ"
  }],
  
  day54: [{
    title: "Model Context Protocol (MCP) - Universal Tool Access",
    link: "https://www.youtube.com/watch?v=tzrwxLNHtRY"
  }],
  
  day55: [
    {
      title: "MCP Complete Deep Dive - Why It Matters",
      link: "https://www.youtube.com/watch?v=7j_NE6Pjv-E"
    },
    {
      title: "MCP vs RAG - When to Use Each",
      link: "https://www.youtube.com/watch?v=FSvLF6O_vYs"
    },
    {
      title: "Building AI Agents - What BAs Can Create",
      link: "https://www.youtube.com/watch?v=4kOGb-5C73U"
    }
  ],
  
  day56: [
    {
      title: "Multi-Agent Systems - Agents Working Together",
      link: "https://www.youtube.com/watch?v=5TFZfUqsVJs"
    },
    {
      title: "Agent Orchestration - Complex Workflows",
      link: "https://www.youtube.com/watch?v=9izHUWherYw"
    },
    {
      title: "Autonomous Agents - The Future BAs Will Build",
      link: "https://www.youtube.com/watch?v=j8H7gsJN96U"
    }
  ],

  // ========== WEEK 9 (Days 57-63): PRACTICAL BA IMPLEMENTATIONS ==========
  // Goal: Understanding real systems BAs work with - Voice, OCR, etc
  
  day57: [{
    title: "How Voice Assistants Work - ASR, NLU, TTS Pipeline",
    link: "https://www.youtube.com/watch?v=1vRr_VepZHg"
  }],
  
  day58: [{
    title: "Speech Recognition (ASR) - How Computers Understand Speech",
    link: "https://www.youtube.com/watch?v=s2r5TLLbk3w"
  }],
  
  day59: [{
    title: "Text-to-Speech (TTS) - How Computers Generate Speech",
    link: "https://www.youtube.com/watch?v=HeH8zJ5CKN0"
    }],
  
  day60: [{
    title: "How Chatbots Work - NLU, Intent, Dialogue",
    link: "https://www.youtube.com/watch?v=1lwddP0KUEg"
  }],
  
  day61: [{
    title: "OCR and Document AI - Reading Documents Automatically",
    link: "https://www.youtube.com/watch?v=j_gI4SlVrz8"
  }],
  
  day62: [
    {
      title: "Deep Learning for OCR - Modern Approaches",
      link: "https://www.youtube.com/watch?v=g9fAZPZGGYg"
    },
    {
      title: "Building Document Intelligence - What BAs Can Create",
      link: "https://www.youtube.com/watch?v=nMiFdELFdPg"
    },
    {
      title: "Form Extraction and Data Capture",
      link: "https://www.youtube.com/watch?v=RU4kTyI7eQQ"
    }
  ],
  
  day63: [
    {
      title: "Computer Vision Fundamentals - Images and AI",
      link: "https://www.youtube.com/watch?v=B_8kKi4vwFE"
    },
    {
      title: "Multimodal AI - Understanding Images, Text, Audio Together",
      link: "https://www.youtube.com/watch?v=bZQun8Y4L2A"
    },
    {
      title: "GPT-4V - Multimodal Model Capabilities",
      link: "https://www.youtube.com/watch?v=C2dxKTmMjBY"
    }
  ],

  // ========== WEEK 10 (Days 64-70): WHAT BAs CAN BUILD - STRATEGY ==========
  // Goal: Making strategic decisions, understanding business value
  
  day64: [{
    title: "Build vs Buy - Deciding What to Build",
    link: "https://www.youtube.com/watch?v=00Q0G84kq3M"
  }],
  
  day65: [{
    title: "AI ROI and Business Value - Making the Case",
    link: "https://www.youtube.com/watch?v=UFSDMBhCk1s"
  }],
  
  day66: [{
    title: "MLOps for BAs - Deploying and Monitoring AI",
    link: "https://www.youtube.com/watch?v=ZVWg18AXXuE"
  }],
  
  day67: [{
    title: "A/B Testing AI Systems - Measuring Success",
    link: "https://www.youtube.com/watch?v=fMlR5W-bgXs"
  }],
  
  day68: [{
    title: "AI Ethics and Responsible AI - What BAs Need to Know",
    link: "https://www.youtube.com/watch?v=TU0zigKDYJU"
  }],
  
  day69: [
    {
      title: "Making AI Explainable - XAI for Business",
      link: "https://www.youtube.com/watch?v=3YlYVD1ytac"
    },
    {
      title: "AI Bias and Fairness - Critical for BAs",
      link: "https://www.youtube.com/watch?v=7cInNcogQxg"
    },
    {
      title: "Privacy in AI Systems - GDPR, Data Protection",
      link: "https://www.youtube.com/watch?v=ZaPV1OSEpHw"
    }
  ],
  
  day70: [
    {
      title: "Future AI Trends - What BAs Should Prepare For",
      link: "https://www.youtube.com/watch?v=cdiD-9MMpb0"
    },
    {
      title: "Emergent Abilities in LLMs - New Capabilities",
      link: "https://www.youtube.com/watch?v=dbo3kNKPaUA"
    },
    {
      title: "Path to AGI - Understanding the Roadmap",
      link: "https://www.youtube.com/watch?v=5Aer7MUSuSU"
    }
  ],

  // ========== WEEK 11 (Days 71-77): PYTHON BASICS - MINIMAL BUT SUFFICIENT ==========
  // Goal: Python for understanding code, writing simple scripts (NOT deep coding)
  
  day71: [{
    title: "Python for AI - Quick Start (No Software Engineering Background Needed)",
    link: "https://www.youtube.com/watch?v=pNg2DJ4spXg"
  }],
  
  day72: [{
    title: "Python Fundamentals - Variables, Data Types, Functions",
    link: "https://www.youtube.com/watch?v=K5KVEU3aaeQ"
  }],
  
  day73: [{
    title: "Python for Data - Working with Lists, Dicts, JSON",
    link: "https://www.youtube.com/watch?v=rfscVS0vtbw"
  }],
  
  day74: [{
    title: "Working with APIs in Python - The Practical Skill BAs Need",
    link: "https://www.youtube.com/watch?v=aqdWSjWC3xY"
  }],
  
  day75: [{
    title: "Understanding Code - Reading and Modifying Scripts",
    link: "https://www.youtube.com/watch?v=-65r_3r-nN4"
  }],
  
  day76: [
    {
      title: "NumPy for Data - Working with Numbers",
      link: "https://www.youtube.com/watch?v=GB9ByFAIAH4"
    },
    {
      title: "Pandas for Data - Working with Tables",
      link: "https://www.youtube.com/watch?v=vmEHCJofslg"
    },
    {
      title: "Data Visualization - Matplotlib Basics",
      link: "https://www.youtube.com/watch?v=3Xc3CA655Y4"
    }
  ],
  
  day77: [
    {
      title: "Python Requests Library - Calling APIs",
      link: "https://www.youtube.com/watch?v=aqdWSjWC3xY"
    },
    {
      title: "Working with JSON and APIs",
      link: "https://www.youtube.com/watch?v=rfscVS0vtbw"
    },
    {
      title: "File Operations - Reading, Writing Data",
      link: "https://www.youtube.com/watch?v=fLAfa-BQtOQ"
    }
  ],

  // ========== WEEK 12 (Days 78-84): PYTHON + AI - BUILDING WITH APIS ==========
  // Goal: Actually building things - using LLM APIs, RAG systems
  
  day78: [{
    title: "Building with OpenAI API - No Model Training Required",
    link: "https://www.youtube.com/watch?v=aqdWSjWC3xY"
  }],
  
  day79: [{
    title: "LangChain Basics - Framework for Building AI Apps",
    link: "https://www.youtube.com/watch?v=lG7Uxts9SXs"
  }],
  
  day80: [{
    title: "Building a Simple RAG System - Step by Step",
    link: "https://www.youtube.com/watch?v=tcqEUSNCn8I"
  }],
  
  day81: [{
    title: "Working with Embeddings - Creating and Searching",
    link: "https://www.youtube.com/watch?v=5MaWmXwxFNQ"
  }],
  
  day82: [{
    title: "OCR with Python - Reading Documents Programmatically",
    link: "https://www.youtube.com/watch?v=PY_N1XdFp4w"
  }],
  
  day83: [
    {
      title: "Complete RAG Implementation with Python",
      link: "https://www.youtube.com/watch?v=o126p1QN_RI"
    },
    {
      title: "Building Chatbots - Practical Implementation",
      link: "https://www.youtube.com/watch?v=1lwddP0KUEg"
    },
    {
      title: "Semantic Search Application",
      link: "https://www.youtube.com/watch?v=klTvEwg3oJ4"
    }
  ],
  
  day84: [
    {
      title: "Building AI Agents in Python - Practical Approach",
      link: "https://www.youtube.com/watch?v=bTMPwUgLZf0"
    },
    {
      title: "Vector Databases - ChromaDB, Pinecone",
      link: "https://www.youtube.com/watch?v=klTvEwg3oJ4"
    },
    {
      title: "Error Handling and Debugging in AI Apps",
      link: "https://www.youtube.com/watch?v=aqdWSjWC3xY"
    }
  ],

  // ========== WEEK 13 (Days 85-90): CAPSTONE - BUILDING REAL SOLUTIONS ==========
  // Goal: Build actual solutions - BA as a developer
  
  day85: [{
    title: "Capstone Project 1: Building a Smart Chatbot with RAG",
    link: "https://www.youtube.com/watch?v=tcqEUSNCn8I"
  }],
  
  day86: [{
    title: "Capstone Project 2: Document Intelligence System",
    link: "https://www.youtube.com/watch?v=PY_N1XdFp4w"
  }],
  
  day87: [{
    title: "Capstone Project 3: Intelligent Agent with Tools",
    link: "https://www.youtube.com/watch?v=bTMPwUgLZf0"
  }],
  
  day88: [{
    title: "Deployment Basics - Getting Your AI App Live",
    link: "https://www.youtube.com/watch?v=ZVWg18AXXuE"
  }],
  
  day89: [{
    title: "Monitoring and Maintenance - Keeping Systems Running",
    link: "https://www.youtube.com/watch?v=gNucBPrfKuw"
  }],
  
  day90: [
    {
      title: "Final Capstone: Your Own AI Solution - From Concept to Build",
      link: "https://www.youtube.com/watch?v=tcqEUSNCn8I"
    },
    {
      title: "Presenting Your AI Solution - Storytelling for Impact",
      link: "https://www.youtube.com/watch?v=UFSDMBhCk1s"
    },
    {
      title: "Career Path: From BA to AI Developer",
      link: "https://www.youtube.com/watch?v=s3KnSb9b4Pk"
    }
  ]
};

