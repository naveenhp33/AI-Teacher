async function test() {
    try {
        console.log("Testing Google connection...");
        const res = await fetch("https://www.google.com");
        console.log("Status:", res.status);
        const text = await res.text();
        console.log("Response (first 50 chars):", text.substring(0, 50));
    } catch (e) {
        console.error("Test failed:", e.message);
    }
}
test();
