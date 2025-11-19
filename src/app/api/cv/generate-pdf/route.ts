/**
 * CV PDF Generation API
 *
 * Generates PDF from HTML content with clickable links and selectable text
 *
 * @module app/api/cv/generate-pdf/route
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { Document, Page, Text, View, StyleSheet, renderToBuffer } from '@react-pdf/renderer';
import * as cheerio from 'cheerio';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Oturum açmanız gerekiyor' },
        { status: 401 }
      );
    }

    const { html, filename } = await req.json();

    if (!html) {
      return NextResponse.json(
        { error: 'HTML içeriği gerekli' },
        { status: 400 }
      );
    }

    // Parse HTML and extract text
    const $ = cheerio.load(html);
    const extractedText = $.text();

    // Create PDF document
    const styles = StyleSheet.create({
      page: {
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        padding: 30,
      },
      text: {
        fontSize: 12,
        lineHeight: 1.5,
        color: '#000000',
      },
    });

    const MyDocument = () => (
      <Document>
        <Page size="A4" style={styles.page}>
          <View>
            <Text style={styles.text}>{extractedText}</Text>
          </View>
        </Page>
      </Document>
    );

    // Generate PDF buffer
    const pdfBuffer = await renderToBuffer(<MyDocument />);

    // Return PDF as response
    const fileName = filename || 'cv.pdf';
    return new NextResponse(Buffer.from(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });

  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: 'PDF oluşturulurken bir hata oluştu', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
