import { useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "react-router-dom";
import { Paragraph } from "tamagui";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getContact = async (id: string) => {
  await sleep(1000);
  return {
    id,
    name: "John Doe",
    email: "test@test.de",
  };
};

// ⬇️ define your query

const contactDetailQuery = (id: string) => ({
  queryKey: ["contacts", "detail", id],

  queryFn: async () => getContact(id),
});

export default function Contact() {
  const [searchParams] = useSearchParams();

  searchParams.forEach((value, name) => {
    console.log(name, value);
  });

  const { contactId } = useParams();
  if (!contactId) {
    throw new Error("No contactId provided");
  }

  const { data: contact } = useQuery(contactDetailQuery(contactId));

  return <Paragraph>Contact {JSON.stringify(contact, null, 2)}</Paragraph>;
}

export { Contact };
