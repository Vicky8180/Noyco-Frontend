# Polaris - Conversational UI Frontend

A modern, responsive frontend application built with Next.js, featuring conversational AI capabilities, real-time communication, and interactive data visualization.

## 🚀 Features

- **Conversational Interface**: Interactive chat interface with AI-powered responses
- **Real-time Communication**: WebSocket integration with Socket.IO and LiveKit
- **Data Visualization**: Dynamic charts and analytics dashboards
- **Authentication**: Secure user authentication and authorization
- **Payment Integration**: Stripe payment processing
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Animation**: Smooth animations with Framer Motion and GSAP

## 🛠️ Tech Stack

- **Framework**: Next.js 15.3.4 with App Router
- **UI Library**: React 19.1.0
- **Styling**: Tailwind CSS 4.0
- **State Management**: Redux Toolkit with React Redux
- **3D Graphics**: Three.js, React Three Fiber, React Three Drei
- **Animation**: Framer Motion, GSAP, Anime.js
- **Charts**: Chart.js with React Chart.js 2
- **Real-time**: Socket.IO Client, LiveKit Client
- **Payment**: Stripe
- **Icons**: Lucide React, React Icons, Heroicons
- **HTTP Client**: Axios

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18.0 or higher)
- **npm** or **yarn** package manager
- **Git**

## ⚡ Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd polaris/conversationalUI
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory and add the following environment variables:

```bash
# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000

# LiveKit Configuration
NEXT_PUBLIC_LIVEKIT_URL=wss://your-livekit-server.com
```

### 4. Start Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard interface
│   ├── marketing/         # Marketing pages
│   ├── stripe/            # Payment pages
│   ├── unauthorized/      # Access control pages
│   ├── layout.js          # Root layout
│   └── page.js            # Home page
├── components/            # Reusable UI components
│   ├── charts/            # Chart components
│   ├── landing/           # Landing page components
│   ├── AnimatedBlob.jsx   # 3D animated elements
│   ├── DashboardNavbar.js # Navigation components
│   └── ...
├── lib/                   # Utility libraries
│   ├── api.js             # API client
│   ├── constant.js        # App constants
│   └── utils.js           # Helper functions
├── store/                 # Redux store configuration
│   ├── slices/            # Redux slices
│   ├── api-thunk/         # Async actions
│   └── hooks/             # Custom hooks
├── stripe/                # Stripe integration
│   ├── components/        # Payment components
│   ├── services/          # Payment services
│   └── utils/             # Payment utilities
└── widget/                # Widget components
    ├── components/        # Widget UI components
    ├── hooks/             # Widget hooks
    └── pages/             # Widget pages
```

## 🔧 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build production application
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality

## 🎨 Styling

This project uses **Tailwind CSS** for styling with:

- Mobile-first responsive design
- Custom color palette
- Component-based styling

## 🔌 API Integration

The frontend communicates with the backend API through:

- **REST API**: HTTP requests using Axios
- **WebSocket**: Real-time communication with Socket.IO
- **LiveKit**: Voice and video communication

## 📊 State Management

Redux Toolkit is used for state management with:

- **Slices**: Feature-based state organization
- **RTK Query**: Efficient data fetching and caching
- **Custom Hooks**: Simplified state access

## 🎯 Key Components

### Landing Page
- Hero section with interactive 3D elements
- Features showcase
- Testimonials
- Call-to-action sections

### Dashboard
- Analytics charts and metrics
- Real-time data visualization
- User management interface
- Service management tools

### Conversational Interface
- Chat interface with AI responses
- Voice communication support
- Real-time message synchronization

## 🚀 Deployment

### Production Build

```bash
npm run build
npm run start
```

### Environment Variables for Production

Ensure all environment variables are properly set for production:

```bash
NEXT_PUBLIC_API_BASE_URL=https://your-api-domain.com
NEXT_PUBLIC_WS_URL=wss://your-websocket-domain.com
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_production_stripe_key
```


## 🔒 Security

- Environment variables for sensitive data
- JWT token handling for authentication
- CORS configuration for API requests
- Input validation and sanitization

## 🧪 Testing

To add testing to the project:

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```

## 📚 Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Contact the development team

## 🔄 Version History

- **v0.1.0**: Initial release with core features
- More versions will be documented as the project evolves
