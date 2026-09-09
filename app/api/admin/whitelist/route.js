import { NextResponse } from 'next/dist/server/web/spec-extension/response';
import { auth, firestore } from '@/lib/auth';
import { headers } from 'next/headers';

// GET: Fetch all whitelisted admins
export async function GET(request) {
  try {
    const session = await auth.api.getSession({
      headers: headers()
    });

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const snapshot = await firestore.collection('adminWhitelists').get();
    const whitelists = [];
    snapshot.forEach((doc) => {
      whitelists.push({ id: doc.id, ...doc.data() });
    });

    return NextResponse.json({ whitelists });
  } catch (error) {
    console.error('Error fetching admin whitelists:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST: Add a new admin email
export async function POST(request) {
  try {
    const session = await auth.api.getSession({
      headers: headers()
    });

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const lowerEmail = email.toLowerCase().trim();

    // Check if it already exists
    const existing = await firestore.collection('adminWhitelists').where('email', '==', lowerEmail).get();
    if (!existing.empty) {
      return NextResponse.json({ error: 'Admin email already whitelisted' }, { status: 400 });
    }

    const docRef = await firestore.collection('adminWhitelists').add({
      email: lowerEmail,
      addedBy: session.user.email,
      createdAt: new Date().toISOString()
    });

    return NextResponse.json({ success: true, id: docRef.id, email: lowerEmail });
  } catch (error) {
    console.error('Error adding admin whitelist:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE: Remove an admin email
export async function DELETE(request) {
  try {
    const session = await auth.api.getSession({
      headers: headers()
    });

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await firestore.collection('adminWhitelists').doc(id).delete();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing admin whitelist:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
