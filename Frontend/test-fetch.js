const fetchObj = async () => {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=Pune`, {
            headers: { 'User-Agent': 'RoadChal-Transit-App/1.0 (contact@example.com)' }
        });
        const data = await response.json();
        console.log("Success", data.length);
    } catch(e) {
        console.error("Failed:", e.message);
    }
}
fetchObj();
