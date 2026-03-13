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
  Photo,
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
  RefreshCw,
  AlertTriangle,
  Check,
  ArrowUpCircle,
  ArrowDownCircle,
  Link2,
  ExternalLink,
  Settings,
  Cpu,
  Building2,
  GraduationCap,
  ShoppingBag,
  Music,
  Gamepad2,
  Briefcase,
  Stethoscope,
  Landmark,
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
