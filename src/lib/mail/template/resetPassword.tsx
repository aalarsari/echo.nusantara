import { Section } from "@react-email/section";
import { Text, Html, Container, Link } from "@react-email/components";

export default function ResetPasswordTemplate(token: string, user: User) {
   return (
      <Html>
         <Section>
            <Container className=" justify-items-start">
               <Text className=" text-xl">Hallo, {user.name}</Text>
               <Text className=" text-xl">
                  Here your link reset password, this link will expire 15 minutes
                  <Link href={`${process.env.APP_URL}/api/auth/change-password/${token}`}> click here</Link>
               </Text>
            </Container>
         </Section>
      </Html>
   );
}
