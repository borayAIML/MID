import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function FAQ() {
  const faqs = [
    {
      question: "The company is located in a rural area. Is it possible to transfer the company through M&A?",
      answer: "Of course, you can. We will visit you anywhere in the country free of charge. Many of the companies we have worked with as M&A intermediaries are local companies."
    },
    {
      question: "How long does it take for the M&A / company transfer to succeed?",
      answer: "The quickest is 1.5 months from the time of your request. First, we select about 500 - 1000 companies from our database and search for potential buyers. At the earliest, we will conduct an interview within one month from the retainer consultation, go through a period of due diligence, and quickly lead to the conclusion of a contract. Since our M&A Advisers have a wealth of M&A support experience, we can shorten the time required for M&A by eliminating unnecessary exchanges between matching and closing. In the M&A industry, we often hear people say, 'I requested an Adviser, but several months passed with nothing.' At the M&A Research Institute Inc., we commit to results from the customer's point of view."
    },
    {
      question: "What are the M&A intermediary fees?",
      answer: "We put our customers first and have adopted a completely success-based fee system for M&A of transfer companies. We do not receive any retainer fee or interim fee. For details, please refer to 'Pricing System'."
    },
    {
      question: "What are the advantages of the M&A Research Institute Inc.?",
      answer: "• Transferee company, completely success-based fee system (free of charge until the contract is closed) \n• Extensive track record of M&A support \n• Full support from experienced M&A Advisers \nThese are our 4 strengths. At M&A Research Institute Inc., Advisers who specialize in M&A will conduct M&A negotiations in a polite and sincere manner."
    },
    {
      question: "Will information be leaked to business partners, employees, or financial institutions?",
      answer: "Our company strives to thoroughly manage the confidential information entrusted to us by our customers. Also, when making a proposal to potential buyers, we will only disclose information after narrowing down the potential buyers and concluding an NDA (non-disclosure agreement). If you ask multiple M&A intermediary companies to act as mediators (so-called non-exclusive contracts), the risk of information leakage increases. In order to prevent information leaks, we recommend that you sign an exclusive contract with only one company as an intermediary."
    },
    {
      question: "I have not decided on M&A, but can I consult with you?",
      answer: "Please feel free to contact us. Talk with us, and we can find the best ideas together. We are happy to hear from you if you would like to collect information."
    },
    {
      question: "We are in the red this term, but is M&A possible?",
      answer: "There are many cases of M&A of loss-making companies. Consultation fee is free, so please contact us first."
    },
    {
      question: "How is the transfer price for the M&A calculated?",
      answer: "The M&A Adviser will calculate the corporate value after considering not only tangible assets and profits, but also intangible assets and know-how. Based on the results, we will determine the desired transfer price based on the owner's intentions."
    },
    {
      question: "Can I transfer or sell only one business?",
      answer: "There are various methods such as business transfer and company split, so please contact us first."
    },
    {
      question: "Will the CEO continue to be involved in the business when the transfer is decided with M&A?",
      answer: "In some cases, they will continue to be involved in the business after the transfer, and in others, they will retire. It is possible to proceed according to the president's wishes."
    }
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Frequently Asked Questions</h1>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground">
            Common questions about M&A and business succession
          </p>
          <p className="mt-2 text-sm sm:text-base">
            Please feel free to contact us directly if you have any other questions. 
            Our experienced M&A Advisers will answer your questions.
          </p>
        </div>

        <Card className="shadow-lg">
          <CardContent className="pt-4 sm:pt-6">
            <Accordion type="single" collapsible className="space-y-2">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-3 sm:px-4 mb-3 sm:mb-4">
                  <AccordionTrigger className="text-base sm:text-lg font-medium py-3 sm:py-4 hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="pb-3 sm:pb-4 pt-1 text-sm sm:text-base text-muted-foreground whitespace-pre-line">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        <div className="mt-8 sm:mt-12 text-center">
          <div className="bg-muted p-4 sm:p-6 rounded-xl">
            <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">Still have questions?</h2>
            <p className="mb-4 sm:mb-6 text-sm sm:text-base">
              Our experienced M&A Advisers are ready to provide personalized answers to your questions
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <a
                href="/contact"
                className="w-full sm:w-auto px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-center"
              >
                Contact Us
              </a>
              <a
                href="/valuation-services"
                className="w-full sm:w-auto mt-2 sm:mt-0 px-6 py-3 rounded-lg bg-muted-foreground/10 hover:bg-muted-foreground/20 transition-colors text-center"
              >
                Explore Our Services
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}