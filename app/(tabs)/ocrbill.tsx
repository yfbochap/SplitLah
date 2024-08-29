import React, { useCallback, useState } from 'react';
import { View, Text, Button } from 'react-native';
import { router, useFocusEffect, useGlobalSearchParams } from 'expo-router';
import { getOCRText } from '@/services/accountService';

export default function ResultScreen() {

    const [ocrResult, setOcrResult] = useState<string | null>(null);
    const [processedText, setProcessedText] = useState<string | null>(null);
    const OPENAI_API_KEY = process.env.EXPO_PUBLIC_CHATGPT_KEY;

    useFocusEffect(
        useCallback(() => {
            checkOCRData();
        }, [])
    );
  
    // Extract the OCR result from async storage
    const checkOCRData = async () => {
        const ocr_text = await getOCRText();
        if (ocr_text) {
            setOcrResult(ocr_text);
            // Send the OCR text to ChatGPT for processing
            const prompt = `Extract items and prices from the following text which was scraped from a receipt: ${ocr_text}. Provide the output in the format: {item_name, quantity, price}`;
            const response = await getChatGPTResponse(prompt);
            setProcessedText(response);
          }
    };

    async function getChatGPTResponse(input_prompt) {
        try {
          const response = await fetch('https://api.openai.com/v1/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${OPENAI_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'babbage-002', // ALT model: text-davinci-003
              prompt: input_prompt,
              max_tokens: 550,
            }),
          });
      
          // Check if the response status is OK
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
      
          // Parse and return the response
          const data = await response.json();
          return data.choices[0].text.trim(); // Extract the response text
        } catch (error) {
          console.error('Error fetching response from OpenAI:', error);
          return null;
        }
      }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>OCR Result:</Text>
      <Text>{ocrResult}</Text>
      <Text>Processed Result:</Text>
      <Text>{processedText || 'Processing...'}</Text>
      <Button title="Back to Home" onPress={() => router.back()} />
    </View>
  );
}
