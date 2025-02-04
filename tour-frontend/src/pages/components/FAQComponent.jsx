import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const FAQComponent = ({n = null}) => {
  let faqData = [
    {
      "question": "What are the best times to visit Morocco?",
      "answer": "The best times to visit Morocco are during spring (March to May) and autumn (September to November) when the weather is mild and pleasant."
    },
    {
      "question": "Do I need a visa to visit Morocco?",
      "answer": "Visa requirements depend on your nationality. Citizens of many countries can enter Morocco visa-free for stays up to 90 days. Please check with your local Moroccan embassy or consulate for the latest requirements."
    },
    {
      "question": "What languages are spoken in Morocco?",
      "answer": "The official languages are Arabic and Amazigh (Berber). French is widely spoken, and in some areas, English and Spanish are also understood."
    },
    {
      "question": "Is Morocco safe for tourists?",
      "answer": "Yes, Morocco is considered safe for tourists. As with any travel destination, it’s recommended to take standard precautions and remain aware of your surroundings."
    },
    {
      "question": "What should I wear when visiting Morocco?",
      "answer": "Morocco is a conservative country, so it’s recommended to dress modestly, especially in rural areas. Lightweight, breathable clothing is best for the warm climate, and comfortable shoes are ideal for exploring."
    },
    {
      "question": "Can I drink tap water in Morocco?",
      "answer": "It is advised to drink bottled or filtered water in Morocco to avoid any stomach issues. Tap water is generally safe for washing and cleaning."
    },
    {
      "question": "What currency is used in Morocco, and can I use credit cards?",
      "answer": "The currency is the Moroccan Dirham (MAD). Credit cards are accepted in most hotels, restaurants, and shops, but it’s a good idea to carry cash for smaller purchases and in rural areas."
    },
    {
      "question": "What is the tipping culture in Morocco?",
      "answer": "Tipping is customary in Morocco. In restaurants, a tip of 5-10% of the bill is appreciated. For guides, drivers, and other services, tipping is also encouraged as a token of appreciation."
    },
    {
      "question": "What are the most popular tourist attractions in Morocco?",
      "answer": "Some popular attractions include the city of Marrakech, the blue city of Chefchaouen, the Sahara Desert, Fes Medina, and the Atlas Mountains."
    },
    {
      "question": "Are there any local customs or etiquette I should be aware of?",
      "answer": "Yes, always ask permission before taking someone’s photo, especially in rural areas. Avoid public displays of affection, and be respectful of local traditions, especially during Ramadan."
    }
  ];

  if(n){
    faqData = faqData.slice(0, n);
  }


  return (
    <Card className="mx-auto bg-gray-100 bg-opacity-75 rounded-none">
      <CardHeader>
        <CardTitle className="text-3xl font-bold font-verdana text-center mb-12 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-lg shadow-md">
          {/* if n desplay frequently asked qestion else desplay all fre */}
          {n ? `Frequently asked questions` : 'All frequently asked questions'
          }
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