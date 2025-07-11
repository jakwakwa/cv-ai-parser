import { ImageResponse } from 'next/og';

// Image metadata
export const alt = 'CV AI Parser - Professional Resume Builder & AI Parser';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        background:
          'linear-gradient(135deg, #3b82f6 0%, #1e40af 50%, #1e3a8a 100%)',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Inter, system-ui, sans-serif',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background decorative elements */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: 400,
          height: 400,
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          transform: 'translate(150px, -150px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: 300,
          height: 300,
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '50%',
          transform: 'translate(-100px, 100px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '50%',
          right: '20%',
          width: 150,
          height: 150,
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '50%',
        }}
      />

      {/* Main content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          zIndex: 10,
          maxWidth: 900,
          padding: '0 40px',
        }}
      >
        {/* Logo/Brand */}
        <div
          style={{
            fontSize: 80,
            fontWeight: 'bold',
            marginBottom: 24,
            background: 'linear-gradient(45deg, #ffffff, #e0e7ff)',
            backgroundClip: 'text',
            color: 'transparent',
            lineHeight: 1,
          }}
        >
          CV AI Parser
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 36,
            fontWeight: '500',
            marginBottom: 32,
            opacity: 0.95,
            lineHeight: 1.2,
          }}
        >
          Transform Your Resume with AI
        </div>

        {/* Features */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 48,
            marginBottom: 40,
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: 20,
              padding: '24px 32px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              minWidth: 180,
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 8 }}>🤖</div>
            <div style={{ fontSize: 20, fontWeight: '600' }}>AI Powered</div>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: 20,
              padding: '24px 32px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              minWidth: 180,
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 8 }}>🎨</div>
            <div style={{ fontSize: 20, fontWeight: '600' }}>Customizable</div>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: 20,
              padding: '24px 32px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              minWidth: 180,
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 8 }}>📄</div>
            <div style={{ fontSize: 20, fontWeight: '600' }}>PDF Export</div>
          </div>
        </div>

        {/* Call to action */}
        <div
          style={{
            fontSize: 24,
            opacity: 0.9,
            fontWeight: '400',
          }}
        >
          Upload • Parse • Customize • Share
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          position: 'absolute',
          bottom: 40,
          right: 60,
          fontSize: 18,
          opacity: 0.7,
          fontWeight: '500',
        }}
      >
        airesumegen.com
      </div>
    </div>,
    {
      ...size,
    }
  );
}
