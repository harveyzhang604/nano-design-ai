async function testAPI() {
  const API_KEY = 'AIzaSyDDyelQujmsPpE38O_eD8Z9sRvCQhCXUZU';
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${API_KEY}`;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        instances: [{
          prompt: "A cute cat sitting on a windowsill"
        }],
        parameters: {
          sampleCount: 1
        }
      })
    });

    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (data.predictions && data.predictions[0]) {
      console.log('\n✅ API key is working! Image generated successfully.');
      console.log('Image data length:', data.predictions[0].bytesBase64Encoded?.length || 0);
    } else if (data.error) {
      console.log('\n❌ API Error:', data.error.message);
    }
  } catch (error) {
    console.error('❌ Request failed:', error.message);
  }
}

testAPI();
