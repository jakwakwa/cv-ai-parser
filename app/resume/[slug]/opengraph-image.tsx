import { ImageResponse } from 'next/og';
import { ResumeDatabase } from '@/lib/db';
import type { Resume } from '@/lib/types';

// Image metadata
export const alt = 'Resume Preview';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

// Default image generation (fallback)
async function generateDefaultImage() {
  return new ImageResponse(
    <div
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Inter, system-ui, sans-serif',
        color: 'white',
      }}
    >
      <div
        style={{
          fontSize: 72,
          fontWeight: 'bold',
          marginBottom: 20,
          textAlign: 'center',
        }}
      >
        CV AI Parser
      </div>
      <div
        style={{
          fontSize: 28,
          opacity: 0.9,
          textAlign: 'center',
          maxWidth: 800,
        }}
      >
        Professional Resume Builder & AI Parser
      </div>
    </div>,
    {
      ...size,
    }
  );
}

// Dynamic image generation for resume
export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  try {
    const { slug } = await params;

    // Fetch resume data
    const resume: Resume | null = await ResumeDatabase.getPublicResume(slug);

    if (!resume || !resume.parsedData) {
      return generateDefaultImage();
    }

    const { parsedData } = resume;
    const name = parsedData.name || 'Professional Resume';
    const title = parsedData.title || 'Career Professional';
    const location = parsedData.contact?.location || '';
    const experienceCount = parsedData.experience?.length || 0;

    // Handle skills count for both legacy array and enhanced object formats
    const skillsCount = (() => {
      if (!parsedData.skills) return 0;
      return parsedData.skills.length;
    })();

    // Get primary color from custom colors or use default
    const primaryColor = parsedData.customColors?.primary || '#3b82f6';
    const secondaryColor = parsedData.customColors?.accent || '#1e40af';

    // Create a professional gradient based on custom colors
    const gradientStart = primaryColor;
    const gradientEnd = secondaryColor;

    return new ImageResponse(
      <div
        style={{
          background: `linear-gradient(135deg, ${gradientStart} 0%, ${gradientEnd} 100%)`,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          fontFamily: 'Inter, system-ui, sans-serif',
          color: 'white',
          padding: 60,
          position: 'relative',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            width: '100%',
          }}
        >
          <div
            style={{
              fontSize: 24,
              fontWeight: '600',
              opacity: 0.9,
              marginBottom: 16,
              letterSpacing: '0.05em',
            }}
          >
            CV AI PARSER
          </div>
          <div
            style={{
              fontSize: 56,
              fontWeight: 'bold',
              marginBottom: 12,
              lineHeight: 1.1,
              maxWidth: '80%',
            }}
          >
            {name}
          </div>
          <div
            style={{
              fontSize: 32,
              fontWeight: '500',
              opacity: 0.95,
              marginBottom: 8,
              maxWidth: '80%',
            }}
          >
            {title}
          </div>
          {location && (
            <div
              style={{
                fontSize: 24,
                opacity: 0.8,
                marginBottom: 32,
              }}
            >
              📍 {location}
            </div>
          )}
        </div>

        {/* Stats */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 40,
            marginBottom: 20,
          }}
        >
          {experienceCount > 0 && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: 16,
                padding: '24px 32px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <div style={{ fontSize: 36, fontWeight: 'bold' }}>
                {experienceCount}
              </div>
              <div style={{ fontSize: 18, opacity: 0.9 }}>
                Experience{experienceCount !== 1 ? 's' : ''}
              </div>
            </div>
          )}

          {skillsCount > 0 && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                borderRadius: 16,
                padding: '24px 32px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <div style={{ fontSize: 36, fontWeight: 'bold' }}>
                {skillsCount}
              </div>
              <div style={{ fontSize: 18, opacity: 0.9 }}>
                Skill{skillsCount !== 1 ? 's' : ''}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            fontSize: 20,
            opacity: 0.8,
          }}
        >
          <div>Professional Resume • AI Generated</div>
          <div>airesumegen.com</div>
        </div>

        {/* Decorative elements */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: 300,
            height: 300,
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            transform: 'translate(100px, -100px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: 200,
            height: 200,
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '50%',
            transform: 'translate(-50px, 50px)',
          }}
        />
      </div>,
      {
        ...size,
      }
    );
  } catch (error) {
    console.error('Error generating Open Graph image:', error);
    return generateDefaultImage();
  }
}
