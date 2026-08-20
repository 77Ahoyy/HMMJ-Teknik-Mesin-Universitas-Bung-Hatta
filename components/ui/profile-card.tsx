import React from 'react';

export interface ProfileCardProps {
  name?: string;
  photo?: string;
  avatar?: string;
  username?: string;
  role?: string;
  actionText?: string;
  onAction?: () => void;
  href?: string;
}

export const Component: React.FC<ProfileCardProps> = ({
  name = "John Doe",
  photo = "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg",
  avatar,
  username = "@johndoe",
  role = "Pengurus",
  actionText = "+ Add member",
  onAction,
  href,
}) => {
  const avatarImg = avatar || photo;

  return (
    <>
      <style>
        {`
          .hover-scale {
            transition: transform 700ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 500ms ease;
          }
          
          .hover-scale:hover {
            transform: translateY(-6px) scale(1.02);
            box-shadow: 0 16px 36px rgba(0, 0, 0, 0.4), 0 0 20px rgba(201, 168, 76, 0.25) !important;
          }
          
          .image-scale {
            transition: transform 700ms cubic-bezier(0.16, 1, 0.3, 1), filter 500ms ease;
          }
          
          .image-container:hover .image-scale {
            transform: scale(1.06);
          }
          
          .hover-translate {
            transition: transform 500ms ease-out;
          }
          
          .hover-translate:hover {
            transform: translateX(4px);
          }
          
          .hover-scale-sm {
            transition: transform 500ms ease-out;
          }
          
          .hover-scale-sm:hover {
            transform: scale(1.15);
          }
        `}
      </style>
      
      <div className="w-full">
        <div 
          style={{
            background: 'var(--color-surface, #0F2033)',
            border: '1px solid var(--color-border-2, rgba(255,255,255,0.08))',
            borderRadius: '24px',
            overflow: 'hidden',
          }}
          className="hover-scale shadow-lg transition-all"
        >
          <div className="relative overflow-hidden image-container" style={{ position: 'relative', overflow: 'hidden', height: '240px' }}>
            <img 
              src={photo}
              alt={name} 
              className="w-full h-full object-cover image-scale"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {/* Top gradient badge */}
            <div 
              style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                right: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                zIndex: 2,
              }}
            >
              <h2 
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  textShadow: '0 2px 8px rgba(0,0,0,0.8)',
                  lineHeight: 1.2,
                }}
              >
                {name}
              </h2>
              {role && (
                <span 
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    padding: '4px 10px',
                    borderRadius: '9999px',
                    background: 'rgba(10, 22, 40, 0.75)',
                    color: 'var(--color-primary, #C9A84C)',
                    border: '1px solid rgba(201, 168, 76, 0.4)',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  {role}
                </span>
              )}
            </div>
            {/* Bottom Gradient overlay */}
            <div 
              style={{
                position: 'absolute',
                insetInline: 0,
                bottom: 0,
                height: '100px',
                background: 'linear-gradient(to top, rgba(15, 32, 51, 1) 0%, rgba(15, 32, 51, 0.4) 60%, transparent 100%)',
                pointerEvents: 'none',
              }}
            />
          </div>
          
          <div 
            style={{
              padding: '1rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              borderTop: '1px solid var(--color-border-2, rgba(255,255,255,0.08))',
              background: 'var(--color-surface-2, #162840)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div 
                className="hover-scale-sm"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  flexShrink: 0,
                  border: '2px solid var(--color-primary, #C9A84C)',
                }}
              >
                <img 
                  src={avatarImg}
                  alt={name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div className="hover-translate">
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text, #E8EDF2)' }}>
                  {username}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted, #6B8AAB)' }}>
                  HMMJ 2026/2027
                </div>
              </div>
            </div>

            {href ? (
              <a 
                href={href}
                style={{
                  background: 'linear-gradient(135deg, var(--color-primary, #C9A84C), var(--color-gold-dark, #A07830))',
                  color: '#0A1628',
                  borderRadius: '10px',
                  padding: '8px 14px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 2px 10px rgba(201, 168, 76, 0.25)',
                  transition: 'all 300ms ease',
                }}
                className="hover-scale-sm"
              >
                {actionText}
              </a>
            ) : (
              <button 
                onClick={onAction}
                style={{
                  background: 'linear-gradient(135deg, var(--color-primary, #C9A84C), var(--color-gold-dark, #A07830))',
                  color: '#0A1628',
                  borderRadius: '10px',
                  padding: '8px 14px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 2px 10px rgba(201, 168, 76, 0.25)',
                  transition: 'all 300ms ease',
                }}
                className="hover-scale-sm"
              >
                {actionText}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Component;
