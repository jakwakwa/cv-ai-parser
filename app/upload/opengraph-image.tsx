import { ImageResponse } from 'next/og';

// Image metadata
export const alt = 'Upload Resume - CV AI Parser';
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
          'linear-gradient(135deg, #7c3aed 0%, #5b21b6 50%, #4c1d95 100%)',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontFamily: 'Inter, system-ui, sans-serif',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        padding: 60,
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

      {/* Left content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          maxWidth: 600,
          zIndex: 10,
        }}
      >
        {/* Brand */}
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

        {/* Title */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 'bold',
            marginBottom: 24,
            lineHeight: 1,
          }}
        >
          Upload Resume
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: 28,
            opacity: 0.95,
            marginBottom: 32,
            lineHeight: 1.3,
          }}
        >
          Transform your document into a stunning online resume with AI
        </div>

        {/* Features */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: 20,
              opacity: 0.9,
            }}
          >
            <span style={{ marginRight: 12 }}>📄</span>
            PDF, DOC, TXT support
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: 20,
              opacity: 0.9,
            }}
          >
            <span style={{ marginRight: 12 }}>🤖</span>
            AI-powered parsing
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: 20,
              opacity: 0.9,
            }}
          >
            <span style={{ marginRight: 12 }}>🎨</span>
            Instant customization
          </div>
        </div>
      </div>

      {/* Right visual */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 32,
          zIndex: 10,
        }}
      >
        {/* Upload visualization */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 20,
          }}
        >
          {/* Upload box */}
          <div
            style={{
              width: 200,
              height: 150,
              background: 'rgba(255, 255, 255, 0.15)',
              borderRadius: 16,
              border: '3px dashed rgba(255, 255, 255, 0.4)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 8 }}>📁</div>
            <div style={{ fontSize: 16, opacity: 0.9, textAlign: 'center' }}>
              Drop your resume
            </div>
          </div>

          {/* Arrow */}
          <div
            style={{
              fontSize: 32,
              opacity: 0.8,
              transform: 'rotate(90deg)',
            }}
          >
            ⬇
          </div>

          {/* Result visualization */}
          <div
            style={{
              width: 180,
              height: 120,
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: 12,
              border: '2px solid rgba(255, 255, 255, 0.3)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            <div style={{ fontSize: 36, marginBottom: 8 }}>✨</div>
            <div style={{ fontSize: 14, opacity: 0.9, textAlign: 'center' }}>
              Beautiful Resume
            </div>
          </div>
        </div>

        {/* Stats */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 20,
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: 12,
              padding: '16px 20px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              minWidth: 80,
            }}
          >
            <div style={{ fontSize: 24, fontWeight: 'bold' }}>98%</div>
            <div style={{ fontSize: 12, opacity: 0.9 }}>Accuracy</div>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: 12,
              padding: '16px 20px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              minWidth: 80,
            }}
          >
            <div style={{ fontSize: 24, fontWeight: 'bold' }}>&lt;10s</div>
            <div style={{ fontSize: 12, opacity: 0.9 }}>Processing</div>
          </div>
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
