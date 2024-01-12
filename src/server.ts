function createAliceResponse (message: string): Response {
  return Response.json({
    response: { text: message, tts: message, end_session: true },
    version: '1.0'
  })
}

async function fetch (request: Request): Promise<Response> {
  return createAliceResponse('Привет мир!')
}

Bun.serve({ fetch: fetch })
