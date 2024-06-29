import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { google } from 'googleapis';
import { readAsStringAsync } from 'expo-file-system';

const test1 = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const writeToSheet = async () => {
    try {
      // Load service account key file (example: stored in assets folder)
      const serviceAccountKey = await readAsStringAsync(
        'path-to-your-service-account-key.json',
      );
      const key = JSON.parse(serviceAccountKey);

      // Authorize with Google Sheets API
      const auth = new google.auth.GoogleAuth({
        credentials: key,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });

      const sheets = google.sheets({ version: 'v4', auth });

      // Append the data to the Google Sheet
      const response = await sheets.spreadsheets.values.append({
        spreadsheetId: 'YOUR_SPREADSHEET_ID',
        range: 'Sheet1!A:B', // Adjust range as needed
        valueInputOption: 'RAW',
        requestBody: {
          values: [[name, email]],
        },
      });

      if (response.status === 200) {
        setMessage('Data submitted successfully!');
      } else {
        setMessage('Failed to submit data.');
      }
    } catch (error) {
      console.error('Error writing to Google Sheets:', error);
      setMessage('Error submitting data.');
    }
  };

  return (
    <View>
      <TextInput placeholder="Name" value={name} onChangeText={setName} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <Button title="Submit" onPress={writeToSheet} />
      {message ? <Text>{message}</Text> : null}
    </View>
  );
};

export default test1;
