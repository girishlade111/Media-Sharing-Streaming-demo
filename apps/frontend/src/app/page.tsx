'use client';

import Link from 'next/link';
import { Header } from '@/components/Header';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Image,
  Video,
  FileText,
  Upload,
  Globe,
  Shield,
  Zap,
  Play,
  Users,
  Lock,
  Layers,
  Smartphone,
  Cloud,
  CheckCircle,
  ArrowRight,
  Star,
  TrendingUp,
  Clock,
  Activity,
  BarChart3,
  Database,
  Server,
  Code,
  Workflow,
  Palette,
  MessageSquare,
  Heart,
  Share2,
  Eye,
  Download,
  File,
  Film,
  ImageIcon,
  Presentation,
  Table,
  FileSpreadsheet,
  Wand2,
  Gauge,
  Headphones,
  Monitor,
  Tablet,
  Wifi,
  HardDrive,
  ArrowUpCircle,
  ArrowDownCircle,
  Building2,
  GraduationCap,
  ShoppingBag,
  Music,
  Gamepad2,
  Briefcase,
  Stethoscope,
  Landmark,
  Cpu,
} from 'lucide-react';

export default function Home() {
  useAuth();

  const features = [
    {
      icon: Image,
      title: 'Photo Sharing',
      description: 'Share your photos in stunning quality. Support for JPG, PNG, GIF, and WEBP formats with automatic optimization and CDN delivery.',
      color: 'bg-blue-500/10 text-blue-500',
    },
    {
      icon: Video,
      title: 'Video Streaming',
      description: 'Stream videos in adaptive quality with HLS support. Automatic transcoding into 1080p, 720p, 480p, and 360p for optimal playback on any connection.',
      color: 'bg-purple-500/10 text-purple-500',
    },
    {
      icon: FileText,
      title: 'Document Sharing',
      description: 'Share PDFs, DOCX, PPTX, and XLSX files. In-browser preview with react-pdf and mammoth.js for easy viewing without downloads.',
      color: 'bg-green-500/10 text-green-500',
    },
    {
      icon: Cloud,
      title: 'Cloud Storage',
      description: 'Powered by DigitalOcean Spaces with 99.99% durability guarantee. Scalable storage that grows with your needs.',
      color: 'bg-cyan-500/10 text-cyan-500',
    },
    {
      icon: Globe,
      title: 'Global CDN',
      description: 'Content delivered from 140+ edge locations worldwide. Low latency, high throughput, and improved user experience globally.',
      color: 'bg-indigo-500/10 text-indigo-500',
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'JWT authentication, signed URLs, private buckets, CORS restrictions, and file type validation keep your content secure.',
      color: 'bg-red-500/10 text-red-500',
    },
  ];

  const howItWorks = [
    {
      step: '01',
      title: 'Create Your Account',
      description: 'Sign up in seconds with email or OAuth. Get instant access to your personal media dashboard.',
      icon: Users,
    },
    {
      step: '02',
      title: 'Upload Your Content',
      description: 'Drag and drop files directly from your browser. Multipart uploads handle files up to 5GB with progress tracking.',
      icon: Upload,
    },
    {
      step: '03',
      title: 'Automatic Processing',
      description: 'Videos are transcoded, images are optimized, and documents are prepared for in-browser viewing.',
      icon: Zap,
    },
    {
      step: '04',
      title: 'Share & Stream',
      description: 'Share via link, embed, or social. Your content is delivered via CDN for blazing-fast access worldwide.',
      icon: Globe,
    },
  ];

  const stats = [
    { value: '99.99%', label: 'Storage Durability', icon: CheckCircle },
    { value: '140+', label: 'CDN Edge Locations', icon: Globe },
    { value: '< 50ms', label: 'Global Latency', icon: Clock },
    { value: '5GB', label: 'Max Upload Size', icon: Upload },
    { value: '100%', label: 'Uptime SLA', icon: Activity },
    { value: '4K', label: 'Video Quality Support', icon: Play },
  ];

  const useCases = [
    {
      title: 'Content Creators',
      description: 'Share high-quality photos and videos with your audience. Build your portfolio and reach viewers globally.',
      icon: Star,
      features: ['Unlimited uploads', 'Adaptive streaming', 'Analytics ready', 'Custom branding'],
    },
    {
      title: 'Businesses',
      description: 'Distribute training videos, marketing assets, and documents securely. Control access with private links.',
      icon: Layers,
      features: ['Team collaboration', 'Access control', 'Brand safety', 'API integration'],
    },
    {
      title: 'Educators',
      description: 'Deliver lecture recordings, course materials, and student submissions. Easy organization and sharing.',
      icon: Smartphone,
      features: ['Course organization', 'Student access', 'Document preview', 'Mobile friendly'],
    },
    {
      title: 'Developers',
      description: 'Integrate media storage into your apps with our REST API. Presigned URLs, webhooks, and comprehensive docs.',
      icon: Zap,
      features: ['REST API', 'Webhooks', 'SDK support', 'Direct uploads'],
    },
  ];

  const supportedFormats = {
    images: ['JPG', 'PNG', 'GIF', 'WEBP', 'HEIC', 'TIFF'],
    videos: ['MP4', 'WEBM', 'MOV', 'AVI', 'MKV', 'WMV'],
    documents: ['PDF', 'DOCX', 'PPTX', 'XLSX', 'TXT', 'RTF'],
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background">
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
          <div className="container relative py-20 md:py-32">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Zap className="h-4 w-4" />
                Powered by DigitalOcean Spaces
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
                Share Your Media with the{' '}
                <span className="text-primary bg-gradient-to-r from-primary to-primary/60 bg-clip-text">
                  World
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-[800px] mx-auto leading-relaxed">
                Upload, stream, and share your photos, videos, and documents with enterprise-grade 
                performance. Built on DigitalOcean Spaces for blazing-fast global delivery.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                <Link href="/register">
                  <Button size="lg" className="h-12 px-8 text-lg gap-2">
                    Get Started Free
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/upload">
                  <Button variant="outline" size="lg" className="h-12 px-8 text-lg">
                    Start Uploading
                  </Button>
                </Link>
              </div>
              <div className="flex items-center justify-center gap-8 pt-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  No credit card required
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Free tier available
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Setup in minutes
                </div>
              </div>
            </div>
          </div>
          {/* Gradient overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        </section>

        {/* Stats Section */}
        <section className="border-y bg-background/50">
          <div className="container py-12">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-2xl md:text-3xl font-bold">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 md:py-32">
          <div className="container">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                Everything You Need to Share Media
              </h2>
              <p className="text-xl text-muted-foreground max-w-[700px] mx-auto">
                A complete platform for uploading, processing, and delivering all types of media content.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <Card key={feature.title} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <CardHeader>
                      <div className={`h-14 w-14 rounded-xl ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <Icon className="h-7 w-7" />
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                      <CardDescription className="text-base leading-relaxed">
                        {feature.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Supported Formats Section */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                Wide Format Support
              </h2>
              <p className="text-xl text-muted-foreground max-w-[700px] mx-auto">
                Upload your content in any format. We handle the rest.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="text-center space-y-4 p-6 rounded-xl bg-background border">
                <div className="h-14 w-14 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mx-auto">
                  <Image className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold">Images</h3>
                <div className="flex flex-wrap justify-center gap-2">
                  {supportedFormats.images.map((format) => (
                    <span key={format} className="px-3 py-1 rounded-full bg-muted text-sm font-medium">
                      {format}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-center space-y-4 p-6 rounded-xl bg-background border">
                <div className="h-14 w-14 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center mx-auto">
                  <Video className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold">Videos</h3>
                <div className="flex flex-wrap justify-center gap-2">
                  {supportedFormats.videos.map((format) => (
                    <span key={format} className="px-3 py-1 rounded-full bg-muted text-sm font-medium">
                      {format}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-center space-y-4 p-6 rounded-xl bg-background border">
                <div className="h-14 w-14 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center mx-auto">
                  <FileText className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold">Documents</h3>
                <div className="flex flex-wrap justify-center gap-2">
                  {supportedFormats.documents.map((format) => (
                    <span key={format} className="px-3 py-1 rounded-full bg-muted text-sm font-medium">
                      {format}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 md:py-32">
          <div className="container">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                How It Works
              </h2>
              <p className="text-xl text-muted-foreground max-w-[700px] mx-auto">
                Get started in minutes. Our platform handles the complexity.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {howItWorks.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={item.step} className="relative">
                    {index < howItWorks.length - 1 && (
                      <div className="hidden lg:block absolute top-12 left-1/2 w-full h-px bg-gradient-to-r from-primary/30 to-transparent" />
                    )}
                    <div className="relative text-center space-y-4">
                      <div className="inline-flex items-center justify-center h-24 w-24 rounded-2xl bg-primary text-primary-foreground text-3xl font-bold shadow-lg">
                        {item.step}
                      </div>
                      <div className="h-14 w-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto -mt-7 relative z-10">
                        <Icon className="h-7 w-7" />
                      </div>
                      <h3 className="text-xl font-semibold pt-4">{item.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="py-20 md:py-32 bg-muted/30">
          <div className="container">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                Built for Everyone
              </h2>
              <p className="text-xl text-muted-foreground max-w-[700px] mx-auto">
                From individual creators to enterprise teams, our platform scales with your needs.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {useCases.map((useCase) => {
                const Icon = useCase.icon;
                return (
                  <Card key={useCase.title} className="hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <div className="h-14 w-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                        <Icon className="h-7 w-7" />
                      </div>
                      <CardTitle className="text-2xl">{useCase.title}</CardTitle>
                      <CardDescription className="text-base leading-relaxed">
                        {useCase.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-3">
                        {useCase.features.map((feature) => (
                          <div key={feature} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Technical Features Section */}
        <section className="py-20 md:py-32">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div className="space-y-4">
                  <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                    Enterprise-Grade Technology
                  </h2>
                  <p className="text-xl text-muted-foreground leading-relaxed">
                    Built on modern infrastructure with performance and security at its core.
                  </p>
                </div>
                <div className="space-y-6">
                  {[
                    {
                      title: 'Direct-to-S3 Uploads',
                      description: 'Files upload directly from your browser to DigitalOcean Spaces via presigned URLs. No server bottleneck, maximum speed.',
                      icon: Upload,
                    },
                    {
                      title: 'Adaptive Bitrate Streaming',
                      description: 'Videos automatically transcoded to multiple qualities. HLS protocol ensures smooth playback on any connection.',
                      icon: Play,
                    },
                    {
                      title: 'Redis-Backed Job Queues',
                      description: 'Background processing with BullMQ ensures reliable video transcoding and thumbnail generation.',
                      icon: Zap,
                    },
                    {
                      title: 'PostgreSQL with Prisma',
                      description: 'Type-safe database access with full ACID compliance. Optimized queries for fast content retrieval.',
                      icon: Layers,
                    },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.title} className="flex gap-4">
                        <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                          <Icon className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                          <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border p-8">
                  <div className="h-full w-full rounded-xl bg-background/50 flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <Cloud className="h-24 w-24 text-primary mx-auto opacity-50" />
                      <div className="text-2xl font-bold">DigitalOcean Spaces</div>
                      <div className="text-muted-foreground">S3-Compatible Object Storage</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section className="py-20 md:py-32 bg-muted/30">
          <div className="container">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                Security First
              </h2>
              <p className="text-xl text-muted-foreground max-w-[700px] mx-auto">
                Your content is protected with enterprise-grade security measures at every layer.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Lock,
                  title: 'JWT Authentication',
                  description: 'Short-lived tokens with rotating refresh tokens for secure sessions.',
                },
                {
                  icon: Shield,
                  title: 'Signed URLs',
                  description: 'Time-limited access URLs for private content. Full control over who sees what.',
                },
                {
                  icon: CheckCircle,
                  title: 'File Validation',
                  description: 'Magic byte verification, not just extension checks. Block malicious uploads.',
                },
                {
                  icon: Globe,
                  title: 'CORS Protection',
                  description: 'Restrict access to approved origins only. Prevent unauthorized embedding.',
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <Card key={item.title} className="text-center">
                    <CardHeader>
                      <div className="h-14 w-14 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-4">
                        <Icon className="h-7 w-7" />
                      </div>
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                      <CardDescription className="leading-relaxed">
                        {item.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-32">
          <div className="container">
            <div className="relative overflow-hidden rounded-3xl bg-primary text-primary-foreground">
              <div className="absolute inset-0 bg-grid-pattern opacity-10" />
              <div className="relative px-8 py-16 md:px-16 md:py-24 text-center space-y-8">
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                  Ready to Get Started?
                </h2>
                <p className="text-xl md:text-2xl opacity-90 max-w-[700px] mx-auto leading-relaxed">
                  Join thousands of users sharing media with the world. 
                  Start uploading in minutes with our intuitive platform.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                  <Link href="/register">
                    <Button size="lg" variant="secondary" className="h-12 px-8 text-lg gap-2">
                      Create Free Account
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/feed">
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="h-12 px-8 text-lg bg-transparent border-primary-foreground/30 hover:bg-primary-foreground/10"
                    >
                      Explore Feed
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Media Types Section */}
        <section className="py-20 md:py-32">
          <div className="container">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                Media Type Deep Dive
              </h2>
              <p className="text-xl text-muted-foreground max-w-[700px] mx-auto">
                Each media type gets specialized handling for optimal performance and user experience.
              </p>
            </div>
            
            {/* Images Section */}
            <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
              <div className="order-2 lg:order-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                    <ImageIcon className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold">Image Processing</h3>
                </div>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Images are automatically optimized for web delivery while maintaining visual quality. Our system generates multiple sizes for responsive displays and creates thumbnails for fast gallery loading.
                </p>
                <div className="space-y-3">
                  {[
                    'Automatic format conversion (WEBP, AVIF)',
                    'Responsive image generation (thumbnails, medium, large)',
                    'EXIF data stripping for privacy',
                    'Color profile normalization',
                    'Watermarking support',
                    'Face detection for smart cropping',
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="aspect-video rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 border p-8 flex items-center justify-center">
                  <div className="text-center">
                    <ImageIcon className="h-20 w-20 text-blue-500 mx-auto mb-4" />
                    <div className="font-semibold">JPG • PNG • GIF • WEBP</div>
                    <div className="text-sm text-muted-foreground mt-2">Up to 50MB per file</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Videos Section */}
            <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
              <div>
                <div className="aspect-video rounded-2xl bg-gradient-to-br from-purple-500/10 to-purple-500/5 border p-8 flex items-center justify-center">
                  <div className="text-center">
                    <Film className="h-20 w-20 text-purple-500 mx-auto mb-4" />
                    <div className="font-semibold">MP4 • WEBM • MOV</div>
                    <div className="text-sm text-muted-foreground mt-2">Up to 5GB per file</div>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                    <Film className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold">Video Streaming Engine</h3>
                </div>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Videos are transcoded into multiple quality levels using FFmpeg. Our HLS adaptive bitrate streaming delivers the best possible quality based on network conditions.
                </p>
                <div className="space-y-3">
                  {[
                    'HLS adaptive bitrate streaming',
                    'Multiple quality renditions (360p, 480p, 720p, 1080p, 4K)',
                    'Automatic thumbnail generation',
                    'Video preview seeking',
                    'Closed caption support',
                    'Quality selector UI',
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Documents Section */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center">
                    <FileText className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold">Document Viewer</h3>
                </div>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Documents are processed for instant in-browser viewing. No downloads required - viewers can read PDFs, view spreadsheets, and see presentations directly.
                </p>
                <div className="space-y-3">
                  {[
                    'In-browser PDF rendering with react-pdf',
                    'DOCX content extraction and preview',
                    'PPTX slide viewer',
                    'Excel spreadsheet grid view',
                    'Text file syntax highlighting',
                    'Download original option',
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="aspect-video rounded-2xl bg-gradient-to-br from-green-500/10 to-green-500/5 border p-8 flex items-center justify-center">
                  <div className="text-center">
                    <FileText className="h-20 w-20 text-green-500 mx-auto mb-4" />
                    <div className="font-semibold">PDF • DOCX • PPTX • XLSX</div>
                    <div className="text-sm text-muted-foreground mt-2">Up to 500MB per file</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Performance Testing Section */}
        <section className="py-20 md:py-32 bg-muted/30">
          <div className="container">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                Performance Benchmarking
              </h2>
              <p className="text-xl text-muted-foreground max-w-[700px] mx-auto">
                Built to test and demonstrate DigitalOcean Spaces performance under real-world conditions.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {[
                {
                  icon: ArrowUpCircle,
                  title: 'Upload Speed Tests',
                  description: 'Measure upload speeds across file sizes from 500KB to 500MB. Test multipart uploads and concurrent uploads.',
                  color: 'bg-blue-500/10 text-blue-500',
                },
                {
                  icon: ArrowDownCircle,
                  title: 'Download Speed Tests',
                  description: 'Benchmark download speeds with CDN vs non-CDN paths. Test cold cache and warm cache scenarios.',
                  color: 'bg-green-500/10 text-green-500',
                },
                {
                  icon: Play,
                  title: 'Streaming Latency',
                  description: 'Measure time-to-first-frame, rebuffer ratios, and segment download latency for video streaming.',
                  color: 'bg-purple-500/10 text-purple-500',
                },
                {
                  icon: HardDrive,
                  title: 'Large File Handling',
                  description: 'Test 500MB+ file downloads with HTTP Range resume support. Validate transfer reliability.',
                  color: 'bg-orange-500/10 text-orange-500',
                },
                {
                  icon: Users,
                  title: 'Concurrency Tests',
                  description: 'Simulate 10-500+ concurrent users with mixed workloads (streams, downloads, uploads).',
                  color: 'bg-cyan-500/10 text-cyan-500',
                },
                {
                  icon: BarChart3,
                  title: 'CDN Impact Analysis',
                  description: 'Compare origin-only vs CDN-enabled performance. Measure cache hit ratios and P95 latencies.',
                  color: 'bg-indigo-500/10 text-indigo-500',
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <Card key={item.title}>
                    <CardHeader>
                      <div className={`h-12 w-12 rounded-xl ${item.color} flex items-center justify-center mb-4`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                      <CardDescription className="leading-relaxed">
                        {item.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>

            <div className="rounded-2xl border bg-background p-8">
              <h3 className="text-xl font-semibold mb-6 text-center">Test Metrics Captured</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Throughput (Mbps)', value: 'Real-time' },
                  { label: 'TTFB', value: '< 100ms' },
                  { label: 'TTFF (Video)', value: '< 2s' },
                  { label: 'Rebuffer Ratio', value: '< 1%' },
                  { label: 'P95 Latency', value: 'Measured' },
                  { label: 'Success Rate', value: '99.9%' },
                  { label: 'Cache Hit Ratio', value: 'Tracked' },
                  { label: 'Error Rate', value: '< 0.1%' },
                ].map((metric) => (
                  <div key={metric.label} className="text-center p-4 rounded-xl bg-muted/50">
                    <div className="text-2xl font-bold text-primary">{metric.value}</div>
                    <div className="text-sm text-muted-foreground">{metric.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Developer API Section */}
        <section className="py-20 md:py-32">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                      <Code className="h-6 w-6" />
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                      Developer First API
                    </h2>
                  </div>
                  <p className="text-xl text-muted-foreground leading-relaxed">
                    Integrate media handling into your applications with our comprehensive REST API. 
                    Build custom workflows with full control over uploads, processing, and delivery.
                  </p>
                </div>
                <div className="space-y-4">
                  {[
                    {
                      title: 'Presigned URLs',
                      description: 'Generate secure upload URLs for direct browser-to-storage transfers.',
                    },
                    {
                      title: 'Webhooks',
                      description: 'Receive notifications for upload completion, processing status, and errors.',
                    },
                    {
                      title: 'RESTful Design',
                      description: 'Clean, predictable endpoints following REST conventions with JSON responses.',
                    },
                    {
                      title: 'TypeScript SDK',
                      description: 'Full type definitions for type-safe integration in Node.js and browser.',
                    },
                  ].map((item) => (
                    <div key={item.title} className="flex gap-4">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="rounded-2xl bg-muted border p-6 font-mono text-sm overflow-hidden">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-3 w-3 rounded-full bg-red-500" />
                    <div className="h-3 w-3 rounded-full bg-yellow-500" />
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                    <span className="ml-2 text-muted-foreground text-xs">API Example</span>
                  </div>
                  <div className="space-y-2 text-muted-foreground">
                    <div><span className="text-purple-400">POST</span> /uploads/presigned</div>
                    <div className="text-green-400">{'{'} </div>
                    <div className="pl-4">"filename": "video.mp4",</div>
                    <div className="pl-4">"contentType": "video/mp4",</div>
                    <div className="pl-4">"size": 524288000</div>
                    <div className="text-green-400">{'}'}</div>
                    <div className="mt-4 text-blue-400">// Response</div>
                    <div className="text-green-400">{'{'}</div>
                    <div className="pl-4">"uploadUrl": "https://...",</div>
                    <div className="pl-4">"mediaId": "uuid",</div>
                    <div className="pl-4">"expiresIn": 3600</div>
                    <div className="text-green-400">{'}'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Industry Solutions Section */}
        <section className="py-20 md:py-32 bg-muted/30">
          <div className="container">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                Industry Solutions
              </h2>
              <p className="text-xl text-muted-foreground max-w-[700px] mx-auto">
                Tailored solutions for different industries and use cases.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Building2,
                  title: 'Enterprise',
                  description: 'Secure document management, internal training videos, and corporate communications.',
                  features: ['Private workspaces', 'SSO integration', 'Audit logs', 'Compliance'],
                },
                {
                  icon: GraduationCap,
                  title: 'Education',
                  description: 'Course content delivery, lecture recordings, and student assignment submissions.',
                  features: ['LMS integration', 'Gradebook sync', 'Quiz support', 'Discussion forums'],
                },
                {
                  icon: ShoppingBag,
                  title: 'E-commerce',
                  description: 'Product galleries, marketing videos, and customer testimonials.',
                  features: ['Catalog sync', '360° views', 'AR preview', 'Inventory alerts'],
                },
                {
                  icon: Music,
                  title: 'Entertainment',
                  description: 'Music streaming, video on demand, and podcast hosting.',
                  features: ['Playlist curation', 'Analytics', 'Monetization', 'Social sharing'],
                },
                {
                  icon: Gamepad2,
                  title: 'Gaming',
                  description: 'Game trailers, streaming highlights, and community content.',
                  features: ['Clips editor', 'Tournament brackets', 'Leaderboards', 'Live streaming'],
                },
                {
                  icon: Stethoscope,
                  title: 'Healthcare',
                  description: 'Medical imaging, patient education, and telehealth content.',
                  features: ['HIPAA compliant', 'DICOM support', 'Telehealth integration', 'Access control'],
                },
                {
                  icon: Landmark,
                  title: 'Finance',
                  description: 'Financial reports, investor presentations, and compliance documentation.',
                  features: ['Encryption', 'Version control', 'E-signatures', 'Retention policies'],
                },
                {
                  icon: Briefcase,
                  title: 'Marketing',
                  description: 'Campaign assets, brand content, and social media integration.',
                  features: ['Brand templates', 'A/B testing', 'Campaign analytics', 'Social scheduling'],
                },
              ].map((solution) => {
                const Icon = solution.icon;
                return (
                  <Card key={solution.title} className="hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                        <Icon className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-xl">{solution.title}</CardTitle>
                      <CardDescription className="leading-relaxed">
                        {solution.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {solution.features.map((feature) => (
                          <span key={feature} className="px-2 py-1 rounded-md bg-muted text-xs font-medium">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Analytics Dashboard Section */}
        <section className="py-20 md:py-32">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div className="space-y-4">
                  <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                    Rich Analytics Dashboard
                  </h2>
                  <p className="text-xl text-muted-foreground leading-relaxed">
                    Understand your content performance with comprehensive analytics. 
                    Track views, engagement, bandwidth, and user behavior.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Total Views', value: '2.4M', icon: Eye },
                    { label: 'Engagement Rate', value: '12.8%', icon: Heart },
                    { label: 'Shares', value: '45.2K', icon: Share2 },
                    { label: 'Downloads', value: '128K', icon: Download },
                  ].map((stat) => {
                    const Icon = stat.icon;
                    return (
                      <div key={stat.label} className="p-4 rounded-xl bg-muted/50">
                        <div className="flex items-center gap-2 mb-2">
                          <Icon className="h-4 w-4 text-primary" />
                          <span className="text-sm text-muted-foreground">{stat.label}</span>
                        </div>
                        <div className="text-2xl font-bold">{stat.value}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border p-8">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Content Performance</h3>
                    <span className="text-sm text-muted-foreground">Last 30 days</span>
                  </div>
                  <div className="space-y-3">
                    {[
                      { name: 'Product Demo.mp4', views: '45.2K', growth: '+12%' },
                      { name: 'Brand Guidelines.pdf', views: '12.8K', growth: '+8%' },
                      { name: 'Team Photo.jpg', views: '8.4K', growth: '+24%' },
                      { name: 'Tutorial Series', views: '6.2K', growth: '+15%' },
                    ].map((item) => (
                      <div key={item.name} className="flex items-center justify-between p-3 rounded-lg bg-background">
                        <div className="flex items-center gap-3">
                          <BarChart3 className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium truncate max-w-[150px]">{item.name}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-muted-foreground">{item.views}</span>
                          <span className="text-xs text-green-500 font-medium">{item.growth}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Collaboration Features Section */}
        <section className="py-20 md:py-32 bg-muted/30">
          <div className="container">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                Team Collaboration
              </h2>
              <p className="text-xl text-muted-foreground max-w-[700px] mx-auto">
                Work together seamlessly with powerful collaboration tools.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Users,
                  title: 'Team Workspaces',
                  description: 'Create shared folders and workspaces for teams. Control who can view, edit, or upload content.',
                  features: ['Role-based permissions', 'Team analytics', 'Shared libraries', 'Activity feed'],
                },
                {
                  icon: MessageSquare,
                  title: 'Comments & Feedback',
                  description: 'Leave time-stamped comments on any media. Tag team members and track resolution.',
                  features: ['Threaded comments', '@mentions', 'Resolved status', 'Email notifications'],
                },
                {
                  icon: Share2,
                  title: 'Easy Sharing',
                  description: 'Share content with anyone - internally or externally. Generate secure links with expiration.',
                  features: ['Link sharing', 'Password protection', 'Expiration dates', 'Download tracking'],
                },
              ].map((feature) => {
                const Icon = feature.icon;
                return (
                  <Card key={feature.title} className="hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <div className="h-14 w-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                        <Icon className="h-7 w-7" />
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                      <CardDescription className="text-base leading-relaxed">
                        {feature.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {feature.features.map((f) => (
                          <span key={f} className="px-3 py-1 rounded-full bg-muted text-sm">
                            {f}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Mobile Responsive Section */}
        <section className="py-20 md:py-32">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="order-2 lg:order-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <Smartphone className="h-6 w-6" />
                  </div>
                  <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                    Mobile First Design
                  </h2>
                </div>
                <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
                  Access your media anywhere, anytime. Our responsive design works perfectly on all devices.
                </p>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { icon: Smartphone, label: 'Mobile', active: true },
                    { icon: Tablet, label: 'Tablet', active: true },
                    { icon: Monitor, label: 'Desktop', active: true },
                    { icon: Monitor, label: 'Laptop', active: false },
                    { icon: Monitor, label: 'TV', active: false },
                    { icon: Cpu, label: 'Wearable', active: false },
                  ].map((device) => {
                    const Icon = device.icon;
                    return (
                      <div 
                        key={device.label} 
                        className={`p-4 rounded-xl text-center border-2 transition-all ${
                          device.active 
                            ? 'border-primary bg-primary/5' 
                            : 'border-muted bg-muted/30 opacity-50'
                        }`}
                      >
                        <Icon className={`h-8 w-8 mx-auto mb-2 ${device.active ? 'text-primary' : 'text-muted-foreground'}`} />
                        <span className="text-sm font-medium">{device.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="relative">
                  <div className="aspect-[4/5] max-w-sm mx-auto rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 border p-8 flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <Smartphone className="h-32 w-32 text-primary mx-auto" />
                      <div className="font-semibold">Responsive Interface</div>
                      <div className="text-sm text-muted-foreground">Works on any screen size</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-20 md:py-32 bg-muted/30">
          <div className="container">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                Simple, Transparent Pricing
              </h2>
              <p className="text-xl text-muted-foreground max-w-[700px] mx-auto">
                Choose the plan that fits your needs. Scale as you grow.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  title: 'Starter',
                  price: 'Free',
                  description: 'Perfect for individuals getting started',
                  features: [
                    '5GB Storage',
                    '10GB Bandwidth/month',
                    'Basic analytics',
                    'Community support',
                    'Standard upload speeds',
                    'Watermark on exports',
                  ],
                  cta: 'Get Started',
                  popular: false,
                },
                {
                  title: 'Professional',
                  price: '$29',
                  period: '/month',
                  description: 'For growing teams and businesses',
                  features: [
                    '100GB Storage',
                    '1TB Bandwidth/month',
                    'Advanced analytics',
                    'Priority support',
                    'Fast upload speeds',
                    'Custom branding',
                    'API access',
                    'No watermarks',
                  ],
                  cta: 'Start Free Trial',
                  popular: true,
                },
                {
                  title: 'Enterprise',
                  price: 'Custom',
                  description: 'For large organizations with custom needs',
                  features: [
                    'Unlimited Storage',
                    'Unlimited Bandwidth',
                    'Custom analytics',
                    'Dedicated support',
                    'Max upload speeds',
                    'White-label options',
                    'Custom integrations',
                    'SLA guarantee',
                    'SSO/SAML',
                  ],
                  cta: 'Contact Sales',
                  popular: false,
                },
              ].map((plan) => (
                <Card 
                  key={plan.title} 
                  className={`relative ${plan.popular ? 'border-primary shadow-lg scale-105' : ''}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                      Most Popular
                    </div>
                  )}
                  <CardHeader className="text-center">
                    <CardTitle className="text-xl">{plan.title}</CardTitle>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                    </div>
                    <CardDescription className="mt-2">{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-3 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full" variant={plan.popular ? 'default' : 'outline'}>
                      {plan.cta}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 md:py-32">
          <div className="container">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-muted-foreground max-w-[700px] mx-auto">
                Everything you need to know about our platform.
              </p>
            </div>
            <div className="max-w-3xl mx-auto space-y-4">
              {[
                {
                  q: 'How does the upload process work?',
                  a: 'We use direct-to-S3 uploads via presigned URLs. Your files go directly from your browser to DigitalOcean Spaces, bypassing our servers for maximum speed and security.',
                },
                {
                  q: 'What happens to my videos after upload?',
                  a: 'Videos are automatically queued for transcoding. Our system creates multiple quality versions (360p, 480p, 720p, 1080p) using HLS adaptive bitrate streaming for optimal playback on any connection.',
                },
                {
                  q: 'Can I control who sees my content?',
                  a: 'Yes! You can set content visibility to Public, Unlisted, or Private. For private content, you can share via secure signed URLs with expiration times.',
                },
                {
                  q: 'How is my content secured?',
                  a: 'We use JWT authentication, signed URLs for private access, file type validation (magic byte verification), CORS restrictions, and encrypted connections. Your data is also protected by DigitalOcean\'s infrastructure.',
                },
                {
                  q: 'What about large file support?',
                  a: 'Files over 5MB use multipart uploads for reliability. Videos up to 5GB and documents up to 500MB are supported. Large files can be resumed using HTTP Range requests.',
                },
                {
                  q: 'Is there an API for developers?',
                  a: 'Yes! Our REST API provides full control over uploads, media management, and content delivery. Generate presigned URLs, manage users, and integrate into your own applications.',
                },
                {
                  q: 'How does the CDN improve performance?',
                  a: 'Our CDN caches content at 140+ edge locations worldwide. This reduces latency, improves load times, and handles traffic spikes. You can compare CDN vs origin-only performance in our benchmarking tools.',
                },
                {
                  q: 'Can I use this for commercial purposes?',
                  a: 'Absolutely! Our platform is suitable for businesses, content creators, educators, and anyone needing reliable media hosting and streaming. Custom enterprise plans are available.',
                },
              ].map((faq, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-start gap-3">
                      <span className="text-primary">Q.</span>
                      {faq.q}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed pl-6">{faq.a}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 md:py-32 bg-muted/30">
          <div className="container">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                Trusted by Thousands
              </h2>
              <p className="text-xl text-muted-foreground max-w-[700px] mx-auto">
                See what our users have to say about their experience.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  quote: "The video streaming quality is incredible. Our course platform students can now watch lectures without buffering, even on slower connections.",
                  author: "Sarah Chen",
                  role: "Education Platform Founder",
                  avatar: "SC",
                },
                {
                  quote: "Direct-to-S3 uploads changed our workflow completely. We upload 4K video directly from set, no more server bottlenecks or timeouts.",
                  author: "Marcus Rodriguez",
                  role: "Film Production Company",
                  avatar: "MR",
                },
                {
                  quote: "The API is a developer's dream. We integrated media hosting into our app in just two days. The documentation is excellent.",
                  author: "Emily Watson",
                  role: "SaaS Startup CTO",
                  avatar: "EW",
                },
              ].map((testimonial, index) => (
                <Card key={index} className="hover:shadow-lg transition-all">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-muted-foreground leading-relaxed">"{testimonial.quote}"</p>
                      <div className="flex items-center gap-3 pt-4">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center font-semibold">
                          {testimonial.avatar}
                        </div>
                        <div>
                          <div className="font-semibold">{testimonial.author}</div>
                          <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Additional CTA Section */}
        <section className="py-20 md:py-32">
          <div className="container">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground">
              <div className="absolute inset-0 bg-grid-pattern opacity-10" />
              <div className="relative px-8 py-16 md:px-16 md:py-24 text-center space-y-8">
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                  Start Your Free Trial Today
                </h2>
                <p className="text-xl md:text-2xl opacity-90 max-w-[700px] mx-auto leading-relaxed">
                  No credit card required. Get 14 days of Professional features free. 
                  Explore all capabilities and see the difference in your media delivery.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                  <Link href="/register">
                    <Button size="lg" variant="secondary" className="h-12 px-8 text-lg gap-2">
                      Create Free Account
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="h-12 px-8 text-lg bg-transparent border-primary-foreground/30 hover:bg-primary-foreground/10"
                  >
                    Contact Sales
                  </Button>
                </div>
                <div className="flex items-center justify-center gap-8 pt-8 text-sm opacity-80">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    14-day free trial
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    No credit card
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Cancel anytime
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-12 bg-muted/30">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <Link href="/" className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold">M</span>
                </div>
                <span className="font-bold text-xl">MediaShare</span>
              </Link>
              <p className="text-sm text-muted-foreground leading-relaxed">
                A full-stack media sharing and streaming platform powered by DigitalOcean Spaces.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/feed" className="hover:text-foreground">Feed</Link></li>
                <li><Link href="/images" className="hover:text-foreground">Images</Link></li>
                <li><Link href="/videos" className="hover:text-foreground">Videos</Link></li>
                <li><Link href="/documents" className="hover:text-foreground">Documents</Link></li>
                <li><Link href="/upload" className="hover:text-foreground">Upload</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Documentation</a></li>
                <li><a href="#" className="hover:text-foreground">API Reference</a></li>
                <li><a href="#" className="hover:text-foreground">Status</a></li>
                <li><a href="#" className="hover:text-foreground">Changelog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-foreground">Terms of Service</a></li>
                <li><a href="#" className="hover:text-foreground">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
            <p>Built with Next.js, Fastify, PostgreSQL, Redis, and DigitalOcean Spaces.</p>
            <p className="mt-2">© {new Date().getFullYear()} MediaShare. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
