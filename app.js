const RAPIDAPI_KEY = '755bbed88emsh8e7066c05d8fa53p1f994fjsnac108a86089e'

document.getElementById('faceSwapForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const targetImage = document.getElementById('targetImage').files[0];
    const sourceImage = document.getElementById('sourceImage').files[0];
    const matchGender = document.getElementById('matchGender').checked;
    const maxSwapNumber = parseInt(document.getElementById('maxSwapNumber').value);

    if (!targetImage || !sourceImage) {
        alert('Please select both target and source images.');
        return;
    }

    const targetBase64 = await toBase64(targetImage);
    const sourceBase64 = await toBase64(sourceImage);

    const requestBody = {
        MatchGender: matchGender,
        MaximumFaceSwapNumber: maxSwapNumber,
        TargetImageBase64Data: targetBase64.split(',')[1], // Removing 'data:image/xxx;base64,' prefix
        SourceImageBase64Data: sourceBase64.split(',')[1]
    };

    fetch('https://faceswap-image-transformation-api.p.rapidapi.com/faceswapbase64', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-RapidAPI-Host': 'faceswap-image-transformation-api.p.rapidapi.com',
            'X-RapidAPI-Key': RAPIDAPI_KEY
        },
        body: JSON.stringify(requestBody)
    })
    .then(response => response.json())
    .then(data => {
        if (data.Success) {
            document.getElementById('resultContainer').innerHTML = `
                <h3>Face Swap Result:</h3>
                <img src="${data.ResultImageUrl}" alt="Face Swap Result" />
            `;
        } else {
            alert('Face swap failed: ' + data.Message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred during the face swap process.');
    });
});

function toBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}
