import {
  Container,
  Html,
  Head,
  Body,
  Section,
  Text,
} from "@react-email/components";

export default function SendNotificationSubscribe() {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <style>{`
          body {
            font-family: Arial, sans-serif;
            color: #333;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
            border-radius: 8px;
            border: 1px solid #e0e0e0;
          }
          .header {
            text-align: center;
            margin-bottom: 20px;
          }
          .footer {
            font-size: 12px;
            text-align: center;
            margin-top: 20px;
            color: #777;
          }
          .cta-button {
            display: inline-block;
            padding: 10px 20px;
            margin-top: 20px;
            background-color: #007bff;
            color: #fff;
            text-decoration: none;
            border-radius: 5px;
          }
        `}</style>
      </Head>
      <Body>
        <Section>
          <Container className="container">
            <div className="header">
              <h2>Thank you for subscribing!</h2>
            </div>
            <Text>Dear Subscriber,</Text>
            <Text>
              You have successfully subscribed to our newsletter. We{"'"}re
              excited to have you on board and look forward to keeping you
              updated with our latest news and offers.
            </Text>
            <div className="footer">
              <Text>
                If you did not subscribe, please disregard this email.
              </Text>
              <Text>© 2025 Your Company. All rights reserved.</Text>
            </div>
          </Container>
        </Section>
      </Body>
    </Html>
  );
}
