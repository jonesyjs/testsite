import 'tailwindcss/tailwind.css'
import "@contentful/live-preview/style.css";
import { ContentfulPreviewProvider } from '@/components/contentful-preview-provider';

export default function RootLayout({children}) {
   return (
    <html lang="en">
      <body>
         <ContentfulPreviewProvider
            locale="en-US"
            enableInspectorMode={true}
            enableLiveUpdates={true}
            debug={true} >
            {children}
          </ContentfulPreviewProvider>
      </body>
    </html>
  );
};