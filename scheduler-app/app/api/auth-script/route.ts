import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

export async function POST() {
    try {
        // Path to the python script
        // Note: process.cwd() in Next.js usually points to the root of the project (scheduler-app)
        // But the script is in the parent directory (curriculum_maker)
        // So we need to go up one level.
        const scriptPath = path.resolve(process.cwd(), '../auto_register_login.py');
        console.log("Spawning auth script at:", scriptPath);

        return new Promise((resolve) => {
            const pythonProcess = spawn('python', [scriptPath, '--json']);

            let dataString = '';
            let errorString = '';

            pythonProcess.stdout.on('data', (data) => {
                dataString += data.toString();
            });

            pythonProcess.stderr.on('data', (data) => {
                errorString += data.toString();
                // Since the script prints "Launching Browser..." etc to stdout/stderr in non-json mode, 
                // we might see some noise. In JSON mode it should only print JSON to stdout.
                // However, we didn't suppress the "Launch Browser" logs in the python script fully (imports might print).
                // But our script uses print() which goes to stdout.
                console.log(`[Python Log]: ${data}`);
            });

            pythonProcess.on('close', (code) => {
                console.log(`Child process exited with code ${code}`);

                if (code !== 0) {
                    return resolve(NextResponse.json({ error: 'Process exited with non-zero code', details: errorString }, { status: 500 }));
                }

                try {
                    // Find the last line that looks like JSON
                    // The script might print other logs before the final JSON
                    const lines = dataString.trim().split('\n');
                    let jsonResult = null;

                    for (let i = lines.length - 1; i >= 0; i--) {
                        try {
                            const parsed = JSON.parse(lines[i]);
                            // Check if it looks like our result
                            if (parsed.JSESSIONID || parsed.error) {
                                jsonResult = parsed;
                                break;
                            }
                        } catch (e) {
                            continue;
                        }
                    }

                    if (jsonResult) {
                        resolve(NextResponse.json(jsonResult));
                    } else {
                        resolve(NextResponse.json({ error: 'No valid JSON found in output', raw: dataString }, { status: 500 }));
                    }

                } catch (e) {
                    resolve(NextResponse.json({ error: 'Failed to parse JSON', raw: dataString }, { status: 500 }));
                }
            });
        });

    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
