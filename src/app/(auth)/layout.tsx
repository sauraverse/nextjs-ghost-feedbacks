export const metadata = {
  title: 'Ghost Messages || Authentication',
  description: 'Production grade Authentication with power of Next Auth.js and email authentication using verification OTP mail using Resend API',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
