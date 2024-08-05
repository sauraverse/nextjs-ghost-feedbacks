import {
    Html,
    Head,
    Font,
    Preview,
    Heading,
    Row,
    Section,
    Text,
    Button,
  } from '@react-email/components';
  
  interface VerificationEmailProps {
    username: string;
    otp: string;
  }
  
  export default function VerificationEmail({ username, otp }: VerificationEmailProps) {
    return (
      <Html lang="en" dir="ltr">
        <Head>
          <title>Verification Code</title>
          <Font
            fontFamily="Roboto"
            fallbackFontFamily="Verdana"
            webFont={{
              url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
              format: 'woff2',
            }}
            fontWeight={400}
            fontStyle="normal"
          />
        </Head>
        <Preview>Here&apos;s your verification code: {otp}</Preview>
        <Section>
          <Row>
            <Heading as="h2">Hello {username},</Heading>
          </Row>
          <Row>
            <Text>
              Thank you for registering with Ghost Messages. <br />
              Please use the following verification code to complete your registration:
            </Text>
          </Row>
          <Row>
          <Heading as="h3">{otp}</Heading> 
          </Row>
          <Row>
            <Button
              href={`https://ghostmessages.sauraverse.com/verify/${username}`}
              style={{ color: '#61dafb' }}
            >
              <Heading as="h3">Verify here</Heading>
            </Button>
          </Row>
          <Row>
            <Text>
            Thank you for joining us!
            </Text>
          </Row>
          <Row>
            <Text style={{color: "red"}}>
            <i>Verification code is only valid for <strong>30 minutes</strong>.</i>
            </Text>
          </Row>
          <Row>
            <Text>
            Best regards, <br />
            The 👻Ghost Messages Developer
            </Text>
          </Row>
          
        </Section>
      </Html>
    );
  }