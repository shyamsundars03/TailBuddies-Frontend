import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';


// for public
const AUTH_ROUTES = ['/signin', '/signup', '/forgot-password', '/reset-password', '/admin/signin'];







// for OTP things like purpose
const ACTION_ROUTES = ['/verify-otp', '/reset-password'];




const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-access-secret-key');





export async function proxy(request: NextRequest) {



  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;
  const actionPending = request.cookies.get('auth_action_pending')?.value;


//1. finding pending actions

  if (ACTION_ROUTES.includes(pathname)) {
    if (actionPending === 'true') {
      return NextResponse.next();
    }


    // If no action pending, redirect to signin


    return NextResponse.redirect(new URL('/signin', request.url));
  }




  // 2. Handle Authentication Pages 
  if (AUTH_ROUTES.includes(pathname) && token) {



    try {
      

      const { payload } = await jwtVerify(token, SECRET);
      const userRole = (payload.role as string)?.toLowerCase();



      // Redirect to role-specific dashboard
      if (userRole === 'admin') {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
      if (userRole === 'doctor') {
        return NextResponse.redirect(new URL('/doctor/dashboard', request.url));
      }
      return NextResponse.redirect(new URL('/home', request.url));




    } catch {
      
      return NextResponse.next();
    }
  }






  // 3. Handle Protected Routes
  const protectedPrefixes = ['/owner', '/doctor', '/admin', '/home', '/profile', '/account'];
  const isProtectedPath = protectedPrefixes.some(prefix => pathname.startsWith(prefix));
  const isAuthRoute = AUTH_ROUTES.includes(pathname);

  if (isProtectedPath && !isAuthRoute) {




    if (!token) {
      

      if (pathname.startsWith('/admin')) {
        return NextResponse.redirect(new URL('/admin/signin', request.url));
      }
      if (pathname.startsWith('/doctor')) {
        return NextResponse.redirect(new URL('/signin?role=doctor', request.url));
      }
      return NextResponse.redirect(new URL('/signin', request.url));
    }



    try {
      const { payload } = await jwtVerify(token, SECRET);
      const userRole = (payload.role as string)?.toLowerCase();




      // Role-based Access Control
  if (pathname.startsWith('/admin') && userRole !== 'admin') {
  return NextResponse.redirect(new URL('/admin/signin', request.url));
  }
  if (pathname.startsWith('/doctor') && userRole !== 'doctor') {
  return NextResponse.redirect(new URL('/signin?role=doctor', request.url));
  }
  if (pathname.startsWith('/owner') && userRole !== 'owner') {
 return NextResponse.redirect(new URL('/signin', request.url));
  }





      // Strict admin guard 
      if ((pathname === '/home' || pathname.startsWith('/owner') || pathname.startsWith('/doctor')) && userRole === 'admin') {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }

      //Doctors shouldn't access /owner
      if (pathname.startsWith('/owner') && userRole === 'doctor') {
        return NextResponse.redirect(new URL('/doctor/dashboard', request.url));
      }

      return NextResponse.next();
    } catch {



      // Token invalid or expirationss...



      const response = pathname.startsWith('/admin')
        ? NextResponse.redirect(new URL('/admin/signin', request.url))
        : NextResponse.redirect(new URL('/signin', request.url));

      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [

    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

export default proxy;
