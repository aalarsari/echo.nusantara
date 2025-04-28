import { Section } from "@react-email/section";
import { Text, Html, Container, Link } from "@react-email/components";

export default function EmailVerify(token: string, user: User) {
  return (
    <Html>
      <Section>
        <Container className=" justify-items-start">
          <Text className=" text-xl">Hallo, {user.name}</Text>
          <Text className=" text-xl">
            Thank you for registering, to activate your account please
            <Link href={`${process.env.APP_URL}/api/auth/verify/${token}`}> click here</Link>
          </Text>
        </Container>
      </Section>
    </Html>
  );
}
