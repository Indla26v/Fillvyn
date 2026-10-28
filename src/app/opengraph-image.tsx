import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Fillvyn: fill Google Forms and Microsoft Forms from your resume';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  const fields = [
    ['Full Name', 'Alex Morgan'],
    ['Notice Period (Days)', '0'],
    ['Expected CTC (LPA)', '16'],
    ['Primary Tech Stack', 'Java 21 & Spring Boot 3'],
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          padding: 64,
          background: 'linear-gradient(135deg, #eef2ff 0%, #f5f3ff 50%, #e0f2fe 100%)',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: 620 }}>
          <div style={{ display: 'flex', fontSize: 32, fontWeight: 800, color: '#4f46e5' }}>Fillvyn</div>
          <div style={{ display: 'flex', fontSize: 60, fontWeight: 800, color: '#0f172a', lineHeight: 1.1, marginTop: 20 }}>
            Fill job application forms in seconds
          </div>
          <div style={{ display: 'flex', fontSize: 28, color: '#475569', marginTop: 24, lineHeight: 1.35 }}>
            Google Forms & Microsoft Forms, answered from your resume and GitHub projects.
          </div>
          <div
            style={{
              display: 'flex',
              marginTop: 36,
              padding: '14px 28px',
              borderRadius: 999,
              background: '#4f46e5',
              color: 'white',
              fontSize: 26,
              fontWeight: 700,
              alignSelf: 'flex-start',
            }}
          >
            Free Chrome extension
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginLeft: 48,
            width: 420,
            padding: 28,
            borderRadius: 28,
            background: 'white',
            border: '2px solid #ddd6fe',
            boxShadow: '0 20px 50px rgba(79, 70, 229, 0.15)',
            alignSelf: 'center',
          }}
        >
          <div style={{ display: 'flex', height: 10, borderRadius: 999, background: '#673ab7', marginBottom: 20 }} />
          {fields.map(([label, value]) => (
            <div key={label} style={{ display: 'flex', flexDirection: 'column', marginBottom: 18 }}>
              <div style={{ display: 'flex', fontSize: 18, color: '#334155', fontWeight: 600 }}>{label}</div>
              <div
                style={{
                  display: 'flex',
                  fontSize: 20,
                  color: '#4338ca',
                  borderBottom: '2px solid #a5b4fc',
                  paddingBottom: 6,
                  marginTop: 6,
                }}
              >
                {value}
              </div>
            </div>
          ))}
          <div style={{ display: 'flex', fontSize: 18, color: '#059669', fontWeight: 700 }}>✓ Filled by Fillvyn</div>
        </div>
      </div>
    ),
    size
  );
}
