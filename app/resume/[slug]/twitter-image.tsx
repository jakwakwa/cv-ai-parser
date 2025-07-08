import { ImageResponse } from 'next/og';
import { ResumeDatabase } from '@/lib/database';
import { createClient } from '@/lib/supabase/server';
import type { Resume } from '@/lib/types';

// Image metadata
export const alt = 'Resume Preview';
export const size = {
  width: 1200,
  height: 1200,
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
          fontSize: 64,
          fontWeight: 'bold',
          marginBottom: 20,
          textAlign: 'center',
        }}
      >
        CV AI Parser
      </div>
      <div
        style={{
          fontSize: 24,
          opacity: 0.9,
          textAlign: 'center',
          maxWidth: 600,
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
    const supabase = await createClient();
    const resume: Resume | null = await ResumeDatabase.getPublicResume(
      supabase,
      slug
    );

    if (!resume || !resume.parsed_data) {
      return generateDefaultImage();
    }

    const { parsed_data } = resume;
    const name = parsed_data.name || 'Professional Resume';
    const title = parsed_data.title || 'Career Professional';
    const location = parsed_data.contact?.location || '';
    const experienceCount = Array.isArray(parsed_data.experience)
      ? parsed_data.experience.length
      : 0;
    const skillsCount =
      typeof parsed_data.skills === 'object' &&
      parsed_data.skills !== null &&
      Array.isArray(parsed_data.skills)
        ? parsed_data.skills.length
        : 0;

    // Get primary color from custom colors or use default
    const primaryColor = parsed_data.customColors?.primary || '#3b82f6';
    const secondaryColor = parsed_data.customColors?.accent || '#1e40af';

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
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Inter, system-ui, sans-serif',
          color: 'white',
          padding: 80,
          position: 'relative',
          textAlign: 'center',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            marginBottom: 40,
          }}
        >
          <div
            style={{
              fontSize: 20,
              fontWeight: '600',
              opacity: 0.9,
              marginBottom: 20,
              letterSpacing: '0.05em',
            }}
          >
            CV AI PARSER
          </div>
          <div
            style={{
              fontSize: 48,
              fontWeight: 'bold',
              marginBottom: 16,
              lineHeight: 1.1,
              textAlign: 'center',
              maxWidth: '90%',
            }}
          >
            {name}
          </div>
          <div
            style={{
              fontSize: 28,
              fontWeight: '500',
              opacity: 0.95,
              marginBottom: 12,
              textAlign: 'center',
              maxWidth: '90%',
            }}
          >
            {title}
          </div>
          {location && (
            <div
              style={{
                fontSize: 20,
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
            flexDirection: 'column',
            gap: 20,
            marginBottom: 40,
            alignItems: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: 24,
              justifyContent: 'center',
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
                  padding: '20px 24px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  minWidth: 120,
                }}
              >
                <div style={{ fontSize: 28, fontWeight: 'bold' }}>
                  {experienceCount}
                </div>
                <div style={{ fontSize: 14, opacity: 0.9 }}>
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
                  padding: '20px 24px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  minWidth: 120,
                }}
              >
                <div style={{ fontSize: 28, fontWeight: 'bold' }}>
                  {skillsCount}
                </div>
                <div style={{ fontSize: 14, opacity: 0.9 }}>
                  Skill{skillsCount !== 1 ? 's' : ''}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            fontSize: 16,
            opacity: 0.8,
            textAlign: 'center',
          }}
        >
          Professional Resume • AI Generated
        </div>

        {/* Decorative elements */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: 200,
            height: 200,
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            transform: 'translate(75px, -75px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: 150,
            height: 150,
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
    console.error('Error generating Twitter image:', error);
    return generateDefaultImage();
  }
}
