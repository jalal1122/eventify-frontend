import { Metadata } from 'next';
import { type EventDetailResponse } from '@/types/event';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || "http://localhost:5000";

type Props = {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    const res = await fetch(`${API_BASE_URL}/api/events/${resolvedParams.id}`, { cache: 'no-store' });
    if (!res.ok) return { title: 'Event Not Found' };
    
    const data: EventDetailResponse = await res.json();
    const event = data.event;

    if (!event) return { title: 'Event Not Found' };

    const title = event.title;
    const description = event.description ? event.description.substring(0, 160) : 'Join this exciting event on Nextt Event.';
    const imageUrl = event.bannerUrl || event.cardImageUrl || '';

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: imageUrl ? [imageUrl] : [],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: imageUrl ? [imageUrl] : [],
      },
    };
  } catch (error) {
    return {
      title: 'Event Details',
    };
  }
}

export default function EventDetailLayout({ children }: Props) {
  return <>{children}</>;
}
