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
  day15: [
    {
      title: "What is Deep Learning? Complete Introduction",
      link: "https://www.youtube.com/watch?v=6M5VXKLf4D4"
    }
  ],
  day16: [
    {
      title: "Neurons and Activation Functions",
      link: "https://www.youtube.com/watch?v=Xvg00QnyaIY"
    }
  ],
  day17: [
    {
      title: "Feedforward Neural Networks Explained",
      link: "https://www.youtube.com/watch?v=CqOfi41LfDw"
    }
  ],
  day18: [
    {
      title: "Backpropagation Calculus Explained",
      link: "https://www.youtube.com/watch?v=tIeHLnjs5U8"
    }
  ],
  day19: [
    {
      title: "Gradient Descent Clearly Explained",
      link: "https://www.youtube.com/watch?v=sDv4f4s2SB8"
    }
  ],
  day20: [
    {
      title: "CNN Explained - Image Recognition",
      link: "https://www.youtube.com/watch?v=YRhxdVk_sIs"
    },
    {
      title: "How CNNs Actually Work",
      link: "https://www.youtube.com/watch?v=JB8T_zN7ZC0"
    },
    {
      title: "Transfer Learning Explained",
      link: "https://www.youtube.com/watch?v=5T-iXNNiwIs"
    }
  ],
  day21: [
    {
      title: "Recurrent Neural Networks (RNN) Explained",
      link: "https://www.youtube.com/watch?v=AsNTP8Kwu80"
    },
    {
      title: "LSTM Networks Explained",
      link: "https://www.youtube.com/watch?v=YCzL96nL7j0"
    },
    {
      title: "Regularization Techniques in Deep Learning",
      link: "https://www.youtube.com/watch?v=6g0t3Phly2M"
    }
  ],
  day22: [
    {
      title: "Natural Language Processing in 10 Minutes",
      link: "https://www.youtube.com/watch?v=CMrHM8a3hqw"
    }
  ],
  day23: [
    {
      title: "NLP Text Preprocessing Explained",
      link: "https://www.youtube.com/watch?v=nxhCyeRR75Q"
    }
  ],
  day24: [
    {
      title: "Word Embeddings Explained Simply",
      link: "https://www.youtube.com/watch?v=viZrOnJclY0"
    }
  ],
  day25: [
    {
      title: "Sentiment Analysis Explained",
      link: "https://www.youtube.com/watch?v=9LZ9hMzr3f8"
    }
  ],
  day26: [
    {
      title: "Named Entity Recognition (NER) Explained",
      link: "https://www.youtube.com/watch?v=k4NhjLFZ3ic"
    }
  ],
  day27: [
    {
      title: "POS Tagging and Dependency Parsing",
      link: "https://www.youtube.com/watch?v=xvqsFTUsOmc"
    },
    {
      title: "Seq2Seq Models Explained",
      link: "https://www.youtube.com/watch?v=L8HKweZIOmg"
    },
    {
      title: "Attention Mechanism Explained",
      link: "https://www.youtube.com/watch?v=fjJOgb-E41w"
    }
  ],
  day28: [
    {
      title: "Self-Attention in NLP",
      link: "https://www.youtube.com/watch?v=yGTUuEx3GkA"
    },
    {
      title: "Transformers Explained Visually",
      link: "https://www.youtube.com/watch?v=4Bdc55j80l8"
    },
    {
      title: "BERT Explained in Detail",
      link: "https://www.youtube.com/watch?v=xI0HHN5XKDo"
    }
  ],
  day29: [
    {
      title: "Generative AI Explained in 5 Minutes",
      link: "https://www.youtube.com/watch?v=hfIUstzHs9A"
    }
  ],
  day30: [
    {
      title: "Discriminative vs Generative Models",
      link: "https://www.youtube.com/watch?v=V7TliSCqOwI"
    }
  ],
  day31: [
    {
      title: "Variational Autoencoders (VAE) Explained",
      link: "https://www.youtube.com/watch?v=9zKuYvjFFS8"
    }
  ],
  day32: [
    {
      title: "GANs Explained for Everyone",
      link: "https://www.youtube.com/watch?v=8L11aMN5KY8"
    }
  ],
  day33: [
    {
      title: "Diffusion Models Explained",
      link: "https://www.youtube.com/watch?v=fbLgFrlTnGU"
    }
  ],
  day34: [
    {
      title: "How DALL-E 2 Actually Works",
      link: "https://www.youtube.com/watch?v=F1X4fHzF4mQ"
    },
    {
      title: "Pix2Pix and Image Translation",
      link: "https://www.youtube.com/watch?v=9SGs4Nm0VR4"
    },
    {
      title: "Neural Style Transfer Explained",
      link: "https://www.youtube.com/watch?v=R39tWYYKNcI"
    }
  ],
  day35: [
    {
      title: "AI Music Generation Explained",
      link: "https://www.youtube.com/watch?v=Emidxpkyk6o"
    },
    {
      title: "How AI Video Generation Works",
      link: "https://www.youtube.com/watch?v=TqsZpCNUiXs"
    },
    {
      title: "The Technology Behind DeepFakes",
      link: "https://www.youtube.com/watch?v=7XchCsYtYMQ"
    }
  ],
  day36: [
    {
      title: "LLMs Explained - How ChatGPT Works",
      link: "https://www.youtube.com/watch?v=zjkBMFhNj_g"
    }
  ],
  day37: [
    {
      title: "GPT Architecture Explained in Detail",
      link: "https://www.youtube.com/watch?v=kCc8FmEb1nY"
    }
  ],
  day38: [
    {
      title: "How ChatGPT Was Trained - Andrej Karpathy",
      link: "https://www.youtube.com/watch?v=VPRSBzXzavo"
    }
  ],
  day39: [
    {
      title: "Tokenization Explained - Andrej Karpathy",
      link: "https://www.youtube.com/watch?v=zduSFxRajkE"
    }
  ],
  day40: [
    {
      title: "Context Windows in LLMs Explained",
      link: "https://www.youtube.com/watch?v=CZl8JtKb6g8"
    }
  ],
  day41: [
    {
      title: "LLM Parameters - Temperature and Top-P",
      link: "https://www.youtube.com/watch?v=YJNjZGbIbjE"
    },
    {
      title: "Fine-tuning LLMs Explained",
      link: "https://www.youtube.com/watch?v=eC6Hd1hFvos"
    },
    {
      title: "RLHF - How ChatGPT Learns from Feedback",
      link: "https://www.youtube.com/watch?v=2MBJOuVq380"
    }
  ],
  day42: [
    {
      title: "Emergent Abilities - What Makes LLMs Special",
      link: "https://www.youtube.com/watch?v=dbo3kNKPaUA"
    },
    {
      title: "Why AI Hallucinates and How to Fix It",
      link: "https://www.youtube.com/watch?v=5p6G_6SzZ88"
    },
    {
      title: "GPT-4V and Multimodal AI",
      link: "https://www.youtube.com/watch?v=C2dxKTmMjBY"
    }
  ],
  day43: [
    {
      title: "Prompt Engineering Complete Guide",
      link: "https://www.youtube.com/watch?v=_ZvnD73m40o"
    }
  ],
  day44: [
    {
      title: "Zero-Shot and Few-Shot Learning Explained",
      link: "https://www.youtube.com/watch?v=uAFRN1aYgHk"
    }
  ],
  day45: [
    {
      title: "Chain-of-Thought Prompting Explained",
      link: "https://www.youtube.com/watch?v=H4v-DwW5AQo"
    }
  ],
  day46: [
    {
      title: "Semantic Understanding in NLP",
      link: "https://www.youtube.com/watch?v=lHf_JhVX89I"
    }
  ],
  day47: [
    {
      title: "Vector Embeddings Explained",
      link: "https://www.youtube.com/watch?v=5MaWmXwxFNQ"
    }
  ],
  day48: [
    {
      title: "Advanced Prompting Strategies",
      link: "https://www.youtube.com/watch?v=T9aRN5JkmL8"
    },
    {
      title: "Prompt Injection Attacks Explained",
      link: "https://www.youtube.com/watch?v=Sv5OLj2nVAQ"
    },
    {
      title: "Creating Effective AI Personas",
      link: "https://www.youtube.com/watch?v=mJVljdMNQQQ"
    }
  ],
  day49: [
    {
      title: "Tree-of-Thought Prompting",
      link: "https://www.youtube.com/watch?v=ut5kp56wW_4"
    },
    {
      title: "ReAct Framework Explained",
      link: "https://www.youtube.com/watch?v=wVpJjlPP7AY"
    },
    {
      title: "Cosine Similarity and Vector Search",
      link: "https://www.youtube.com/watch?v=e9U0QAFbfLI"
    }
  ],
  day50: [
    {
      title: "RAG Explained - Retrieval Augmented Generation",
      link: "https://www.youtube.com/watch?v=T-D1OfcDW1M"
    }
  ],
  day51: [
    {
      title: "Vector Databases Explained",
      link: "https://www.youtube.com/watch?v=klTvEwg3oJ4"
    }
  ],
  day52: [
    {
      title: "Chunking Strategies for RAG",
      link: "https://www.youtube.com/watch?v=8OJC21T2SL4"
    }
  ],
  day53: [
    {
      title: "Retrieval Techniques in RAG Systems",
      link: "https://www.youtube.com/watch?v=wd7TZ4w1mSw"
    }
  ],
  day54: [
    {
      title: "RAG vs Fine-tuning - Complete Comparison",
      link: "https://www.youtube.com/watch?v=00Q0G84kq3M"
    }
  ],
  day55: [
    {
      title: "Advanced RAG Techniques",
      link: "https://www.youtube.com/watch?v=JChPi0CRnDY"
    },
    {
      title: "Hybrid Search Explained",
      link: "https://www.youtube.com/watch?v=6pJBMgOl6LQ"
    },
    {
      title: "Improving RAG with Reranking",
      link: "https://www.youtube.com/watch?v=VYT3_5VBAVQ"
    }
  ],
  day56: [
    {
      title: "Using Knowledge Graphs with RAG",
      link: "https://www.youtube.com/watch?v=mmz5WqYTqsA"
    },
    {
      title: "Agentic RAG Systems",
      link: "https://www.youtube.com/watch?v=u5Vcrwpzoz8"
    },
    {
      title: "Evaluating RAG Systems",
      link: "https://www.youtube.com/watch?v=S6uJqFpLJXw"
    }
  ],
  day57: [
    {
      title: "Optical Character Recognition (OCR) Explained",
      link: "https://www.youtube.com/watch?v=RU4kTyI7eQQ"
    }
  ],
  day58: [
    {
      title: "Modern OCR with Deep Learning",
      link: "https://www.youtube.com/watch?v=g9fAZPZGGYg"
    }
  ],
  day59: [
    {
      title: "Document AI Explained",
      link: "https://www.youtube.com/watch?v=nMiFdELFdPg"
    }
  ],
  day60: [
    {
      title: "Handwriting Recognition with Deep Learning",
      link: "https://www.youtube.com/watch?v=8rXJjh21YTE"
    }
  ],
  day61: [
    {
      title: "How Chatbots Work - Complete Overview",
      link: "https://www.youtube.com/watch?v=1lwddP0KUEg"
    }
  ],
  day62: [
    {
      title: "NLU in Chatbots - Intent and Entities",
      link: "https://www.youtube.com/watch?v=8S-8uz5GQeM"
    },
    {
      title: "Dialogue State Tracking Explained",
      link: "https://www.youtube.com/watch?v=2v-6F2NN7fA"
    },
    {
      title: "Building Contextual Chatbots",
      link: "https://www.youtube.com/watch?v=U9PpdnDPCcQ"
    }
  ],
  day63: [
    {
      title: "Automatic Speech Recognition (ASR) Explained",
      link: "https://www.youtube.com/watch?v=s2r5TLLbk3w"
    },
    {
      title: "Text-to-Speech Technology Deep Dive",
      link: "https://www.youtube.com/watch?v=HeH8zJ5CKN0"
    },
    {
      title: "How Voice Assistants Work End-to-End",
      link: "https://www.youtube.com/watch?v=1vRr_VepZHg"
    }
  ],
  day64: [
    {
      title: "AI Agents Explained",
      link: "https://www.youtube.com/watch?v=F8NKVhkZZWI"
    }
  ],
  day65: [
    {
      title: "Function Calling in LLMs",
      link: "https://www.youtube.com/watch?v=0-zlUy7VUjQ"
    }
  ],
  day66: [
    {
      title: "Multi-Agent AI Systems",
      link: "https://www.youtube.com/watch?v=5TFZfUqsVJs"
    }
  ],
  day67: [
    {
      title: "Mixture of Experts (MoE) Explained",
      link: "https://www.youtube.com/watch?v=mwO6v4BlgZQ"
    }
  ],
  day68: [
    {
      title: "Constitutional AI by Anthropic",
      link: "https://www.youtube.com/watch?v=eaAonE58sLU"
    }
  ],
  day69: [
    {
      title: "Quantization Explained - Efficient AI Models",
      link: "https://www.youtube.com/watch?v=DcNHnMSjwVU"
    },
    {
      title: "LoRA Explained - Fine-tuning Made Easy",
      link: "https://www.youtube.com/watch?v=PXWYUTMt-AU"
    },
    {
      title: "Running AI on Edge Devices",
      link: "https://www.youtube.com/watch?v=6stDhEA0wFQ"
    }
  ],
  day70: [
    {
      title: "RLHF Complete Explanation",
      link: "https://www.youtube.com/watch?v=BG3jjnuw-XU"
    },
    {
      title: "Vision Transformers (ViT) Explained",
      link: "https://www.youtube.com/watch?v=TrdevFK_am4"
    },
    {
      title: "Lifelong Learning in AI",
      link: "https://www.youtube.com/watch?v=7qT5P9KJnWo"
    }
  ],
  day71: [
    {
      title: "MLOps Explained",
      link: "https://www.youtube.com/watch?v=ZVWg18AXXuE"
    }
  ],
  day72: [
    {
      title: "ML Model Monitoring Explained",
      link: "https://www.youtube.com/watch?v=gNucBPrfKuw"
    }
  ],
  day73: [
    {
      title: "A/B Testing ML Models",
      link: "https://www.youtube.com/watch?v=fMlR5W-bgXs"
    }
  ],
  day74: [
    {
      title: "Scaling Machine Learning Systems",
      link: "https://www.youtube.com/watch?v=7pFHNsx4_cA"
    }
  ],
  day75: [
    {
      title: "Building ML Data Pipelines",
      link: "https://www.youtube.com/watch?v=E7QimRVMvlw"
    }
  ],
  day76: [
    {
      title: "Feature Stores Explained",
      link: "https://www.youtube.com/watch?v=nC5WQMMy_7Q"
    },
    {
      title: "Building Real-Time ML Systems",
      link: "https://www.youtube.com/watch?v=QQ7XTjVx9VY"
    },
    {
      title: "ML Experiment Management",
      link: "https://www.youtube.com/watch?v=m7d5KQcKI8M"
    }
  ],
  day77: [
    {
      title: "AI Microservices Design Patterns",
      link: "https://www.youtube.com/watch?v=h8oKmBhKIB0"
    },
    {
      title: "Optimizing ML Model Serving",
      link: "https://www.youtube.com/watch?v=dZMC4UcaO9I"
    },
    {
      title: "Reducing ML Infrastructure Costs",
      link: "https://www.youtube.com/watch?v=FxJ0s85KS3c"
    }
  ],
  day78: [
    {
      title: "Autonomous AI Agents",
      link: "https://www.youtube.com/watch?v=j8H7gsJN96U"
    }
  ],
  day79: [
    {
      title: "Multimodal AI Models",
      link: "https://www.youtube.com/watch?v=bZQun8Y4L2A"
    }
  ],
  day80: [
    {
      title: "Graph Neural Networks (GNN) Explained",
      link: "https://www.youtube.com/watch?v=zCEYiCxrL_0"
    }
  ],
  day81: [
    {
      title: "Neuromorphic Computing Explained",
      link: "https://www.youtube.com/watch?v=l-jOfUOqxzE"
    }
  ],
  day82: [
    {
      title: "Federated Learning Explained",
      link: "https://www.youtube.com/watch?v=X8YYWfx7OQ4"
    }
  ],
  day83: [
    {
      title: "World Models in AI",
      link: "https://www.youtube.com/watch?v=9-euiSAd2GI"
    },
    {
      title: "AlphaFold Explained - AI for Science",
      link: "https://www.youtube.com/watch?v=gg7WjuFs8F4"
    },
    {
      title: "Causal Inference in AI",
      link: "https://www.youtube.com/watch?v=ZaPV1OSEpHw"
    }
  ],
  day84: [
    {
      title: "Making AI Explainable (XAI)",
      link: "https://www.youtube.com/watch?v=3YlYVD1ytac"
    },
    {
      title: "Ethics in AI Development",
      link: "https://www.youtube.com/watch?v=TU0zigKDYJU"
    },
    {
      title: "Path to Artificial General Intelligence",
      link: "https://www.youtube.com/watch?v=cdiD-9MMpb0"
    }
  ],
  day85: [
    {
      title: "Python for AI & ML - Crash Course Part 1",
      link: "https://www.youtube.com/watch?v=rfscVS0vtbw"
    }
  ],
  day86: [
    {
      title: "NumPy Complete Tutorial",
      link: "https://www.youtube.com/watch?v=GB9ByFAIAH4"
    }
  ],
  day87: [
    {
      title: "Pandas Tutorial for Beginners",
      link: "https://www.youtube.com/watch?v=vmEHCJofslg"
    }
  ],
  day88: [
    {
      title: "Matplotlib Crash Course",
      link: "https://www.youtube.com/watch?v=3Xc3CA655Y4"
    }
  ],
  day89: [
    {
      title: "PyTorch in 100 Minutes",
      link: "https://www.youtube.com/watch?v=V_xro1bcAuA"
    }
  ],
  day90: [
    {
      title: "Building with LLM APIs",
      link: "https://www.youtube.com/watch?v=aqdWSjWC3xY"
    },
    {
      title: "Build a RAG System from Scratch",
      link: "https://www.youtube.com/watch?v=tcqEUSNCn8I"
    },
    {
      title: "OCR with Python and Tesseract",
      link: "https://www.youtube.com/watch?v=PY_N1XdFp4w"
    }
  ]
};
