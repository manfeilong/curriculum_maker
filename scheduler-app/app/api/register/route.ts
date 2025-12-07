import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { jsessionid, scriptSessionId, serialNo } = await req.json();

        if (!jsessionid || !scriptSessionId || !serialNo) {
            return NextResponse.json(
                { message: 'Missing required parameters' },
                { status: 400 }
            );
        }

        // NCU DWR Endpoint
        const url = 'https://cis.ncu.edu.tw/Course/ajax/call/plaincall/SelectCourseService.addCourseBySerialNo.dwr';

        const headers = {
            'Accept': '*/*',
            'Accept-Language': 'zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7',
            'Connection': 'keep-alive',
            'Content-Type': 'text/plain',
            'Origin': 'https://cis.ncu.edu.tw',
            'Referer': 'https://cis.ncu.edu.tw/Course/main/sign/selectCourse?step=3',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Cookie': `JSESSIONID=${jsessionid}`,
        };

        const payload = [
            'callCount=1',
            'windowName=',
            'c0-scriptName=SelectCourseService',
            'c0-methodName=addCourseBySerialNo',
            'c0-id=0',
            `c0-param0=number:${serialNo}`,
            'c0-param1=string:',
            'batchId=5',
            'page=%2FCourse%2Fmain%2Fsign%2FselectCourse%3Fstep%3D3',
            'httpSessionId=',
            `scriptSessionId=${scriptSessionId}`,
            ''
        ].join('\n');

        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: payload,
        });

        if (!response.ok) {
            return NextResponse.json(
                { success: false, message: `HTTP Error: ${response.status}` },
                { status: response.status }
            );
        }

        const text = await response.text();
        console.log('DWR Response:', text);

        // Relaxed Success Logic as per user request
        // If HTTP 200 and not an explicit exception, assume success or at least processed.
        let resultStatus = 'SUCCESS_CALL';

        if (text.includes('handleException')) {
            resultStatus = 'ERROR';
        }

        // Pass text back for frontend optional display, but backend says "Success" for any normal callback
        // The frontend can still filter for "Full" if encoded properly, but defaults to success.

        return NextResponse.json({
            success: true,
            data: text,
            status: resultStatus
        });

    } catch (error: any) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
