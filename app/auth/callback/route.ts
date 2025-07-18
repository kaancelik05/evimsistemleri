import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const origin = requestUrl.origin

  // Return a simple HTML page that will handle the hash parameters on client side
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Giriş yapılıyor...</title>
      <style>
        body { 
          font-family: system-ui, -apple-system, sans-serif; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          height: 100vh; 
          margin: 0;
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
        }
        .loading {
          text-align: center;
          color: #0369a1;
        }
        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #e0f2fe;
          border-top: 4px solid #0369a1;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 16px;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    </head>
    <body>
      <div class="loading">
        <div class="spinner"></div>
        <h2>Giriş yapılıyor...</h2>
        <p>Lütfen bekleyin, anasayfaya yönlendiriliyorsunuz.</p>
      </div>
      
      <script>
        // Get hash parameters from URL
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');
        const expiresAt = params.get('expires_at');
        const providerToken = params.get('provider_token');
        
        if (accessToken && refreshToken) {
          try {
            // Decode JWT token to get user info (UTF-8 compatible)
            // Note: We inline the decode function here since we can't import from client-side utils
            const base64Payload = accessToken.split('.')[1];
            const binaryString = atob(base64Payload);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
              bytes[i] = binaryString.charCodeAt(i);
            }
            const payload = JSON.parse(new TextDecoder('utf-8').decode(bytes));
            
            // Store tokens in localStorage
            localStorage.setItem('supabase_access_token', accessToken);
            localStorage.setItem('supabase_refresh_token', refreshToken);
            localStorage.setItem('user_logged_in', 'true');
            localStorage.setItem('login_timestamp', new Date().toISOString());
            
            // Store user info from JWT payload
            if (payload.email) {
              localStorage.setItem('user_email', payload.email);
            }
            if (payload.user_metadata && payload.user_metadata.full_name) {
              localStorage.setItem('user_name', payload.user_metadata.full_name);
            } else if (payload.user_metadata && payload.user_metadata.name) {
              localStorage.setItem('user_name', payload.user_metadata.name);
            }
            
            if (expiresAt) {
              localStorage.setItem('token_expires_at', expiresAt);
            }
            
            // Redirect to home page with success flag
            window.location.href = '/?login=success';
          } catch (error) {
            console.error('Error decoding JWT token:', error);
            // Fallback - still store tokens but without user info
            localStorage.setItem('supabase_access_token', accessToken);
            localStorage.setItem('supabase_refresh_token', refreshToken);
            localStorage.setItem('user_logged_in', 'true');
            localStorage.setItem('login_timestamp', new Date().toISOString());
            
            window.location.href = '/?login=success';
          }
        } else {
          // No tokens found, redirect to login with error
          window.location.href = '/login?error=auth_failed';
        }
      </script>
    </body>
    </html>
  `;

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
} 