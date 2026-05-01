import { NextResponse } from "next/server";

const BASE = "http://property.reworkstaging.name.ng/v1";

export async function PUT(request, { params }) {
    const { id } = await params;
    const token = request.headers.get("Authorization");

    console.log("ID:", id);
    console.log("URL:", `${BASE}/properties/${id}/resource`);
    console.log("Token:", token);

    try {
        const formData = await request.formData();

        const response = await fetch(`${BASE}/properties/${id}/resource`, {
            method: "PUT",
            headers: {
                Authorization: token,
            },
            body: formData,
        });

        console.log("API status:", response.status);

        // READ RAW TEXT FIRST before trying to parse
        const rawText = await response.text();
        console.log("API raw response:", rawText);

        // Then try to parse
        try {
            const data = JSON.parse(rawText);
            return NextResponse.json(data, { status: response.status });
        } catch {
            return NextResponse.json({ 
                message: "API returned non-JSON", 
                raw: rawText.slice(0, 500),
                apiStatus: response.status
            }, { status: 500 });
        }

    } catch (err) {
        console.error("Proxy error:", err);
        return NextResponse.json({ message: "Proxy error: " + err.message }, { status: 500 });
    }
}