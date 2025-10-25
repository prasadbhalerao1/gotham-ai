import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import mongoose from 'mongoose';
import Event from '../models/Event.js';
import Resource from '../models/Resource.js';
import logger from '../utils/logger.js';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from backend directory
dotenv.config({ path: join(__dirname, '..', '.env') });

const events = [
  {
    title: 'AI Tech Session',
    slug: 'ai-tech-session-2025',
    description: 'Gain insights from industry leaders in AI & ML! Join us for an immersive session exploring the latest breakthroughs in artificial intelligence.',
    content: `
      <h2>About the Event</h2>
      <p>Join us for an exclusive AI Tech Session where industry leaders share their insights on the latest developments in artificial intelligence and machine learning.</p>
      
      <h3>What You'll Learn</h3>
      <ul>
        <li>Latest trends in AI and Machine Learning</li>
        <li>Real-world applications of AI in various industries</li>
        <li>Career opportunities in AI</li>
        <li>Hands-on demonstrations and Q&A sessions</li>
      </ul>
      
      <h3>Who Should Attend</h3>
      <p>This event is perfect for students, professionals, and anyone interested in learning about AI and its applications.</p>
    `,
    date: new Date('2025-10-11T12:30:00'),
    dateDisplay: 'October 11, 2025',
    time: '12:30 PM - 4:00 PM',
    location: 'Jaywant Auditorium, JSPM Campus',
    image: '/img/Nvidia-event.png',
    gallery: [
      '/img/Nvidia-event.png',
      '/img/ai-event-1.jpg',
      '/img/ai-event-2.jpg',
      '/img/ai-event-3.jpg',
    ],
    attendees: 250,
    category: 'Technology',
    speakers: [
      {
        name: 'Dr. Sarah Johnson',
        title: 'AI Research Lead at Tech Corp',
        bio: 'Leading AI researcher with 15+ years of experience',
        image: '/img/speaker-1.jpg',
      },
      {
        name: 'Prof. Michael Chen',
        title: 'Professor of Computer Science',
        bio: 'Expert in machine learning and neural networks',
        image: '/img/speaker-2.jpg',
      },
    ],
    tags: ['AI', 'Machine Learning', 'Technology', 'Workshop'],
    published: true,
  },
  {
    title: 'Deep Learning Workshop',
    slug: 'deep-learning-workshop',
    description: 'Hands-on workshop covering neural networks, CNNs, and RNNs. Build your first deep learning model!',
    content: `
      <h2>Workshop Overview</h2>
      <p>A comprehensive hands-on workshop where you'll learn to build and train deep learning models from scratch.</p>
      
      <h3>Topics Covered</h3>
      <ul>
        <li>Introduction to Neural Networks</li>
        <li>Convolutional Neural Networks (CNNs)</li>
        <li>Recurrent Neural Networks (RNNs)</li>
        <li>Transfer Learning and Fine-tuning</li>
        <li>Building real-world applications</li>
      </ul>
      
      <h3>Prerequisites</h3>
      <p>Basic Python programming knowledge and familiarity with machine learning concepts.</p>
    `,
    date: new Date('2025-11-15T10:00:00'),
    dateDisplay: 'November 15, 2025',
    time: '10:00 AM - 5:00 PM',
    location: 'Computer Lab, Building A',
    image: '/img/deep-learning.jpg',
    gallery: [
      '/img/deep-learning.jpg',
      '/img/workshop-1.jpg',
      '/img/workshop-2.jpg',
    ],
    attendees: 150,
    category: 'Workshop',
    tags: ['Deep Learning', 'Neural Networks', 'Python', 'Hands-on'],
    published: true,
  },
  {
    title: 'AI Networking Mixer',
    slug: 'ai-networking-mixer',
    description: 'Connect with AI enthusiasts, professionals, and researchers. Expand your network in the AI community!',
    content: `
      <h2>Event Details</h2>
      <p>An evening of networking with fellow AI enthusiasts, industry professionals, and researchers.</p>
      
      <h3>What to Expect</h3>
      <ul>
        <li>Meet and connect with AI professionals</li>
        <li>Share ideas and collaborate on projects</li>
        <li>Learn about career opportunities</li>
        <li>Enjoy refreshments and casual conversations</li>
      </ul>
    `,
    date: new Date('2025-12-01T18:00:00'),
    dateDisplay: 'December 1, 2025',
    time: '6:00 PM - 9:00 PM',
    location: 'Innovation Hub, Tech Park',
    image: '/img/networking.jpg',
    gallery: ['/img/networking.jpg'],
    attendees: 200,
    category: 'Networking',
    tags: ['Networking', 'Community', 'Career'],
    published: true,
  },
];

const resources = [
  {
    title: 'Introduction to Machine Learning',
    slug: 'intro-to-machine-learning',
    description: 'A comprehensive guide to getting started with machine learning, covering fundamental concepts and algorithms.',
    content: 'Detailed content about machine learning basics...',
    type: 'article',
    category: 'Machine Learning',
    difficulty: 'Beginner',
    image: '/img/ml-intro.jpg',
    url: 'https://example.com/ml-intro',
    author: 'Gotham AI Team',
    tags: ['Machine Learning', 'Beginner', 'Tutorial'],
    featured: true,
    published: true,
  },
  {
    title: 'Deep Learning Specialization',
    slug: 'deep-learning-specialization',
    description: 'Complete course on deep learning from basics to advanced topics including CNNs, RNNs, and GANs.',
    type: 'course',
    category: 'Deep Learning',
    difficulty: 'Intermediate',
    image: '/img/dl-course.jpg',
    url: 'https://example.com/dl-course',
    author: 'Andrew Ng',
    tags: ['Deep Learning', 'Course', 'Neural Networks'],
    featured: true,
    published: true,
  },
  {
    title: 'Natural Language Processing with Python',
    slug: 'nlp-with-python',
    description: 'Learn how to process and analyze text data using Python and popular NLP libraries.',
    type: 'tutorial',
    category: 'NLP',
    difficulty: 'Intermediate',
    image: '/img/nlp-tutorial.jpg',
    url: 'https://example.com/nlp-tutorial',
    author: 'Jane Smith',
    tags: ['NLP', 'Python', 'Text Processing'],
    featured: true,
    published: true,
  },
  {
    title: 'Computer Vision Fundamentals',
    slug: 'computer-vision-fundamentals',
    description: 'Explore the basics of computer vision, image processing, and object detection.',
    type: 'article',
    category: 'Computer Vision',
    difficulty: 'Beginner',
    image: '/img/cv-fundamentals.jpg',
    url: 'https://example.com/cv-fundamentals',
    author: 'Gotham AI Team',
    tags: ['Computer Vision', 'Image Processing', 'OpenCV'],
    featured: false,
    published: true,
  },
  {
    title: 'TensorFlow 2.0 Complete Guide',
    slug: 'tensorflow-complete-guide',
    description: 'Master TensorFlow 2.0 with this comprehensive guide covering everything from basics to advanced topics.',
    type: 'book',
    category: 'Deep Learning',
    difficulty: 'Advanced',
    image: '/img/tensorflow-guide.jpg',
    url: 'https://example.com/tensorflow-guide',
    author: 'Tech Publications',
    tags: ['TensorFlow', 'Deep Learning', 'Python'],
    featured: false,
    published: true,
  },
  {
    title: 'ImageNet Dataset',
    slug: 'imagenet-dataset',
    description: 'Large-scale dataset for image classification and object detection tasks.',
    type: 'dataset',
    category: 'Computer Vision',
    difficulty: 'Intermediate',
    image: '/img/imagenet.jpg',
    url: 'https://example.com/imagenet',
    author: 'Stanford University',
    tags: ['Dataset', 'Computer Vision', 'Classification'],
    featured: false,
    published: true,
  },
  {
    title: 'Reinforcement Learning: An Introduction',
    slug: 'reinforcement-learning-intro',
    description: 'Classic textbook on reinforcement learning covering theory and practical applications.',
    type: 'book',
    category: 'Machine Learning',
    difficulty: 'Advanced',
    image: '/img/rl-book.jpg',
    url: 'https://example.com/rl-book',
    author: 'Sutton & Barto',
    tags: ['Reinforcement Learning', 'Theory', 'Algorithms'],
    featured: false,
    published: true,
  },
  {
    title: 'PyTorch Tutorials',
    slug: 'pytorch-tutorials',
    description: 'Official PyTorch tutorials covering everything from basics to advanced deep learning.',
    type: 'tutorial',
    category: 'Deep Learning',
    difficulty: 'Beginner',
    image: '/img/pytorch-tutorials.jpg',
    url: 'https://pytorch.org/tutorials',
    author: 'PyTorch Team',
    tags: ['PyTorch', 'Deep Learning', 'Tutorial'],
    featured: true,
    published: true,
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info('Connected to MongoDB');

    // Clear existing data
    await Event.deleteMany({});
    await Resource.deleteMany({});
    logger.info('Cleared existing data');

    // Insert events
    await Event.insertMany(events);
    logger.info(`Inserted ${events.length} events`);

    // Insert resources
    await Resource.insertMany(resources);
    logger.info(`Inserted ${resources.length} resources`);

    logger.info('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    logger.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
