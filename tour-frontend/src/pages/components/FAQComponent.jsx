import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import useApi from '@/services/api';

const FAQComponent = ({ n = null }) => {
  const api = useApi();
  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const { data } = await api.get('/api/faqs/frontend');
        setFaqs(data);
      } catch (error) {
        toast.error('Failed to fetch FAQs');
      }
    };
    
    fetchFaqs();
  }, []);

  const faqData = n ? faqs.slice(0, n) : faqs;

  return (
    <Card className="mx-auto bg-gray-100 bg-opacity-75 rounded-none">
      <CardHeader>
        <CardTitle className="text-3xl font-bold font-verdana text-center mb-12 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-lg shadow-md">
          {n ? 'Frequently Asked Questions' : 'All Frequently Asked Questions'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {faqData.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-900">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default FAQComponent;
